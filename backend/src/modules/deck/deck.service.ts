import { eq, and, ilike, desc, sql } from 'drizzle-orm';
import { db } from '../../config/database';
import { decks, deckItems, userDecks, vocabularies } from '../../shared/schema';
import { GetDecksQuery, CreateDeckInput, AddItemsInput } from './deck.validation';

export class DeckService {
  /**
   * 1. LẤY DANH SÁCH BỘ THẺ
   */
  static async getDecks(params: GetDecksQuery, currentUserId?: string) {
    const { page = 1, limit = 20, hskLevel, isSystem, keyword } = params;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (hskLevel) conditions.push(eq(decks.hskLevel, hskLevel));
    if (isSystem !== undefined) conditions.push(eq(decks.isSystem, isSystem));
    if (keyword) conditions.push(ilike(decks.name, `%${keyword}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.query.decks.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(decks.createdAt)],
      with: {
        items: {
          columns: { vocabularyId: true },
        },
      },
    });

    const formattedData = data.map((deck) => ({
      ...deck,
      totalWords: deck.items.length,
      items: undefined,
    }));

    const [totalRecord] = await db
      .select({ count: sql<number>`count(${decks.id})` })
      .from(decks)
      .where(whereClause);

    const total = Number(totalRecord?.count || 0);

    return {
      data: formattedData,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 2. LẤY CHI TIẾT BỘ THẺ + TỪ VỰNG BÊN TRONG
   */
  static async getDeckById(deckId: number) {
    const deck = await db.query.decks.findFirst({
      where: eq(decks.id, deckId),
      with: {
        items: {
          orderBy: (items, { asc }) => [asc(items.displayOrder)],
          with: {
            vocabulary: {
              with: { 
                audioMedia: true,
                meanings: { limit: 1, orderBy: (meanings, { asc }) => [asc(meanings.displayOrder)] },
                vocabularyCharacters: {
                  orderBy: (vc, { asc }) => [asc(vc.position)],
                  with: { character: true },
                },
              },
            },
          },
        },
      },
    });

    if (!deck) throw new Error('DECK_NOT_FOUND: Bộ thẻ không tồn tại.');

    const wordList = deck.items.map((item) => ({
      id: item.vocabulary.id,
      simplified: item.vocabulary.simplified,
      pinyin: item.vocabulary.pinyin,
      audioUrl: item.vocabulary.audioMedia?.url,
      meaning: item.vocabulary.meanings.length > 0 ? item.vocabulary.meanings[0].meaning : 'Chưa cập nhật',
      components: item.vocabulary.vocabularyCharacters.map((vc) => ({
        ch: vc.character.hanzi,
        py: vc.character.pinyin || '',
        meaning: vc.character.radicalMeaning || 'Thành phần',
      })),
    }));

    return { ...deck, totalWords: wordList.length, vocabularies: wordList, items: undefined };
  }

  /**
   * 3. TẠO BỘ THẺ MỚI
   */
  static async createDeck(input: CreateDeckInput, userId: string) {
    const [newDeck] = await db
      .insert(decks)
      .values({
        ...input,
        ownerId: userId,
      })
      .returning();

    return newDeck;
  }

  /**
   * 4. THÊM TỪ VỰNG VÀO BỘ THẺ
   */
  static async addItemsToDeck(deckId: number, input: AddItemsInput) {
    const { vocabularyIds } = input;

    const deck = await db.query.decks.findFirst({ where: eq(decks.id, deckId) });
    if (!deck) throw new Error('DECK_NOT_FOUND: Bộ thẻ không tồn tại.');

    // Tạo mảng data để Bulk Insert
    const insertData = vocabularyIds.map(vocabId => ({
      deckId,
      vocabularyId: vocabId,
    }));

    // Chỉ với 1 câu query duy nhất, Drizzle sẽ đẩy toàn bộ array vào DB.
    // Nếu từ đó đã tồn tại trong bộ (bị trùng Composite Key), nó sẽ tự động bỏ qua (onConflictDoNothing).
    await db.insert(deckItems)
      .values(insertData)
      .onConflictDoNothing();

    return this.getDeckById(deckId);
  }

  /**
   * 5. NGƯỜI DÙNG BẤM "BẮT ĐẦU HỌC" BỘ THẺ NÀY (TRACKING PROGRESS)
   */
  static async startStudyDeck(deckId: number, userId: string) {
    const deck = await db.query.decks.findFirst({ where: eq(decks.id, deckId) });
    if (!deck) throw new Error('DECK_NOT_FOUND: Bộ thẻ không tồn tại.');

    const existingProgress = await db.query.userDecks.findFirst({
      where: and(eq(userDecks.userId, userId), eq(userDecks.deckId, deckId)),
    });

    if (existingProgress) {
      return { message: 'Bạn đang theo học bộ thẻ này rồi!', progress: existingProgress };
    }

    const [newProgress] = await db
      .insert(userDecks)
      .values({
        userId,
        deckId,
        isActive: true,
      })
      .returning();

    return { message: 'Bắt đầu hành trình chinh phục bộ thẻ thành công! 🚀', progress: newProgress };
  }
}