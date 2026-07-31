import { Request, Response } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../config/database';
import { decks, deckItems } from '../../shared/schema';

export const getLibraryDecks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    const allDecks = await db
      .select({
        id: decks.id,
        level: decks.hskLevel,
        title: decks.name, 
        words: sql<number>`count(${deckItems.vocabularyId})::int`, 
      })
      .from(decks)
      .leftJoin(deckItems, eq(decks.id, deckItems.deckId))
      .where(eq(decks.isSystem, true)) // Chỉ lấy bộ bài mặc định của hệ thống
      .groupBy(decks.id);

    const formattedDecks = allDecks.map(deck => ({
      ...deck,
      // Tạm thời để progress là 0, sau này sẽ JOIN với bảng user_progress để lấy % thật
      progress: 0, 
    }));

    res.status(200).json({
      success: true,
      data: formattedDecks,
    });
  } catch (error: any) {
    console.error('🔥 Lỗi getLibraryDecks:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tải dữ liệu thư viện từ Database',
    });
  }
};

export const getDeckDetails = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const deckId = parseInt(req.params.id);

    if (isNaN(deckId)) {
      res.status(400).json({ success: false, message: 'ID bộ thẻ không hợp lệ' });
      return;
    }

    // 1. Lấy thông tin cơ bản của bộ thẻ
    const [deckInfo] = await db.select().from(decks).where(eq(decks.id, deckId));
    
    if (!deckInfo) {
      res.status(404).json({ success: false, message: 'Không tìm thấy bộ thẻ' });
      return;
    }

    // 2. Dùng Relational Query để tự động lấy từ vựng và 1 nghĩa đầu tiên
    const deckItemsData = await db.query.deckItems.findMany({
      where: eq(deckItems.deckId, deckId),
      orderBy: (items, { asc }) => [asc(items.displayOrder)], // Sắp xếp theo thứ tự hiển thị trong bộ thẻ
      with: {
        vocabulary: {
          with: {
            meanings: {
              limit: 1, // Lấy duy nhất nghĩa đầu tiên ngay từ SQL
              orderBy: (meanings, { asc }) => [asc(meanings.displayOrder)],
            }
          }
        }
      }
    });

    // 3. Format lại data trả về cho Frontend
    const formattedWords = deckItemsData.map(item => ({
      id: item.vocabulary.id,
      simplified: item.vocabulary.simplified,
      pinyin: item.vocabulary.pinyin,
      // Fallback nếu từ vựng chưa có nghĩa nào
      meaning: item.vocabulary.meanings.length > 0 ? item.vocabulary.meanings[0].meaning : 'Chưa cập nhật',
    }));

    res.status(200).json({
      success: true,
      data: {
        deck: deckInfo,
        words: formattedWords
      }
    });
  } catch (error) {
    console.error('🔥 Lỗi getDeckDetails:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tải chi tiết bộ thẻ' });
  }
};