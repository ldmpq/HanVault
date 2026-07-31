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
    let prevLapses = 0;

    if (existingProgress) {
      prevInterval = existingProgress.intervalDays; 
      prevRepetitions = existingProgress.repetitions;
      prevEaseFactor = Number(existingProgress.easeFactor);
      prevLapses = existingProgress.lapses;
    }

    const { interval, repetitions, easeFactor } = calculateSM2(
      quality,
      prevInterval,
      prevRepetitions,
      prevEaseFactor
    );

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + interval);

    const newLapses = quality < 3 ? prevLapses + 1 : prevLapses;
    const newFsrsState = interval > 1 ? 2 : (interval === 1 ? 1 : 0); 
    const defaultStability = "2.00"; 
    const defaultDifficulty = "5.00";

    let newStatus: 'new' | 'learning' | 'reviewing' | 'mastered' = 'learning';
    if (interval > 21) newStatus = 'mastered';
    else if (interval > 1) newStatus = 'reviewing';

    const [updatedProgress] = await db
      .insert(userVocabularyProgress)
      .values({
        userId,
        vocabularyId,
        status: newStatus,
        intervalDays: interval,
        repetitions,
        easeFactor: easeFactor.toString(),
        nextReviewAt,
        lastReviewedAt: new Date(),
        stability: defaultStability,
        difficulty: defaultDifficulty,
        lapses: newLapses,
        fsrsState: newFsrsState,
      })
      .onConflictDoUpdate({
        target: [userVocabularyProgress.userId, userVocabularyProgress.vocabularyId],
        set: {
          status: newStatus,
          intervalDays: interval,
          repetitions,
          easeFactor: easeFactor.toString(),
          nextReviewAt,
          lastReviewedAt: new Date(),
          updatedAt: new Date(),
          lapses: newLapses,
          fsrsState: newFsrsState,
        },
      })
      .returning();

    return {
      message: 'Đã ghi nhận kết quả ôn tập!',
      progress: updatedProgress,
    };
  }

  /**
   * 2. BẮT ĐẦU PHIÊN HỌC
   */
  static async startStudySession(userId: string, deckId: number) {
    const [session] = await db.insert(studySessions).values({
      userId,
      deckId,
      sessionType: 'flashcard',
    }).returning();

    // TÌM THẺ CŨ ĐẾN HẠN
    const dueCards = await db
      .select({
        id: vocabularies.id,
        simplified: vocabularies.simplified,
        pinyin: vocabularies.pinyin,
        intervalDays: userVocabularyProgress.intervalDays,
        isNew: sql<boolean>`false`.as('is_new'), 
      })
      .from(deckItems)
      .innerJoin(vocabularies, eq(deckItems.vocabularyId, vocabularies.id))
      .innerJoin(userVocabularyProgress, and(
        eq(userVocabularyProgress.vocabularyId, vocabularies.id),
        eq(userVocabularyProgress.userId, userId)
      ))
      .where(and(
        eq(deckItems.deckId, deckId),
        lte(userVocabularyProgress.nextReviewAt, new Date()) 
      ))
      .limit(15); 

    // TÌM THẺ MỚI TINH
    const newCards = await db
      .select({
        id: vocabularies.id,
        simplified: vocabularies.simplified,
        pinyin: vocabularies.pinyin,
        intervalDays: sql<number>`0`.as('interval_days'),
        isNew: sql<boolean>`true`.as('is_new'), 
      })
      .from(deckItems)
      .innerJoin(vocabularies, eq(deckItems.vocabularyId, vocabularies.id))
      .leftJoin(userVocabularyProgress, and(
        eq(userVocabularyProgress.vocabularyId, vocabularies.id),
        eq(userVocabularyProgress.userId, userId)
      ))
      .where(and(
        eq(deckItems.deckId, deckId),
        isNull(userVocabularyProgress.userId) 
      ))
      .limit(10); 

    const combinedCards = [...dueCards, ...newCards].sort(() => Math.random() - 0.5);

    if (combinedCards.length === 0) {
      return { sessionId: session.id, totalCards: 0, cards: [] };
    }

    const cardIds = combinedCards.map(c => c.id);
    const meanings = await db.query.vocabularyMeanings.findMany({
      where: inArray(vocabularyMeanings.vocabularyId, cardIds),
      orderBy: (meanings, { asc }) => [asc(meanings.displayOrder)],
    });

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
   * 3. KẾT THÚC PHIÊN HỌC & LƯU LỊCH SỬ
   */
  static async endStudySession(userId: string, sessionId: number, data: any) {
    const { totalWords, correctWords, logs } = data;

    const session = await db.query.studySessions.findFirst({
      where: and(eq(studySessions.id, sessionId), eq(studySessions.userId, userId))
    });

    if (!session) throw new Error('SESSION_NOT_FOUND: Không tìm thấy phiên học này.');
    if (session.endedAt) throw new Error('SESSION_ENDED: Phiên học này đã được kết thúc trước đó.');

    const streakInfo = await db.transaction(async (tx) => {
      await tx.update(studySessions)
        .set({ endedAt: new Date(), totalWords, correctWords })
        .where(eq(studySessions.id, sessionId));

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

      return await this.updateUserStreak(tx, userId);
    });

    return { 
      message: streakInfo.streakGained 
        ? `Tuyệt vời! Chuỗi học tập của bạn đang là ${streakInfo.currentStreak} ngày 🔥` 
        : 'Đã lưu thống kê. Bạn đã nhận được chuỗi của ngày hôm nay rồi!',
      sessionId,
      streak: streakInfo 
    };
  }

  /**
   * HÀM PHỤ TRỢ: CẬP NHẬT STREAK
   */
  private static async updateUserStreak(tx: any, userId: string) {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localToday = new Date(now.getTime() - (offset * 60 * 1000));
    const todayStr = localToday.toISOString().split('T')[0];

    const localYesterday = new Date(localToday.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = localYesterday.toISOString().split('T')[0];

    const streakRecord = await tx.query.userStreaks.findFirst({
      where: eq(userStreaks.userId, userId)
    });

    if (!streakRecord) {
      await tx.insert(userStreaks).values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: todayStr,
      });
      return { streakGained: true, currentStreak: 1 };
    }

    if (streakRecord.lastStudyDate === todayStr) {
      return { streakGained: false, currentStreak: streakRecord.currentStreak };
    }

    let newStreak = 1; 
    if (streakRecord.lastStudyDate === yesterdayStr) {
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