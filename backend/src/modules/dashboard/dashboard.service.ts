import { db } from '../../config/database';
import { users, userVocabularyProgress, reviewLogs } from '../../shared/schema';
import { eq, and, lte, sql, gte } from 'drizzle-orm';

export class DashboardService {
  static async getOverviewAndHeatmap(userId: string) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // 1. Lấy thông tin User, Mục tiêu và Streak thông qua Relations
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: { streak: true }
    });

    if (!user) throw new Error('USER_NOT_FOUND: Người dùng không tồn tại');

    // 2. Tính toán thống kê Thẻ SRS (Dùng SQL Aggregation để truy vấn cực nhanh)
    const [srsStats] = await db.select({
      newCount: sql<number>`SUM(CASE WHEN ${userVocabularyProgress.status} = 'new' THEN 1 ELSE 0 END)::int`,
      readyCount: sql<number>`SUM(CASE WHEN ${userVocabularyProgress.nextReviewAt} <= ${now.toISOString()} AND ${userVocabularyProgress.nextReviewAt} > ${yesterday.toISOString()} THEN 1 ELSE 0 END)::int`,
      overdueCount: sql<number>`SUM(CASE WHEN ${userVocabularyProgress.nextReviewAt} <= ${yesterday.toISOString()} THEN 1 ELSE 0 END)::int`,
    })
    .from(userVocabularyProgress)
    .where(eq(userVocabularyProgress.userId, userId));

    // 3. Tính toán tiến độ ngày hôm nay (Daily Goal) từ bảng reviewLogs
    const [todayActivity] = await db.select({
      count: sql<number>`count(*)::int`
    })
    .from(reviewLogs)
    .where(
      and(
        eq(reviewLogs.userId, userId),
        gte(reviewLogs.reviewedAt, startOfToday)
      )
    );

    // 4. Lấy dữ liệu Heatmap (Số thẻ review mỗi ngày trong 90 ngày qua)
    const heatmapLogs = await db.select({
      date: sql<string>`DATE(${reviewLogs.reviewedAt})::text`,
      count: sql<number>`count(*)::int`
    })
    .from(reviewLogs)
    .where(
      and(
        eq(reviewLogs.userId, userId),
        gte(reviewLogs.reviewedAt, ninetyDaysAgo)
      )
    )
    .groupBy(sql`DATE(${reviewLogs.reviewedAt})`);

    // Xử lý mảng Heatmap: Chuyển đổi số lượng thẻ thành cấp độ (0-4) cho UI
    // VD: 0 thẻ = level 0 | 1-10 thẻ = level 1 | 11-30 = level 2 | 31-50 = level 3 | > 50 = level 4
    const heatmapMap = new Map(heatmapLogs.map(log => [log.date, log.count]));
    const weeklyProgress = [];
    
    for (let i = 89; i >= 0; i--) {
      const targetDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = targetDate.toISOString().split('T')[0];
      const count = heatmapMap.get(dateString) || 0;
      
      let level = 0;
      if (count > 50) level = 4;
      else if (count > 30) level = 3;
      else if (count > 10) level = 2;
      else if (count > 0) level = 1;
      
      weeklyProgress.push(level);
    }

    // 5. Trả về đúng định dạng Dashboard
    return {
      userName: user.displayName,
      dailyGoal: {
        current: todayActivity.count || 0,
        target: user.dailyGoal || 20,
      },
      streak: user.streak?.currentStreak || 0,
      flashcard: {
        new: srsStats.newCount || 0,
        ready: srsStats.readyCount || 0,
        overdue: srsStats.overdueCount || 0,
      },
      weeklyProgress: weeklyProgress 
    };
  }
}