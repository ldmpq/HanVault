import { Request, Response } from 'express';
import { eq, sql, or, and } from 'drizzle-orm';
import { db } from '../../config/database';
import { decks, deckItems, userVocabularyProgress } from '../../shared/schema';

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
        words: sql<number>`count(distinct ${deckItems.vocabularyId})::int`, 
        learnedWords: sql<number>`count(distinct case when ${userVocabularyProgress.status} != 'new' then ${deckItems.vocabularyId} else null end)::int`,
      })
      .from(decks)
      .leftJoin(deckItems, eq(decks.id, deckItems.deckId))
      .leftJoin(
        userVocabularyProgress,
        and(
          eq(deckItems.vocabularyId, userVocabularyProgress.vocabularyId),
          eq(userVocabularyProgress.userId, userId)
        )
      )
      .where(
        or(
          eq(decks.isSystem, true),
          eq(decks.ownerId, userId)
        )
      )
      .groupBy(decks.id);

    const formattedDecks = allDecks.map(deck => {
      const totalWords = Number(deck.words) || 0;
      const learned = Number(deck.learnedWords) || 0;
      const progress = totalWords > 0 ? Math.round((learned / totalWords) * 100) : 0;

      return {
        id: deck.id,
        level: deck.level,
        title: deck.title,
        words: totalWords,
        progress: progress,
      };
    });

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
    const userId = (req as any).user?.userId;

    if (isNaN(deckId)) {
      res.status(400).json({ success: false, message: 'ID bộ thẻ không hợp lệ' });
      return;
    }

    // 1. Lấy thông tin cơ bản & Tính toán thống kê
    const [deckInfo] = await db.select({
        deck: decks,
        totalWords: sql<number>`count(distinct ${deckItems.vocabularyId})::int`,
        mastered: sql<number>`count(distinct case when ${userVocabularyProgress.status} = 'mastered' then ${deckItems.vocabularyId} else null end)::int`,
        learning: sql<number>`count(distinct case when ${userVocabularyProgress.status} in ('learning', 'reviewing') then ${deckItems.vocabularyId} else null end)::int`,
    })
    .from(decks)
    .leftJoin(deckItems, eq(decks.id, deckItems.deckId))
    .leftJoin(
      userVocabularyProgress, 
      and(
        eq(deckItems.vocabularyId, userVocabularyProgress.vocabularyId),
        eq(userVocabularyProgress.userId, userId)
      )
    )
    .where(eq(decks.id, deckId))
    .groupBy(decks.id);
    
    if (!deckInfo || !deckInfo.deck) {
      res.status(404).json({ success: false, message: 'Không tìm thấy bộ thẻ' });
      return;
    }

    // Đóng gói số liệu thật
    const total = Number(deckInfo.totalWords) || 0;
    const learned = Number(deckInfo.mastered) + Number(deckInfo.learning);
    const progressPercent = total > 0 ? Math.round((learned / total) * 100) : 0;

    const finalDeckInfo = {
        ...deckInfo.deck,
        stats: {
            total,
            mastered: Number(deckInfo.mastered) || 0,
            learning: Number(deckInfo.learning) || 0,
            progressPercent
        }
    };

    // 2. Dùng Relational Query để tự động lấy từ vựng và 1 nghĩa đầu tiên
    const deckItemsData = await db.query.deckItems.findMany({
      where: eq(deckItems.deckId, deckId),
      orderBy: (items, { asc }) => [asc(items.displayOrder)], 
      with: {
        vocabulary: {
          with: {
            meanings: {
              limit: 1, 
              orderBy: (meanings, { asc }) => [asc(meanings.displayOrder)],
            }
          }
        }
      }
    });

    // 3. Format lại data trả về
    const formattedWords = deckItemsData.map(item => ({
      id: item.vocabulary.id,
      simplified: item.vocabulary.simplified,
      pinyin: item.vocabulary.pinyin,
      meaning: item.vocabulary.meanings.length > 0 ? item.vocabulary.meanings[0].meaning : 'Chưa cập nhật',
    }));

    res.status(200).json({
      success: true,
      data: {
        deck: finalDeckInfo,
        words: formattedWords
      }
    });
  } catch (error) {
    console.error('🔥 Lỗi getDeckDetails:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tải chi tiết bộ thẻ' });
  }
};