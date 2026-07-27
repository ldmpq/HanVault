import { sql } from 'drizzle-orm';
import { db } from '../config/database';
import * as schema from '../shared/schema';
import { hashPassword } from '../shared/utils/bcrypt.utility';

/**
 * ============================================================
 * SEED SCRIPT — Dữ liệu mẫu cho HanVault (5 dòng / bảng)
 * ============================================================
 * Chạy: npx tsx src/db/seed.ts
 *
 * Thứ tự insert bám theo phụ thuộc khóa ngoại: bảng cha luôn
 * được chèn trước, ID trả về từ .returning() được dùng lại để
 * gắn vào các bảng con — không hardcode ID, an toàn với mọi
 * trạng thái database (miễn là bảng đang trống, xem mục dọn dữ
 * liệu cũ bên dưới).
 */

// UUID cố định cho 5 user mẫu — dễ tra cứu, dễ dùng lại khi test API bằng tay
const userIds = [
  'a0000000-0000-4000-8000-000000000001',
  'a0000000-0000-4000-8000-000000000002',
  'a0000000-0000-4000-8000-000000000003',
  'a0000000-0000-4000-8000-000000000004',
  'a0000000-0000-4000-8000-000000000005',
];

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu mẫu...');

  // 🧹 Dọn sạch dữ liệu cũ trước khi nạp lại — CASCADE tự động dọn luôn
  // toàn bộ 23 bảng con tham chiếu (trực tiếp hoặc gián tiếp) tới 7 bảng gốc này.
  // RESTART IDENTITY: reset lại bộ đếm serial/bigserial về 1.
  console.log('🧹 Đang xoá dữ liệu cũ...');
  await db.execute(sql`TRUNCATE TABLE users, vocabularies, topics, decks,
    quizzes, badges, courses RESTART IDENTITY CASCADE`);
  console.log('✅ Đã xoá sạch dữ liệu cũ.');

  // ============================================================
  // 1. USERS & STREAKS
  // ============================================================
  // Dùng chung 1 utility hash với AuthService.login() để đảm bảo verify được —
  // KHÔNG dùng argon2.hash() trực tiếp, vì AuthService hiện đang verify bằng bcrypt.
  const passwordHash = await hashPassword('Password123!'); // dùng chung 1 mật khẩu demo cho cả 5 user

  await db.insert(schema.users).values([
    {
      id: userIds[0],
      email: 'admin@hanvault.com',
      passwordHash,
      displayName: 'Nguyễn Văn Admin',
      currentHskLevel: 6,
      role: 'admin',
      emailVerified: true,
    },
    {
      id: userIds[1],
      email: 'tranthib@example.com',
      passwordHash,
      displayName: 'Trần Thị B',
      currentHskLevel: 2,
      targetHskLevel: 4,
      role: 'user',
      emailVerified: true,
    },
    {
      id: userIds[2],
      email: 'leminhc@example.com',
      passwordHash,
      displayName: 'Lê Minh C',
      currentHskLevel: 1,
      targetHskLevel: 3,
      role: 'user',
      emailVerified: false,
    },
    {
      id: userIds[3],
      email: 'phamthud@example.com',
      passwordHash,
      displayName: 'Phạm Thu D',
      currentHskLevel: 3,
      targetHskLevel: 5,
      role: 'user',
      emailVerified: true,
    },
    {
      id: userIds[4],
      email: 'hoangvane@example.com',
      passwordHash,
      displayName: 'Hoàng Văn E',
      currentHskLevel: 1,
      role: 'user',
      emailVerified: true,
      status: 'active',
    },
  ]);
  console.log('✅ users');

  await db.insert(schema.userStreaks).values([
    { userId: userIds[0], currentStreak: 30, longestStreak: 45, lastStudyDate: '2026-07-24' },
    { userId: userIds[1], currentStreak: 5, longestStreak: 12, lastStudyDate: '2026-07-24' },
    { userId: userIds[2], currentStreak: 0, longestStreak: 3, lastStudyDate: '2026-07-20' },
    { userId: userIds[3], currentStreak: 14, longestStreak: 14, lastStudyDate: '2026-07-24' },
    { userId: userIds[4], currentStreak: 1, longestStreak: 1, lastStudyDate: '2026-07-24' },
  ]);
  console.log('✅ user_streaks');

  // ============================================================
  // 2. VOCABULARIES & nội dung liên quan
  // ============================================================
  const vocabRows = await db
    .insert(schema.vocabularies)
    .values([
      { simplified: '你好', pinyin: 'nǐ hǎo', hskLevel: 1, partOfSpeech: 'interjection', frequencyRank: 1 },
      { simplified: '谢谢', pinyin: 'xièxie', hskLevel: 1, partOfSpeech: 'verb', frequencyRank: 2 },
      { simplified: '老师', traditional: '老師', pinyin: 'lǎoshī', hskLevel: 1, partOfSpeech: 'noun', frequencyRank: 3 },
      { simplified: '学生', traditional: '學生', pinyin: 'xuésheng', hskLevel: 1, partOfSpeech: 'noun', frequencyRank: 4 },
      { simplified: '中国', traditional: '中國', pinyin: 'Zhōngguó', hskLevel: 1, partOfSpeech: 'proper noun', frequencyRank: 5 },
    ])
    .returning({ id: schema.vocabularies.id });
  const vocabIds = vocabRows.map((v) => v.id);
  console.log('✅ vocabularies');

  await db.insert(schema.vocabularyMeanings).values([
    { vocabularyId: vocabIds[0], languageCode: 'vi', meaning: 'Xin chào' },
    { vocabularyId: vocabIds[1], languageCode: 'vi', meaning: 'Cảm ơn' },
    { vocabularyId: vocabIds[2], languageCode: 'vi', meaning: 'Giáo viên, thầy/cô giáo' },
    { vocabularyId: vocabIds[3], languageCode: 'vi', meaning: 'Học sinh, sinh viên' },
    { vocabularyId: vocabIds[4], languageCode: 'vi', meaning: 'Trung Quốc' },
  ]);
  console.log('✅ vocabulary_meanings');

  await db.insert(schema.exampleSentences).values([
    { vocabularyId: vocabIds[0], chineseText: '你好，很高兴认识你。', pinyinText: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ.', translation: 'Xin chào, rất vui được quen bạn.' },
    { vocabularyId: vocabIds[1], chineseText: '谢谢你的帮助。', pinyinText: 'Xièxie nǐ de bāngzhù.', translation: 'Cảm ơn sự giúp đỡ của bạn.' },
    { vocabularyId: vocabIds[2], chineseText: '我的老师很好。', pinyinText: 'Wǒ de lǎoshī hěn hǎo.', translation: 'Giáo viên của tôi rất tốt.' },
    { vocabularyId: vocabIds[3], chineseText: '他是一个学生。', pinyinText: 'Tā shì yí ge xuésheng.', translation: 'Anh ấy là một học sinh.' },
    { vocabularyId: vocabIds[4], chineseText: '我来自中国。', pinyinText: 'Wǒ láizì Zhōngguó.', translation: 'Tôi đến từ Trung Quốc.' },
  ]);
  console.log('✅ example_sentences');

  const topicRows = await db
    .insert(schema.topics)
    .values([
      { name: 'Chào hỏi', slug: 'chao-hoi' },
      { name: 'Gia đình', slug: 'gia-dinh' },
      { name: 'Giáo dục', slug: 'giao-duc' },
      { name: 'Du lịch', slug: 'du-lich' },
      { name: 'Ẩm thực', slug: 'am-thuc' },
    ])
    .returning({ id: schema.topics.id });
  const topicIds = topicRows.map((t) => t.id);
  console.log('✅ topics');

  await db.insert(schema.vocabularyTopics).values([
    { vocabularyId: vocabIds[0], topicId: topicIds[0] },
    { vocabularyId: vocabIds[1], topicId: topicIds[0] },
    { vocabularyId: vocabIds[2], topicId: topicIds[2] },
    { vocabularyId: vocabIds[3], topicId: topicIds[2] },
    { vocabularyId: vocabIds[4], topicId: topicIds[3] },
  ]);
  console.log('✅ vocabulary_topics');

  // ============================================================
  // 3. DECKS
  // ============================================================
  const deckRows = await db
    .insert(schema.decks)
    .values([
      { ownerId: null, name: 'HSK 1 - Từ vựng cơ bản', description: '150 từ vựng cốt lõi cấp HSK 1', hskLevel: 1, isSystem: true, isPublic: true },
      { ownerId: userIds[1], name: 'Giao tiếp hàng ngày', description: 'Từ vựng dùng trong hội thoại thường ngày', hskLevel: 2, isSystem: false, isPublic: true },
      { ownerId: userIds[2], name: 'Từ vựng du lịch', description: 'Chuẩn bị cho chuyến đi Trung Quốc', hskLevel: 2, isSystem: false, isPublic: false },
      { ownerId: null, name: 'Ôn thi HSK 2', description: 'Bộ từ ôn tập chuẩn bị thi HSK 2', hskLevel: 2, isSystem: true, isPublic: true },
      { ownerId: userIds[3], name: 'Bộ từ của tôi', description: 'Từ vựng tự sưu tầm khi đọc báo', hskLevel: 3, isSystem: false, isPublic: false },
    ])
    .returning({ id: schema.decks.id });
  const deckIds = deckRows.map((d) => d.id);
  console.log('✅ decks');

  await db.insert(schema.deckItems).values([
    { deckId: deckIds[0], vocabularyId: vocabIds[0], displayOrder: 1 },
    { deckId: deckIds[0], vocabularyId: vocabIds[1], displayOrder: 2 },
    { deckId: deckIds[0], vocabularyId: vocabIds[2], displayOrder: 3 },
    { deckId: deckIds[0], vocabularyId: vocabIds[3], displayOrder: 4 },
    { deckId: deckIds[1], vocabularyId: vocabIds[4], displayOrder: 1 },
  ]);
  console.log('✅ deck_items');

  await db.insert(schema.userDecks).values([
    { userId: userIds[0], deckId: deckIds[0] },
    { userId: userIds[1], deckId: deckIds[0] },
    { userId: userIds[1], deckId: deckIds[1] },
    { userId: userIds[2], deckId: deckIds[2] },
    { userId: userIds[3], deckId: deckIds[3] },
  ]);
  console.log('✅ user_decks');

  // ============================================================
  // 4. TIẾN ĐỘ HỌC (SRS)
  // ============================================================
  await db.insert(schema.userVocabularyProgress).values([
    { userId: userIds[1], vocabularyId: vocabIds[0], status: 'mastered', easeFactor: '2.60', intervalDays: 30, repetitions: 6, correctCount: 6, nextReviewAt: new Date('2026-08-20') },
    { userId: userIds[1], vocabularyId: vocabIds[1], status: 'reviewing', easeFactor: '2.30', intervalDays: 6, repetitions: 3, correctCount: 3, wrongCount: 1, nextReviewAt: new Date('2026-07-28') },
    { userId: userIds[2], vocabularyId: vocabIds[0], status: 'learning', easeFactor: '2.10', intervalDays: 1, repetitions: 1, correctCount: 1, nextReviewAt: new Date('2026-07-25') },
    { userId: userIds[2], vocabularyId: vocabIds[2], status: 'new', intervalDays: 0, repetitions: 0 },
    { userId: userIds[3], vocabularyId: vocabIds[4], status: 'reviewing', easeFactor: '2.50', intervalDays: 3, repetitions: 2, correctCount: 2, nextReviewAt: new Date('2026-07-26') },
  ]);
  console.log('✅ user_vocabulary_progress');

  // ============================================================
  // 5. PHIÊN ÔN TẬP & LỊCH SỬ
  // ============================================================
  const sessionRows = await db
    .insert(schema.studySessions)
    .values([
      { userId: userIds[1], deckId: deckIds[0], sessionType: 'flashcard', endedAt: new Date(), totalWords: 10, correctWords: 8 },
      { userId: userIds[1], deckId: deckIds[1], sessionType: 'typing', endedAt: new Date(), totalWords: 5, correctWords: 4 },
      { userId: userIds[2], deckId: deckIds[0], sessionType: 'flashcard', endedAt: new Date(), totalWords: 8, correctWords: 5 },
      { userId: userIds[3], deckId: deckIds[3], sessionType: 'quiz', endedAt: new Date(), totalWords: 15, correctWords: 13 },
      { userId: userIds[4], deckId: deckIds[0], sessionType: 'flashcard', totalWords: 0, correctWords: 0 }, // phiên đang dang dở, chưa endedAt
    ])
    .returning({ id: schema.studySessions.id });
  const sessionIds = sessionRows.map((s) => s.id);
  console.log('✅ study_sessions');

  await db.insert(schema.reviewLogs).values([
    { sessionId: sessionIds[0], userId: userIds[1], vocabularyId: vocabIds[0], isCorrect: true, responseQuality: 5, responseTimeMs: 1200 },
    { sessionId: sessionIds[0], userId: userIds[1], vocabularyId: vocabIds[1], isCorrect: true, responseQuality: 4, responseTimeMs: 1800 },
    { sessionId: sessionIds[1], userId: userIds[1], vocabularyId: vocabIds[4], isCorrect: false, responseQuality: 2, responseTimeMs: 3500 },
    { sessionId: sessionIds[2], userId: userIds[2], vocabularyId: vocabIds[0], isCorrect: true, responseQuality: 3, responseTimeMs: 2200 },
    { sessionId: sessionIds[3], userId: userIds[3], vocabularyId: vocabIds[4], isCorrect: true, responseQuality: 5, responseTimeMs: 900 },
  ]);
  console.log('✅ review_logs');

  // ============================================================
  // 6. QUIZ
  // ============================================================
  const quizRows = await db
    .insert(schema.quizzes)
    .values([
      { title: 'Kiểm tra đầu vào HSK 1', hskLevel: 1, quizType: 'placement' },
      { title: 'Đề thi thử HSK 1', hskLevel: 1, quizType: 'hsk_mock' },
      { title: 'Quiz chủ đề Gia đình', hskLevel: 2, quizType: 'custom' },
      { title: 'Kiểm tra nhanh 10 từ', hskLevel: 1, quizType: 'custom' },
      { title: 'Ôn tập cuối tuần', hskLevel: 2, quizType: 'custom' },
    ])
    .returning({ id: schema.quizzes.id });
  const quizIds = quizRows.map((q) => q.id);
  console.log('✅ quizzes');

  const questionRows = await db
    .insert(schema.quizQuestions)
    .values([
      { quizId: quizIds[0], vocabularyId: vocabIds[0], questionType: 'multiple_choice', options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi'], correctAnswer: 'Xin chào' },
      { quizId: quizIds[0], vocabularyId: vocabIds[1], questionType: 'multiple_choice', options: ['Xin chào', 'Cảm ơn', 'Học sinh', 'Giáo viên'], correctAnswer: 'Cảm ơn' },
      { quizId: quizIds[1], vocabularyId: vocabIds[2], questionType: 'typing', correctAnswer: 'lǎoshī' },
      { quizId: quizIds[1], vocabularyId: vocabIds[3], questionType: 'typing', correctAnswer: 'xuésheng' },
      { quizId: quizIds[3], vocabularyId: vocabIds[4], questionType: 'listening', correctAnswer: '中国' },
    ])
    .returning({ id: schema.quizQuestions.id });
  const questionIds = questionRows.map((q) => q.id);
  console.log('✅ quiz_questions');

  const attemptRows = await db
    .insert(schema.quizAttempts)
    .values([
      { userId: userIds[1], quizId: quizIds[0], score: '90.00' },
      { userId: userIds[2], quizId: quizIds[0], score: '60.00' },
      { userId: userIds[1], quizId: quizIds[1], score: '75.00' },
      { userId: userIds[3], quizId: quizIds[2], score: '100.00' },
      { userId: userIds[4], quizId: quizIds[3], score: '50.00' },
    ])
    .returning({ id: schema.quizAttempts.id });
  const attemptIds = attemptRows.map((a) => a.id);
  console.log('✅ quiz_attempts');

  // ============================================================
  // 7. TÍNH NĂNG NÂNG CAO
  // ============================================================
  const badgeRows = await db
    .insert(schema.badges)
    .values([
      { name: '7 ngày liên tục', description: 'Ôn tập liên tục 7 ngày không nghỉ', conditionType: 'streak_7' },
      { name: '100 từ đã thuộc', description: 'Đạt trạng thái mastered với 100 từ', conditionType: 'mastered_100_words' },
      { name: 'Học bá', description: 'Hoàn thành 1000 lượt ôn tập', conditionType: 'reviews_1000' },
      { name: 'Chuyên gia HSK1', description: 'Thuộc toàn bộ từ vựng HSK 1', conditionType: 'hsk1_complete' },
      { name: 'Người mới bắt đầu', description: 'Hoàn thành phiên ôn tập đầu tiên', conditionType: 'first_session' },
    ])
    .returning({ id: schema.badges.id });
  const badgeIds = badgeRows.map((b) => b.id);
  console.log('✅ badges');

  await db.insert(schema.userBadges).values([
    { userId: userIds[1], badgeId: badgeIds[4] },
    { userId: userIds[1], badgeId: badgeIds[0] },
    { userId: userIds[2], badgeId: badgeIds[4] },
    { userId: userIds[3], badgeId: badgeIds[0] },
    { userId: userIds[3], badgeId: badgeIds[1] },
  ]);
  console.log('✅ user_badges');

  await db.insert(schema.handwritingAttempts).values([
    { userId: userIds[1], vocabularyId: vocabIds[0], accuracyScore: '85.50' },
    { userId: userIds[1], vocabularyId: vocabIds[2], accuracyScore: '72.00' },
    { userId: userIds[2], vocabularyId: vocabIds[0], accuracyScore: '60.25' },
    { userId: userIds[3], vocabularyId: vocabIds[4], accuracyScore: '91.00' },
    { userId: userIds[4], vocabularyId: vocabIds[1], accuracyScore: '55.75' },
  ]);
  console.log('✅ handwriting_attempts');

  await db.insert(schema.deckReviews).values([
    { deckId: deckIds[0], userId: userIds[1], rating: 5, comment: 'Bộ từ rất sát với đề thi thật!' },
    { deckId: deckIds[0], userId: userIds[2], rating: 4, comment: 'Hữu ích, mong có thêm audio.' },
    { deckId: deckIds[1], userId: userIds[3], rating: 5, comment: 'Từ vựng thực tế, dùng được ngay.' },
    { deckId: deckIds[3], userId: userIds[4], rating: 3, comment: 'Ổn nhưng hơi ít ví dụ câu.' },
    { deckId: deckIds[1], userId: userIds[0], rating: 4, comment: 'Chất lượng tốt.' },
  ]);
  console.log('✅ deck_reviews');

  // ============================================================
  // 8. AUTH & BẢO MẬT
  // ============================================================
  await db.insert(schema.oauthAccounts).values([
    { userId: userIds[0], provider: 'google', providerUserId: 'google-uid-00001' },
    { userId: userIds[1], provider: 'google', providerUserId: 'google-uid-00002' },
    { userId: userIds[2], provider: 'facebook', providerUserId: 'fb-uid-00003' },
    { userId: userIds[3], provider: 'google', providerUserId: 'google-uid-00004' },
    { userId: userIds[4], provider: 'facebook', providerUserId: 'fb-uid-00005' },
  ]);
  console.log('✅ oauth_accounts');

  await db.insert(schema.passwordResetTokens).values([
    { userId: userIds[1], token: 'reset-token-demo-0001', expiresAt: new Date(Date.now() + 3600_000) },
    { userId: userIds[2], token: 'reset-token-demo-0002', expiresAt: new Date(Date.now() + 3600_000) },
    { userId: userIds[3], token: 'reset-token-demo-0003', expiresAt: new Date(Date.now() - 3600_000), usedAt: new Date() }, // đã dùng, hết hạn
    { userId: userIds[4], token: 'reset-token-demo-0004', expiresAt: new Date(Date.now() + 3600_000) },
    { userId: userIds[0], token: 'reset-token-demo-0005', expiresAt: new Date(Date.now() + 3600_000) },
  ]);
  console.log('✅ password_reset_tokens');

  await db.insert(schema.emailVerificationTokens).values([
    { userId: userIds[2], token: 'verify-token-demo-0001', expiresAt: new Date(Date.now() + 86_400_000) },
    { userId: userIds[0], token: 'verify-token-demo-0002', expiresAt: new Date(Date.now() + 86_400_000), verifiedAt: new Date() },
    { userId: userIds[1], token: 'verify-token-demo-0003', expiresAt: new Date(Date.now() + 86_400_000), verifiedAt: new Date() },
    { userId: userIds[3], token: 'verify-token-demo-0004', expiresAt: new Date(Date.now() + 86_400_000), verifiedAt: new Date() },
    { userId: userIds[4], token: 'verify-token-demo-0005', expiresAt: new Date(Date.now() + 86_400_000), verifiedAt: new Date() },
  ]);
  console.log('✅ email_verification_tokens');

  // ============================================================
  // 9. KHOÁ HỌC / BÀI HỌC
  // ============================================================
  const courseRows = await db
    .insert(schema.courses)
    .values([
      { name: 'Giáo trình Hán ngữ 1', description: 'Giáo trình chuẩn cho người mới bắt đầu' },
      { name: 'Giáo trình Hán ngữ 2', description: 'Tiếp nối trình độ sơ cấp' },
      { name: 'HSK Sơ cấp', description: 'Luyện thi HSK 1-2' },
      { name: 'HSK Trung cấp', description: 'Luyện thi HSK 3-4' },
      { name: 'Tiếng Trung Giao tiếp', description: 'Tập trung phản xạ hội thoại thực tế' },
    ])
    .returning({ id: schema.courses.id });
  const courseIds = courseRows.map((c) => c.id);
  console.log('✅ courses');

  const lessonRows = await db
    .insert(schema.lessons)
    .values([
      { courseId: courseIds[0], title: 'Bài 1: Chào hỏi', orderIndex: 1, deckId: deckIds[0] },
      { courseId: courseIds[0], title: 'Bài 2: Giới thiệu bản thân', orderIndex: 2, deckId: deckIds[1] },
      { courseId: courseIds[2], title: 'Bài 1: Ôn tập HSK 1', orderIndex: 1, deckId: deckIds[0] },
      { courseId: courseIds[2], title: 'Bài 2: Ôn tập HSK 2', orderIndex: 2, deckId: deckIds[3] },
      { courseId: courseIds[4], title: 'Bài 1: Ngoài quán cà phê', orderIndex: 1, deckId: deckIds[1] },
    ])
    .returning({ id: schema.lessons.id });
  const lessonIds = lessonRows.map((l) => l.id);
  console.log('✅ lessons');

  await db.insert(schema.userLessonProgress).values([
    { userId: userIds[1], lessonId: lessonIds[0], status: 'completed', completedAt: new Date() },
    { userId: userIds[1], lessonId: lessonIds[1], status: 'in_progress' },
    { userId: userIds[2], lessonId: lessonIds[0], status: 'in_progress' },
    { userId: userIds[3], lessonId: lessonIds[2], status: 'completed', completedAt: new Date() },
    { userId: userIds[4], lessonId: lessonIds[0], status: 'in_progress' },
  ]);
  console.log('✅ user_lesson_progress');

  // ============================================================
  // 10. CHI TIẾT CÂU TRẢ LỜI QUIZ
  // ============================================================
  await db.insert(schema.quizAnswers).values([
    { attemptId: attemptIds[0], questionId: questionIds[0], userAnswer: 'Xin chào', isCorrect: true },
    { attemptId: attemptIds[0], questionId: questionIds[1], userAnswer: 'Học sinh', isCorrect: false },
    { attemptId: attemptIds[1], questionId: questionIds[0], userAnswer: 'Tạm biệt', isCorrect: false },
    { attemptId: attemptIds[2], questionId: questionIds[2], userAnswer: 'lǎoshī', isCorrect: true },
    { attemptId: attemptIds[3], questionId: questionIds[3], userAnswer: 'xuésheng', isCorrect: true },
  ]);
  console.log('✅ quiz_answers');

  // ============================================================
  // 11. THÔNG BÁO
  // ============================================================
  await db.insert(schema.notifications).values([
    { userId: userIds[1], type: 'daily_reminder', title: 'Đến giờ ôn tập rồi!', message: 'Bạn có 12 từ cần ôn hôm nay.' },
    { userId: userIds[2], type: 'streak_warning', title: 'Streak sắp mất!', message: 'Ôn tập ngay để giữ chuỗi 3 ngày của bạn.' },
    { userId: userIds[3], type: 'achievement', title: 'Chúc mừng!', message: 'Bạn vừa đạt huy hiệu "7 ngày liên tục".', isRead: true },
    { userId: userIds[4], type: 'system', title: 'Chào mừng đến với HanVault', message: 'Bắt đầu hành trình chinh phục HSK ngay hôm nay.' },
    { userId: userIds[0], type: 'system', title: 'Bảo trì hệ thống', message: 'Hệ thống sẽ bảo trì lúc 2h sáng ngày mai.', isRead: true },
  ]);
  console.log('✅ notifications');

  // ============================================================
  // 12. TỪ DỄ NHẦM LẪN
  // ============================================================
  await db.insert(schema.vocabularyConfusions).values([
    { vocabularyId: vocabIds[2], confusedWithId: vocabIds[3], note: '老师 (giáo viên) dễ nhầm với 学生 (học sinh) do cùng chủ đề trường học' },
    { vocabularyId: vocabIds[3], confusedWithId: vocabIds[2], note: '学生 (học sinh) dễ nhầm với 老师 (giáo viên)' },
    { vocabularyId: vocabIds[0], confusedWithId: vocabIds[1], note: '你好 và 谢谢 hay bị lẫn khi mới học do đều là câu giao tiếp cơ bản' },
    { vocabularyId: vocabIds[4], confusedWithId: vocabIds[2], note: 'Học viên mới dễ nhầm âm giữa 中国 và 老师' },
    { vocabularyId: vocabIds[1], confusedWithId: vocabIds[0], note: '谢谢 và 你好 dễ lẫn thứ tự dùng trong hội thoại mở đầu' },
  ]);
  console.log('✅ vocabulary_confusions');

  // ============================================================
  // 13. BÁO LỖI NỘI DUNG
  // ============================================================
  await db.insert(schema.contentReports).values([
    { userId: userIds[1], vocabularyId: vocabIds[0], reason: 'Phát âm audio bị lỗi, không nghe được', status: 'pending' },
    { userId: userIds[2], vocabularyId: vocabIds[2], reason: 'Nghĩa tiếng Việt chưa chính xác lắm', status: 'reviewed', adminNote: 'Đã kiểm tra, nghĩa vẫn đúng.' },
    { userId: userIds[3], vocabularyId: vocabIds[4], reason: 'Câu ví dụ có lỗi chính tả', status: 'resolved', adminNote: 'Đã sửa câu ví dụ.', resolvedAt: new Date() },
    { userId: userIds[4], vocabularyId: vocabIds[1], reason: 'Thiếu phồn thể cho từ này', status: 'pending' },
    { userId: userIds[0], vocabularyId: null, reason: 'Trang chủ load chậm trên mobile', status: 'rejected', adminNote: 'Không liên quan tới nội dung từ vựng, đã chuyển team kỹ thuật.' },
  ]);
  console.log('✅ content_reports');

  console.log('🎉 Seed dữ liệu mẫu hoàn tất — 30 bảng, 5 dòng/bảng (~150 records).');
  console.log(`👉 Đăng nhập demo bằng 1 trong 5 email trên với mật khẩu: Password123!`);
}

main()
  .catch((err) => {
    console.error('❌ Seed thất bại:', err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });