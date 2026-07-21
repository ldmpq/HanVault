import { eq, and, lte, isNull, inArray, sql } from 'drizzle-orm';
import { db } from '../../config/database';
import { userVocabularyProgress, studySessions, deckItems, vocabularies, vocabularyMeanings, reviewLogs, userStreaks } from '../../shared/schema';
import { calculateSM2 } from './srs.utility';


export class SrsService {
  /**
   * 1. NGƯỜI DÙNG GỬI KẾT QUẢ ĐÁNH GIÁ (REVIEW) 1 TỪ VỰNG
   */
  static async submitReview(userId: string, vocabularyId: number, quality: number) {
    const existingProgress = await db.query.userVocabularyProgress.findFirst({
      where: and(
        eq(userVocabularyProgress.userId, userId),
        eq(userVocabularyProgress.vocabularyId, vocabularyId)
      ),
    });

    let prevInterval = 0;
    let prevRepetitions = 0;
    let prevEaseFactor = 2.5;

    if (existingProgress) {
      prevInterval = existingProgress.intervalDays; // Lấy đúng tên trường mới
      prevRepetitions = existingProgress.repetitions;
      prevEaseFactor = Number(existingProgress.easeFactor);
    }

    const { interval, repetitions, easeFactor } = calculateSM2(
      quality,
      prevInterval,
      prevRepetitions,
      prevEaseFactor
    );

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + interval);

    const [updatedProgress] = await db
      .insert(userVocabularyProgress)
      .values({
        userId,
        vocabularyId,
        intervalDays: interval,
        repetitions,
        easeFactor: easeFactor.toString(),
        nextReviewAt,
        lastReviewedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userVocabularyProgress.userId, userVocabularyProgress.vocabularyId],
        set: {
          intervalDays: interval,
          repetitions,
          easeFactor: easeFactor.toString(),
          nextReviewAt,
          lastReviewedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      message: 'Đã ghi nhận kết quả ôn tập!',
      progress: updatedProgress,
    };
  }

  /**
   * 2. BẮT ĐẦU PHIÊN HỌC (LẤY THẺ MỚI VÀ THẺ ĐẾN HẠN ÔN)
   */
  static async startStudySession(userId: string, deckId: number) {
    // 1. Tạo mới 1 phiên học (Session) để Tracking
    const [session] = await db.insert(studySessions).values({
      userId,
      deckId,
      sessionType: 'flashcard',
    }).returning();

    // 2. Tìm thẻ đến hạn (Due Cards - Đã học nhưng đến ngày phải ôn)
    const dueCards = await db
      .select({
        id: vocabularies.id,
        simplified: vocabularies.simplified,
        pinyin: vocabularies.pinyin,
        audioUrl: vocabularies.audioUrl,
        intervalDays: userVocabularyProgress.intervalDays,
        isNew: sql<boolean>`false`.as('is_new'), // Đánh dấu đây là thẻ cũ
      })
      .from(deckItems)
      .innerJoin(vocabularies, eq(deckItems.vocabularyId, vocabularies.id))
      .innerJoin(userVocabularyProgress, and(
        eq(userVocabularyProgress.vocabularyId, vocabularies.id),
        eq(userVocabularyProgress.userId, userId)
      ))
      .where(and(
        eq(deckItems.deckId, deckId),
        lte(userVocabularyProgress.nextReviewAt, new Date()) // Lọc thẻ có nextReviewAt <= Hiện tại
      ))
      .limit(15); // Giới hạn 15 thẻ cũ mỗi phiên

    // 3. Tìm thẻ mới tinh (New Cards - Có trong bộ thẻ nhưng chưa từng có trong bảng Progress)
    const newCards = await db
      .select({
        id: vocabularies.id,
        simplified: vocabularies.simplified,
        pinyin: vocabularies.pinyin,
        audioUrl: vocabularies.audioUrl,
        intervalDays: sql<number>`0`.as('interval_days'),
        isNew: sql<boolean>`true`.as('is_new'), // Đánh dấu là thẻ mới
      })
      .from(deckItems)
      .innerJoin(vocabularies, eq(deckItems.vocabularyId, vocabularies.id))
      .leftJoin(userVocabularyProgress, and(
        eq(userVocabularyProgress.vocabularyId, vocabularies.id),
        eq(userVocabularyProgress.userId, userId)
      ))
      .where(and(
        eq(deckItems.deckId, deckId),
        isNull(userVocabularyProgress.id) // Lọc ra những từ có progress là NULL
      ))
      .limit(10); // Lấy tối đa 10 từ mới mỗi phiên

    // 4. Trộn lẫn (Shuffle) thẻ mới và thẻ cũ
    const combinedCards = [...dueCards, ...newCards].sort(() => Math.random() - 0.5);

    // Nếu không có thẻ nào cần học
    if (combinedCards.length === 0) {
      return { sessionId: session.id, totalCards: 0, cards: [] };
    }

    // 5. Query lấy nghĩa (Meanings) cho các thẻ vừa tìm được
    const cardIds = combinedCards.map(c => c.id);
    const meanings = await db.query.vocabularyMeanings.findMany({
      where: inArray(vocabularyMeanings.vocabularyId, cardIds),
      orderBy: (meanings, { asc }) => [asc(meanings.displayOrder)],
    });

    // 6. Gắn nghĩa vào từng thẻ và trả về cho Client
    const finalCards = combinedCards.map(card => ({
      ...card,
      meanings: meanings.filter(m => m.vocabularyId === card.id)
    }));

    return {
      sessionId: session.id,
      totalCards: finalCards.length,
      cards: finalCards,
    };
  }

  /**
   * 3. KẾT THÚC PHIÊN HỌC & LƯU LỊCH SỬ (KÈM CẬP NHẬT STREAK)
   */
  static async endStudySession(userId: string, sessionId: number, data: any) {
    const { totalWords, correctWords, logs } = data;

    const session = await db.query.studySessions.findFirst({
      where: and(eq(studySessions.id, sessionId), eq(studySessions.userId, userId))
    });

    if (!session) throw new Error('SESSION_NOT_FOUND: Không tìm thấy phiên học này.');
    if (session.endedAt) throw new Error('SESSION_ENDED: Phiên học này đã được kết thúc trước đó.');

    // Chạy Transaction để đảm bảo tính toàn vẹn dữ liệu
    const streakInfo = await db.transaction(async (tx) => {
      // 1. Cập nhật Session
      await tx.update(studySessions)
        .set({ endedAt: new Date(), totalWords, correctWords })
        .where(eq(studySessions.id, sessionId));

      // 2. Chèn Logs
      if (logs && logs.length > 0) {
        const logsData = logs.map((log: any) => ({
          sessionId,
          userId,
          vocabularyId: log.vocabularyId,
          isCorrect: log.isCorrect,
          responseQuality: log.responseQuality,
          responseTimeMs: log.responseTimeMs,
          reviewedAt: new Date(),
        }));
        await tx.insert(reviewLogs).values(logsData);
      }

      // 3. TÍNH TOÁN VÀ CẬP NHẬT STREAK 🔥
      return await this.updateUserStreak(tx, userId);
    });

    return { 
      message: streakInfo.streakGained 
        ? `Tuyệt vời! Chuỗi học tập của bạn đang là ${streakInfo.currentStreak} ngày 🔥` 
        : 'Đã lưu thống kê. Bạn đã nhận được chuỗi của ngày hôm nay rồi!',
      sessionId,
      streak: streakInfo // Trả dữ liệu về để Frontend làm animation
    };
  }

  /**
   * HÀM PHỤ TRỢ: CẬP NHẬT CHUỖI NGÀY HỌC (STREAK)
   */
  private static async updateUserStreak(tx: any, userId: string) {
    // 1. Lấy ngày hôm nay và hôm qua chuẩn theo giờ Local (YYYY-MM-DD)
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localToday = new Date(now.getTime() - (offset * 60 * 1000));
    const todayStr = localToday.toISOString().split('T')[0];

    const localYesterday = new Date(localToday.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = localYesterday.toISOString().split('T')[0];

    // 2. Tìm lịch sử streak của user
    const streakRecord = await tx.query.userStreaks.findFirst({
      where: eq(userStreaks.userId, userId)
    });

    // Trường hợp 1: Người dùng mới học lần đầu tiên trong đời
    if (!streakRecord) {
      await tx.insert(userStreaks).values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: todayStr,
      });
      return { streakGained: true, currentStreak: 1 };
    }

    // Trường hợp 2: Hôm nay đã học (bấm kết thúc phiên lần thứ 2 trong ngày)
    if (streakRecord.lastStudyDate === todayStr) {
      return { streakGained: false, currentStreak: streakRecord.currentStreak };
    }

    // Trường hợp 3: Tính toán chuỗi mới (Nối tiếp hoặc Reset)
    let newStreak = 1; // Mặc định là bị reset (quên học > 1 ngày)
    
    if (streakRecord.lastStudyDate === yesterdayStr) {
      // Học đúng ngày hôm qua -> Nối chuỗi thành công!
      newStreak = streakRecord.currentStreak + 1;
    }

    const newLongest = Math.max(newStreak, streakRecord.longestStreak);

    await tx.update(userStreaks)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastStudyDate: todayStr,
      })
      .where(eq(userStreaks.userId, userId));

    return { streakGained: true, currentStreak: newStreak };
  }
}