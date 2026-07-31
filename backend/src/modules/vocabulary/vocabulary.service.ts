import { eq, ilike, or, and, desc, sql } from 'drizzle-orm';
import { db } from '../../config/database';
import { vocabularies, vocabularyMeanings, exampleSentences, exampleSentenceTranslations, media, characters, vocabularyCharacters } from '../../shared/schema';
import { GetVocabulariesQuery, CreateVocabularyInput } from './vocabulary.validation';

export class VocabularyService {
  static async getVocabularies(params: GetVocabulariesQuery) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const hskLevel = params.hskLevel ? Number(params.hskLevel) : undefined;

    const keyword = params.keyword?.trim() || '';

    const offset = (page - 1) * limit;

    const conditions = [];
    if (hskLevel) conditions.push(eq(vocabularies.hskLevel, hskLevel));
    
    if (keyword) {
      conditions.push(
        or(
          ilike(vocabularies.simplified, `%${keyword}%`), 
          ilike(vocabularies.pinyin, `%${keyword}%`),
          sql`EXISTS (
            SELECT 1 FROM vocabulary_meanings 
            WHERE vocabulary_meanings.vocabulary_id = vocabularies.id 
            AND vocabulary_meanings.meaning ILIKE ${`%${keyword}%`}
          )`
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.query.vocabularies.findMany({
      where: whereClause,
      limit, 
      offset,
      orderBy: [desc(vocabularies.id)],
      with: { 
        meanings: true,
        audioMedia: true 
      },
    });

    const [totalRecord] = await db.select({ count: sql<number>`count(${vocabularies.id})` }).from(vocabularies).where(whereClause);
    const total = Number(totalRecord?.count || 0);

    return {
      data: data.map(v => ({ ...v, audioUrl: v.audioMedia?.url, audioMedia: undefined })),
      pagination: { page, limit, totalItems: total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getVocabularyById(id: number) {
    const vocab = await db.query.vocabularies.findFirst({
      where: eq(vocabularies.id, id),
      with: {
        audioMedia: true,
        meanings: { orderBy: (m, { asc }) => [asc(m.displayOrder)] },
        vocabularyCharacters: {
          orderBy: (vc, { asc }) => [asc(vc.position)],
          with: { character: true },
        },
        examples: {
          with: { translations: true },
        },
      },
    });

    if (!vocab) throw new Error('VOCAB_NOT_FOUND: Không tìm thấy từ vựng này trong hệ thống.');

    // ADAPTER: Chuyển đổi dữ liệu cho Frontend
    return {
      id: vocab.id,
      character: vocab.simplified,
      pinyin: vocab.pinyin,
      audioUrl: vocab.audioMedia?.url || null,
      meaning: vocab.meanings.length > 0 ? vocab.meanings[0].meaning : 'Chưa cập nhật',
      
      components: vocab.vocabularyCharacters.map((vc) => ({
        ch: vc.character.hanzi,
        py: vc.character.pinyin || '',
        meaning: vc.character.radicalMeaning || 'Thành phần',
      })),
      
      examples: vocab.examples.map((ex) => {
        const targetTranslation = ex.translations.find(t => t.languageCode === 'vi') || ex.translations[0];
        return {
          ch: ex.chineseText,
          py: ex.pinyinText,
          en: targetTranslation?.translation || '',
        };
      }),
    };
  }

  static async createVocabulary(input: CreateVocabularyInput) {
    const { meanings, examples, audioUrl, imageUrl, ...vocabData } = input;

    const existing = await db.query.vocabularies.findFirst({
      where: eq(vocabularies.simplified, vocabData.simplified),
    });

    if (existing) throw new Error('VOCAB_EXISTS: Từ vựng này đã tồn tại.');

    const newVocabId = await db.transaction(async (tx) => {
      let audioMediaId = null;
      let imageMediaId = null;

      // 1. Lưu Media
      if (audioUrl) {
        const [am] = await tx.insert(media).values({ url: audioUrl, provider: 'external' }).returning();
        audioMediaId = am.id;
      }
      if (imageUrl) {
        const [im] = await tx.insert(media).values({ url: imageUrl, provider: 'external' }).returning();
        imageMediaId = im.id;
      }

      // 2. Lưu Vocabulary
      const [insertedVocab] = await tx
        .insert(vocabularies)
        .values({ ...vocabData, audioMediaId, imageMediaId })
        .returning({ id: vocabularies.id });

      // 3. Tự động tách chữ Hán và Lưu vào bảng Characters
      const chars = Array.from(vocabData.simplified); // Hỗ trợ Unicode chuẩn
      for (let i = 0; i < chars.length; i++) {
        const charStr = chars[i];
        let charRecord = await tx.query.characters.findFirst({ where: eq(characters.hanzi, charStr) });

        if (!charRecord) {
          const [newChar] = await tx.insert(characters).values({ hanzi: charStr }).returning();
          charRecord = newChar;
        }

        await tx.insert(vocabularyCharacters).values({
          vocabularyId: insertedVocab.id,
          characterId: charRecord.id,
          position: i + 1,
        });
      }

      // 4. Lưu Meanings
      if (meanings?.length) {
        await tx.insert(vocabularyMeanings).values(meanings.map((m) => ({ ...m, vocabularyId: insertedVocab.id })));
      }

      // 5. Lưu Examples & Translations
      if (examples?.length) {
        for (const ex of examples) {
          const [insertedEx] = await tx
            .insert(exampleSentences)
            .values({ vocabularyId: insertedVocab.id, chineseText: ex.chineseText, pinyinText: ex.pinyinText })
            .returning({ id: exampleSentences.id });

          await tx.insert(exampleSentenceTranslations).values(
            ex.translations.map(t => ({ sentenceId: insertedEx.id, languageCode: t.languageCode, translation: t.translation }))
          );
        }
      }

      return insertedVocab.id;
    });

    return this.getVocabularyById(newVocabId);
  }
}