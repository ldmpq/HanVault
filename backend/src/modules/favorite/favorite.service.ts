import { db } from '../../config/database';
import { decks, deckItems, userDecks } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

export class FavoriteService {
  static async toggleFavorite(userId: string, vocabularyId: number) {
    // 1. Tìm bộ thẻ Yêu thích
    const favDecks = await db.select()
      .from(decks)
      .where(and(
        eq(decks.ownerId, userId),
        eq(decks.name, '❤️ Từ vựng Yêu thích')
      ))
      .limit(1);

    let favDeck = favDecks[0];

    // 2. Tạo mới nếu chưa có
    if (!favDeck) {
      const [newDeck] = await db.insert(decks).values({
        ownerId: userId,
        name: '❤️ Từ vựng Yêu thích',
        description: 'Bộ thẻ tự động chứa các từ vựng bạn đã lưu lại để ôn tập.',
        isSystem: false,
        isPublic: false
      }).returning();
      favDeck = newDeck;

      await db.insert(userDecks).values({ userId, deckId: favDeck.id });
    }

    // 3. Kiểm tra xem từ này đã nằm trong deck chưa
    const existingItems = await db.select()
      .from(deckItems)
      .where(and(
        eq(deckItems.deckId, favDeck.id),
        eq(deckItems.vocabularyId, vocabularyId)
      ))
      .limit(1);

    const existingItem = existingItems[0];

    // 4. Bỏ tim hoặc Thả tim
    if (existingItem) {
      await db.delete(deckItems).where(
        and(eq(deckItems.deckId, favDeck.id), eq(deckItems.vocabularyId, vocabularyId))
      );
      return { status: 'removed', message: 'Đã xóa khỏi danh sách yêu thích' };
    } else {
      await db.insert(deckItems).values({ deckId: favDeck.id, vocabularyId });
      return { status: 'added', message: 'Đã lưu vào danh sách yêu thích' };
    }
  }

  static async getFavoriteIds(userId: string): Promise<number[]> {
    const favDecks = await db.select()
      .from(decks)
      .where(and(
        eq(decks.ownerId, userId),
        eq(decks.name, '❤️ Từ vựng Yêu thích')
      ))
      .limit(1);

    const favDeck = favDecks[0];
    if (!favDeck) return [];

    const items = await db.select({ vocabularyId: deckItems.vocabularyId })
      .from(deckItems)
      .where(eq(deckItems.deckId, favDeck.id));

    return items.map(item => Number(item.vocabularyId));
  }
}