import { Request, Response } from 'express';
import { eq, and, sql, gte, lte, desc } from 'drizzle-orm';
import { db } from '../../config/database';
import {
  users,
  userStreaks,
  userVocabularyProgress,
  vocabularies,
  reviewLogs,
  quizzes,
} from '../../shared/schema';

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    // Thiết lập mốc thời gian
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      userRecordArr,
      todayReviewCountResult,
      streakRecordArr,
      masteredCountResult,
      upcomingQuizArr,
      weeklyLogs,
      dueFlashcardArr
    ] = await Promise.all([
      // QUERY 1: User & Daily Goal
      db.select({ displayName: users.displayName, dailyGoal: users.dailyGoal })
        .from(users).where(eq(users.id, userId)),

      // QUERY 2: Số từ ôn hôm nay
      db.select({ count: sql<number>`count(distinct ${reviewLogs.vocabularyId})` })
        .from(reviewLogs).where(
          and(
            eq(reviewLogs.userId, userId),
            gte(reviewLogs.reviewedAt, startOfToday),
            lte(reviewLogs.reviewedAt, endOfToday)
          )
        ),

      // QUERY 3: Streak
      db.select({ currentStreak: userStreaks.currentStreak })
        .from(userStreaks).where(eq(userStreaks.userId, userId)),

      // QUERY 5: Từ đã Mastered
      db.select({ count: sql<number>`count(*)` })
        .from(userVocabularyProgress)
        .where(
          and(
            eq(userVocabularyProgress.userId, userId),
            eq(userVocabularyProgress.status, 'mastered')
          )
        ),

      // QUERY 6: Upcoming Quiz
      db.select({ title: quizzes.title }).from(quizzes).orderBy(desc(quizzes.id)).limit(1),

      // QUERY 7: Weekly Logs
      db.select({
          dateStr: sql<string>`TO_CHAR(${reviewLogs.reviewedAt}, 'YYYY-MM-DD')`, // Nhóm theo YYYY-MM-DD cho chính xác tuyệt đối
          count: sql<number>`count(distinct ${reviewLogs.vocabularyId})::int`,
        })
        .from(reviewLogs)
        .where(and(eq(reviewLogs.userId, userId), gte(reviewLogs.reviewedAt, sevenDaysAgo)))
        .groupBy(sql`TO_CHAR(${reviewLogs.reviewedAt}, 'YYYY-MM-DD')`),

      // QUERY 4: Flashcard sắp tới hạn (hoặc random nếu không có)
      db.query.userVocabularyProgress.findFirst({
        where: and(
          eq(userVocabularyProgress.userId, userId),
          lte(userVocabularyProgress.nextReviewAt, new Date())
        ),
        with: {
          vocabulary: {
            with: { meanings: { limit: 1 } }
          }
        }
      })
    ]);

    // =========================================================================
    // XỬ LÝ DỮ LIỆU SAU KHI QUERY
    // =========================================================================
    const dailyTarget = userRecordArr[0]?.dailyGoal || 20;
    const dailyCurrent = Number(todayReviewCountResult[0]?.count || 0);
    const streakCount = streakRecordArr[0]?.currentStreak || 0;
    const masteredCount = Number(masteredCountResult[0]?.count || 0);

    // =========================================================================
    // FIX LOGIC BIỂU ĐỒ 7 NGÀY
    // =========================================================================
    // Tạo mảng 7 ngày chuẩn (từ quá khứ đến hôm nay)
    const maxCount = Math.max(...weeklyLogs.map(item => Number(item.count)), 1);
    const weeklyProgress = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Map Chủ Nhật (0) -> Thứ Bảy (6)
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const dayLabel = dayNames[d.getDay()];

      // Tìm xem ngày này có dữ liệu trong SQL trả về không
      const matchedLog = weeklyLogs.find(log => log.dateStr === dateString);
      const count = matchedLog ? matchedLog.count : 0;
      const percentage = Math.round((count / maxCount) * 100);

      weeklyProgress.push({
        day: dayLabel,
        percentage: percentage > 0 ? percentage : 15,
        isPeak: percentage === 100 && count > 0,
      });
    }

    // =========================================================================
    // LOGIC FLASHCARD TIẾP THEO
    // =========================================================================
    let nextCardData = {
      simplified: '你好',
      pinyin: 'nǐ hǎo',
      meaning: 'Xin chào',
      partOfSpeech: 'Greeting',
    };

    if (dueFlashcardArr && dueFlashcardArr.vocabulary) {
      const v = dueFlashcardArr.vocabulary;
      nextCardData = {
        simplified: v.simplified,
        pinyin: v.pinyin,
        meaning: v.meanings.length > 0 ? v.meanings[0].meaning : 'Chưa cập nhật',
        partOfSpeech: v.partOfSpeech || 'Từ vựng',
      };
    }

    // =========================================================================
    // TRẢ VỀ RESPONSE
    // =========================================================================
    res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        userName: userRecordArr[0]?.displayName || 'Learner',
        dailyGoal: { current: dailyCurrent, target: dailyTarget },
        streak: streakCount,
        flashcard: nextCardData,
        nextQuiz: {
          date: 'Ngày mai',
          title: upcomingQuizArr[0]?.title || 'Chưa có bài kiểm tra',
        },
        mastered: {
          count: masteredCount,
          percentage: 12, 
        },
        weeklyProgress,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};