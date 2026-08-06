import { Request, Response } from 'express';
import { eq, and, sql, gte, lte, desc } from 'drizzle-orm';
import { db } from '../../config/database';
import { users, userStreaks, userVocabularyProgress, reviewLogs, quizzes } from '../../shared/schema';

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
      return;
    }

    // Thiết lập các mốc thời gian chuẩn
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));
    
    // Mốc tính thẻ quá hạn (Trễ hơn 1 ngày)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    // Mốc 90 ngày cho Heatmap
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89);
    ninetyDaysAgo.setHours(0, 0, 0, 0);

    const [
      userRecordArr,
      todayReviewCountResult,
      streakRecordArr,
      masteredCountResult,
      upcomingQuizArr,
      heatmapLogs,
      srsStatsResult
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

      // QUERY 4: Từ đã Mastered
      db.select({ count: sql<number>`count(*)` })
        .from(userVocabularyProgress)
        .where(
          and(
            eq(userVocabularyProgress.userId, userId),
            eq(userVocabularyProgress.status, 'mastered')
          )
        ),

      // QUERY 5: Upcoming Quiz
      db.select({ title: quizzes.title }).from(quizzes).orderBy(desc(quizzes.id)).limit(1),

      // QUERY 6: Heatmap 90 ngày
      db.select({
          dateStr: sql<string>`TO_CHAR(${reviewLogs.reviewedAt}, 'YYYY-MM-DD')`,
          count: sql<number>`count(distinct ${reviewLogs.vocabularyId})::int`,
        })
        .from(reviewLogs)
        .where(and(eq(reviewLogs.userId, userId), gte(reviewLogs.reviewedAt, ninetyDaysAgo)))
        .groupBy(sql`TO_CHAR(${reviewLogs.reviewedAt}, 'YYYY-MM-DD')`),

      // QUERY 7: Thống kê tổng quan thẻ SRS (Thay thế cho việc fetch 1 flashcard đơn lẻ)
      db.select({
        newCount: sql<number>`SUM(CASE WHEN ${userVocabularyProgress.status} = 'new' THEN 1 ELSE 0 END)::int`,
        readyCount: sql<number>`SUM(CASE WHEN ${userVocabularyProgress.nextReviewAt} <= ${new Date().toISOString()} AND ${userVocabularyProgress.nextReviewAt} > ${yesterday.toISOString()} THEN 1 ELSE 0 END)::int`,
        overdueCount: sql<number>`SUM(CASE WHEN ${userVocabularyProgress.nextReviewAt} <= ${yesterday.toISOString()} THEN 1 ELSE 0 END)::int`,
      })
      .from(userVocabularyProgress)
      .where(eq(userVocabularyProgress.userId, userId))
    ]);

    // =========================================================================
    // XỬ LÝ DỮ LIỆU SAU KHI QUERY
    // =========================================================================
    const dailyTarget = userRecordArr[0]?.dailyGoal || 20;
    const dailyCurrent = Number(todayReviewCountResult[0]?.count || 0);
    const streakCount = streakRecordArr[0]?.currentStreak || 0;
    const masteredCount = Number(masteredCountResult[0]?.count || 0);

    // Tạo mảng 90 phần tử (chứa các số từ 0 -> 4) cho UI Heatmap
    const weeklyProgress: number[] = [];
    const heatmapMap = new Map(heatmapLogs.map(log => [log.dateStr, Number(log.count)]));
    
    // Quét từ 89 ngày trước cho đến hôm nay
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      
      const count = heatmapMap.get(dateString) || 0;
      
      // Chia cấp độ màu sắc dựa trên số lượng thẻ ôn tập
      let level = 0;
      if (count >= dailyTarget * 2) level = 4; // Vượt 200% mục tiêu
      else if (count >= dailyTarget) level = 3; // Đạt mục tiêu
      else if (count >= dailyTarget / 2) level = 2; // Đạt 50% mục tiêu
      else if (count > 0) level = 1; // Có học nhưng ít
      
      weeklyProgress.push(level);
    }

    // RESPONSE: Trả về dữ liệu Dashboard cho frontend
    res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        userName: userRecordArr[0]?.displayName || 'Learner',
        dailyGoal: { current: dailyCurrent, target: dailyTarget },
        streak: streakCount,
        flashcard: {
          new: srsStatsResult[0]?.newCount || 0,
          ready: srsStatsResult[0]?.readyCount || 0,
          overdue: srsStatsResult[0]?.overdueCount || 0,
        },
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