import { eq, ilike, or, and, desc, sql } from 'drizzle-orm';
import { db } from '../../config/database';
import { vocabularies, vocabularyMeanings, exampleSentences } from '../../shared/schema';
import { GetVocabulariesQuery, CreateVocabularyInput } from './vocabulary.validation';

export class VocabularyService {
  /**
   * 1. LẤY DANH SÁCH TỪ VỰNG (CÓ PHÂN TRANG & TÌM KIẾM)
   */
  static async getVocabularies(params: GetVocabulariesQuery) {
    const { page = 1, limit = 20, hskLevel, keyword } = params;
    const offset = (page - 1) * limit;

    // Xây dựng điều kiện lọc (WHERE)
    const conditions = [];
    if (hskLevel) {
      conditions.push(eq(vocabularies.hskLevel, hskLevel));
    }
    if (keyword) {
      // Tìm kiếm gần đúng (case-insensitive) trên cả Hán tự giản thể và Pinyin
      conditions.push(
        or(
          ilike(vocabularies.simplified, `%${keyword}%`),
          ilike(vocabularies.pinyin, `%${keyword}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Query lấy danh sách từ vựng kèm theo Ý nghĩa (meanings)
    const data = await db.query.vocabularies.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(vocabularies.createdAt)],
      with: {
        meanings: true, // Nhờ Drizzle relations, tự động JOIN lấy nghĩa của từ
      },
    });

    // Đếm tổng số từ để phục vụ phân trang
    const [totalRecord] = await db
      .select({ count: sql<number>`count(${vocabularies.id})` })
      .from(vocabularies)
      .where(whereClause);

    const total = Number(totalRecord?.count || 0);

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 2. LẤY CHI TIẾT 1 TỪ VỰNG THEO ID (KÈM TRỌN BỘ VÍ DỤ & NGHĨA)
   */
  static async getVocabularyById(id: number) {
    const vocab = await db.query.vocabularies.findFirst({
      where: eq(vocabularies.id, id),
      with: {
        meanings: true,
        examples: true,
      },
    });

    if (!vocab) {
      throw new Error('VOCAB_NOT_FOUND: Không tìm thấy từ vựng này trong hệ thống.');
    }

    return vocab;
  }

  /**
   * 3. THÊM TỪ VỰNG MỚI (TRANSACTION)
   */
  static async createVocabulary(input: CreateVocabularyInput) {
    const { meanings, examples, ...vocabData } = input;

    // Kiểm tra Hán tự đã tồn tại chưa
    const existing = await db.query.vocabularies.findFirst({
      where: eq(vocabularies.simplified, vocabData.simplified),
    });

    if (existing) {
      throw new Error('VOCAB_EXISTS: Từ vựng (Hán tự) này đã tồn tại trong từ điển.');
    }

    // Dùng Transaction để thêm đồng thời Vocabulary, Meanings, và Examples
    const newVocabId = await db.transaction(async (tx) => {
      // 1. Insert bảng chính vocabularies
      const [insertedVocab] = await tx
        .insert(vocabularies)
        .values(vocabData)
        .returning({ id: vocabularies.id });

      // 2. Insert các ý nghĩa vào bảng vocabulary_meanings
      if (meanings && meanings.length > 0) {
        await tx.insert(vocabularyMeanings).values(
          meanings.map((m) => ({
            ...m,
            vocabularyId: insertedVocab.id,
          }))
        );
      }

      // 3. Insert các câu ví dụ vào bảng example_sentences
      if (examples && examples.length > 0) {
        await tx.insert(exampleSentences).values(
          examples.map((ex) => ({
            ...ex,
            vocabularyId: insertedVocab.id,
          }))
        );
      }

      return insertedVocab.id;
    });

    // Trả về dữ liệu hoàn chỉnh sau khi tạo
    return this.getVocabularyById(newVocabId);
  }
}