import { eq, and, ilike, desc, sql } from 'drizzle-orm';
import { db } from '../../config/database';
import { decks, deckItems, userDecks, vocabularies } from '../../shared/schema';
import { GetDecksQuery, CreateDeckInput, AddItemsInput } from './deck.validation';

export class DeckService {
  /**
   * 1. LẤY DANH SÁCH BỘ THẺ (Lọc theo System Decks hoặc Decks của User)
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
        // Đếm số lượng từ vựng trong mỗi bộ thẻ
        items: {
          columns: { vocabularyId: true },
        },
      },
    });

    // Định dạng lại dữ liệu trả về cho đẹp mắt (thêm thuộc tính totalWords)
    const formattedData = data.map((deck) => ({
      ...deck,
      totalWords: deck.items.length,
      items: undefined, // Loại bỏ mảng items thô
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
   * 2. LẤY CHI TIẾT BỘ THẺ + TOÀN BỘ DANH SÁCH TỪ VỰNG BÊN TRONG
   */
  static async getDeckById(deckId: number) {
    const deck = await db.query.decks.findFirst({
      where: eq(decks.id, deckId),
      with: {
        items: {
          with: {
            vocabulary: {
              with: { meanings: true },
            },
          },
        },
      },
    });

    if (!deck) {
      throw new Error('DECK_NOT_FOUND: Bộ thẻ không tồn tại trong hệ thống.');
    }

    // Làm phẳng cấu trúc (Flatten) để Front-end dễ dùng
    const wordList = deck.items.map((item) => item.vocabulary);

    return {
      ...deck,
      totalWords: wordList.length,
      vocabularies: wordList,
      items: undefined,
    };
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
   * 4. THÊM TỪ VỰNG VÀO BỘ THẺ (TRANSACTION TRÁNH TRÙNG LẶP)
   */
  static async addItemsToDeck(deckId: number, input: AddItemsInput) {
    const { vocabularyIds } = input;

    // Kiểm tra bộ thẻ có tồn tại không
    const deck = await db.query.decks.findFirst({ where: eq(decks.id, deckId) });
    if (!deck) throw new Error('DECK_NOT_FOUND: Bộ thẻ không tồn tại.');

    // Sử dụng Transaction để insert, tự động bỏ qua nếu từ đã có trong bộ
    await db.transaction(async (tx) => {
      for (const vocabId of vocabularyIds) {
        // Kiểm tra xem từ đã nằm trong bộ chưa
        const exists = await tx.query.deckItems.findFirst({
          where: and(eq(deckItems.deckId, deckId), eq(deckItems.vocabularyId, vocabId)),
        });

        if (!exists) {
          await tx.insert(deckItems).values({
            deckId,
            vocabularyId: vocabId,
          });
        }
      }
    });

    return this.getDeckById(deckId);
  }

  /**
   * 5. NGƯỜI DÙNG BẤM "BẮT ĐẦU HỌC" BỘ THẺ NÀY (TRACKING PROGRESS)
   */
  static async startStudyDeck(deckId: number, userId: string) {
    const deck = await db.query.decks.findFirst({ where: eq(decks.id, deckId) });
    if (!deck) throw new Error('DECK_NOT_FOUND: Bộ thẻ không tồn tại.');

    // Kiểm tra xem user đã từng đăng ký học bộ này chưa
    const existingProgress = await db.query.userDecks.findFirst({
      where: and(eq(userDecks.userId, userId), eq(userDecks.deckId, deckId)),
    });

    if (existingProgress) {
      return { message: 'Bạn đang theo học bộ thẻ này rồi!', progress: existingProgress };
    }

    // Ghi nhận bắt đầu học
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