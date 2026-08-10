import { Request, Response } from 'express';
import { db } from '../../config/database';
import { quizzes, quizQuestions, quizAttempts, quizAnswers, vocabularies, vocabularyTopics, topics, users, userStreaks } from '../../shared/schema';
import { eq, inArray, count } from 'drizzle-orm';

export const getRecommendedQuizzes = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawQuizzes = await db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        hskLevel: quizzes.hskLevel,
        quizType: quizzes.quizType,
        questionCount: count(quizQuestions.id),
      })
      .from(quizzes)
      .leftJoin(quizQuestions, eq(quizzes.id, quizQuestions.quizId))
      .groupBy(
        quizzes.id,
        quizzes.title,
        quizzes.hskLevel,
        quizzes.quizType
      )
      .limit(6);

    const formattedData = rawQuizzes.map((q) => {
      const qCount = Number(q.questionCount) || 0;

      return {
        id: q.id,
        title: q.title || `Bài thi HSK ${q.hskLevel}`,
        focus: `HSK ${q.hskLevel || 1} Focus`,
        type: q.quizType,
        duration: Math.max(10, Math.ceil(qCount * 1.2)),
        questionCount: qCount,
        description: q.quizType === 'placement' 
          ? 'Bài kiểm tra đầu vào đánh giá trình độ hiện tại của bạn.' 
          : `Bộ câu hỏi luyện tập HSK ${q.hskLevel} tổng hợp.`
      };
    });

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Lỗi khi fetch recommended quizzes:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tải danh sách Quiz' });
  }
};

export const getQuizQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const quizId = Number(req.params.quizId);

    if (isNaN(quizId)) {
      res.status(400).json({ success: false, message: 'ID Quiz không hợp lệ' });
      return;
    }

    const questionsList = await db
      .select({
        id: quizQuestions.id,
        questionType: quizQuestions.questionType,
        options: quizQuestions.options,
        character: vocabularies.simplified,
        pinyin: vocabularies.pinyin,
        hskLevel: vocabularies.hskLevel,
      })
      .from(quizQuestions)
      .leftJoin(vocabularies, eq(quizQuestions.vocabularyId, vocabularies.id))
      .where(eq(quizQuestions.quizId, quizId));

    res.status(200).json({ success: true, data: questionsList });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tải câu hỏi' });
  }
};

export const submitQuizResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const quizId = Number(req.params.quizId);
    let userId = (req as any).user?.id;

    if (!userId) {
      const [firstUser] = await db.select({ id: users.id }).from(users).limit(1);
      if (firstUser) {
        userId = firstUser.id;
      } else {
        res.status(401).json({ success: false, message: 'Lỗi: DB của bạn chưa có user nào để test.' });
        return;
      }
    }
    
    // answers format: { 101: "To understand", 102: "Tomorrow" }
    const { answers, timeSpent } = req.body;

    if (!answers || typeof answers !== 'object') {
      res.status(400).json({ success: false, message: 'Dữ liệu câu trả lời không hợp lệ' });
      return;
    }

    const dbQuestions = await db
      .select({
        questionId: quizQuestions.id,
        correctAnswer: quizQuestions.correctAnswer,
        vocabId: quizQuestions.vocabularyId,
      })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    if (dbQuestions.length === 0) {
      res.status(404).json({ success: false, message: 'Bài Quiz không tồn tại hoặc không có câu hỏi' });
      return;
    }

    const vocabIds = dbQuestions
      .map(q => q.vocabId)
      .filter((id): id is number => id !== null);

    let vocabTopicsMap: Record<number, string[]> = {};
    if (vocabIds.length > 0) {
      const topicRows = await db
        .select({
          vocabId: vocabularyTopics.vocabularyId,
          topicName: topics.name,
        })
        .from(vocabularyTopics)
        .innerJoin(topics, eq(vocabularyTopics.topicId, topics.id))
        .where(inArray(vocabularyTopics.vocabularyId, vocabIds));

      topicRows.forEach(row => {
        if (!vocabTopicsMap[row.vocabId]) vocabTopicsMap[row.vocabId] = [];
        vocabTopicsMap[row.vocabId].push(row.topicName);
      });
    }

    let correctCount = 0;
    const totalQuestions = dbQuestions.length;
    const topicStats: Record<string, { total: number; correct: number }> = {};

    const answersToInsert: {
      attemptId: number;
      questionId: number;
      userAnswer: string | null;
      isCorrect: boolean;
    }[] = [];

    const [attempt] = await db.insert(quizAttempts).values({
      userId,
      quizId,
      score: '0.00',
    }).returning({ id: quizAttempts.id });

    for (const q of dbQuestions) {
      const userAnswer = answers[q.questionId] || null;
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) correctCount++;

      answersToInsert.push({
        attemptId: attempt.id,
        questionId: q.questionId,
        userAnswer,
        isCorrect,
      });

      const qTopics = q.vocabId && vocabTopicsMap[q.vocabId] ? vocabTopicsMap[q.vocabId] : ['Ngữ pháp chung'];
      qTopics.forEach(tName => {
        if (!topicStats[tName]) topicStats[tName] = { total: 0, correct: 0 };
        topicStats[tName].total += 1;
        if (isCorrect) topicStats[tName].correct += 1;
      });
    }

    const finalScore = (correctCount / totalQuestions) * 100;
    await db.update(quizAttempts)
      .set({ score: finalScore.toFixed(2) })
      .where(eq(quizAttempts.id, attempt.id));

    if (answersToInsert.length > 0) {
      await db.insert(quizAnswers).values(answersToInsert);
    }

    // Ngưỡng 80% chính xác để xếp vào "strong", dưới đó xếp vào "cần ôn lại"
    const strongTopics: { name: string; accuracy: number }[] = [];
    const reviewTopics: { name: string; accuracy: number }[] = [];

    Object.entries(topicStats).forEach(([name, stats]) => {
      const accuracy = Math.round((stats.correct / stats.total) * 100);
      if (accuracy >= 80) {
        strongTopics.push({ name, accuracy });
      } else {
        reviewTopics.push({ name, accuracy });
      }
    });

    const [streakData] = await db
      .select({ currentStreak: userStreaks.currentStreak })
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId));

    res.status(200).json({
      success: true,
      data: {
        score: Math.round(finalScore),
        correct: correctCount,
        incorrect: totalQuestions - correctCount,
        timeSpent: timeSpent || 0,
        streak: streakData?.currentStreak || 0,
        strongTopics,
        reviewTopics,
      }
    });

  } catch (error) {
    console.error('Error submitting quiz result:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi nộp bài và chấm điểm' });
  }
};