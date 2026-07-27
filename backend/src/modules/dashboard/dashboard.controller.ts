import { Request, Response } from 'express';
import { eq, and, sql, gte, lte, desc } from 'drizzle-orm';
import { db } from '../../config/database';
import {
  users,
  userStreaks,
  userVocabularyProgress,
  vocabularies,
  vocabularyMeanings,
  reviewLogs,
  quizzes,
} from '../../shared/schema';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // =========================================================================
    // QUERY 1: Lấy thông tin User & Daily Goal (Bảng: users)
    // =========================================================================
    const [userRecord] = await db
      .select({
        displayName: users.displayName,
        dailyGoal: users.dailyGoal,
        targetHskLevel: users.targetHskLevel,
      })
      .from(users)
      .where(eq(users.id, userId));

    const dailyTarget = userRecord?.dailyGoal || 20;

    // =========================================================================
    // QUERY 2: Đếm số từ đã học/ôn tập hôm nay (Bảng: reviewLogs)
    // =========================================================================
    const todayReviewCountResult = await db
      .select({
        count: sql<number>`count(distinct ${reviewLogs.vocabularyId})`,
      })
      .from(reviewLogs)
      .where(
        and(
          eq(reviewLogs.userId, userId),
          gte(reviewLogs.reviewedAt, startOfToday),
          lte(reviewLogs.reviewedAt, endOfToday)
        )
      );

    const dailyCurrent = Number(todayReviewCountResult[0]?.count || 0);

    // =========================================================================
    // QUERY 3: Lấy Chuỗi Ngày Học (Bảng: user_streaks)
    // =========================================================================
    const [streakRecord] = await db
      .select({
        currentStreak: userStreaks.currentStreak,
      })
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId));

    const streakCount = streakRecord?.currentStreak || 0;

    // =========================================================================
    // QUERY 4: Lấy Flashcard cần học tiếp theo (Bảng: vocabularies + vocabulary_meanings)
    // =========================================================================
    // Ưu tiên lấy từ nằm trong danh sách SRS sắp tới hạn, nếu chưa có thì lấy ngẫu nhiên 1 từ
    const [nextVocab] = await db
      .select({
        simplified: vocabularies.simplified,
        pinyin: vocabularies.pinyin,
        partOfSpeech: vocabularies.partOfSpeech,
        meaning: vocabularyMeanings.meaning,
      })
      .from(vocabularies)
      .leftJoin(
        vocabularyMeanings,
        and(
          eq(vocabularies.id, vocabularyMeanings.vocabularyId),
          eq(vocabularyMeanings.languageCode, 'vi') // Hoặc 'en' tùy chọn
        )
      )
      .limit(1);

    // =========================================================================
    // QUERY 5: Đếm tổng số từ đã thành thạo (Bảng: user_vocabulary_progress)
    // =========================================================================
    const [masteredCountResult] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(userVocabularyProgress)
      .where(
        and(
          eq(userVocabularyProgress.userId, userId),
          eq(userVocabularyProgress.status, 'mastered')
        )
      );

    const masteredCount = Number(masteredCountResult?.count || 0);

    // =========================================================================
    // QUERY 6: Lấy Bài Quiz Tiếp Theo (Bảng: quizzes)
    // =========================================================================
    const [upcomingQuiz] = await db
      .select({
        title: quizzes.title,
      })
      .from(quizzes)
      .orderBy(desc(quizzes.id))
      .limit(1);

    // =========================================================================
    // QUERY 7: Thống kê Tiến độ trong 7 ngày qua (Bảng: reviewLogs)
    // =========================================================================
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Lấy số lượng từ đã xem theo từng ngày trong 7 ngày gần nhất
    const weeklyLogs = await db
      .select({
        dayOfWeek: sql<string>`TO_CHAR(${reviewLogs.reviewedAt}, 'Dy')`, // Lấy thứ: Mon, Tue, Wed...
        dateStr: sql<string>`DATE(${reviewLogs.reviewedAt})`,
        count: sql<number>`count(distinct ${reviewLogs.vocabularyId})`,
      })
      .from(reviewLogs)
      .where(
        and(
          eq(reviewLogs.userId, userId),
          gte(reviewLogs.reviewedAt, sevenDaysAgo)
        )
      )
      .groupBy(
        sql`TO_CHAR(${reviewLogs.reviewedAt}, 'Dy')`,
        sql`DATE(${reviewLogs.reviewedAt})`
      );

    // Map dữ liệu thống kê tuần
    const daysMap = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const maxCount = Math.max(...weeklyLogs.map((item) => Number(item.count)), 1);

    const weeklyProgress = daysMap.map((dayLabel, index) => {
      const match = weeklyLogs[index];
      const count = match ? Number(match.count) : 0;
      const percentage = Math.round((count / maxCount) * 100);

      return {
        day: dayLabel,
        percentage: percentage > 0 ? percentage : 15, // Đặt tối thiểu 15% để có chiều cao thanh UI
        isPeak: percentage === 100 && count > 0,
      };
    });

    // =========================================================================
    // TỔNG HỢP VÀ TRẢ VỀ RESPONSE
    // =========================================================================
    return res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        userName: userRecord?.displayName || 'Learner',
        dailyGoal: {
          current: dailyCurrent,
          target: dailyTarget,
        },
        streak: streakCount,
        flashcard: {
          simplified: nextVocab?.simplified || '你好',
          pinyin: nextVocab?.pinyin || 'nǐ hǎo',
          meaning: nextVocab?.meaning || 'Xin chào',
          partOfSpeech: nextVocab?.partOfSpeech || 'Thành ngữ / Cụm từ',
        },
        nextQuiz: {
          date: 'Tomorrow',
          title: upcomingQuiz?.title || 'HSK 3: Unit 4 Vocabulary',
        },
        mastered: {
          count: masteredCount,
          percentage: 12, // Có thể tính % theo công thức (masteredCount / totalWordsInHsk) * 100
        },
        weeklyProgress,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};