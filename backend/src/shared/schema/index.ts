import { 
  pgTable, uuid, varchar, text, smallint, integer, 
  timestamp, numeric, jsonb, boolean, date, bigserial, bigint, serial,
  primaryKey, unique, index
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// 1. NHÓM: NGƯỜI DÙNG (USERS & STREAKS)
// ==========================================
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  currentHskLevel: smallint('current_hsk_level').default(1),
  targetHskLevel: smallint('target_hsk_level'),
  dailyGoal: smallint('daily_goal').default(20),
  timezone: varchar('timezone', { length: 50 }).default('Asia/Ho_Chi_Minh'),
  role: varchar('role', { length: 20 }).default('user'), // 'user' | 'admin'
  emailVerified: boolean('email_verified').default(false),
  status: varchar('status', { length: 20 }).default('active'), // 'active' | 'banned' | 'suspended'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

export const userStreaks = pgTable('user_streaks', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastStudyDate: date('last_study_date'),
});

// ==========================================
// 2. NHÓM: TỪ VỰNG (NỘI DUNG LÕI)
// ==========================================
export const vocabularies = pgTable('vocabularies', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  simplified: varchar('simplified', { length: 50 }).notNull(),
  traditional: varchar('traditional', { length: 50 }),
  pinyin: varchar('pinyin', { length: 100 }).notNull(),
  hskLevel: smallint('hsk_level').notNull(),
  partOfSpeech: varchar('part_of_speech', { length: 30 }),
  frequencyRank: integer('frequency_rank'),
  audioUrl: text('audio_url'),
  radical: varchar('radical', { length: 10 }),          // bộ thủ, ví dụ: 氵
  strokeCount: smallint('stroke_count'),
  strokeOrderUrl: text('stroke_order_url'),              // ảnh/gif/svg thứ tự nét
  imageUrl: text('image_url'),
  hskVersion: varchar('hsk_version', { length: 10 }).default('3.0'), // '2.0' | '3.0'
  deletedAt: timestamp('deleted_at', { withTimezone: true }),        // soft delete
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const vocabularyMeanings = pgTable('vocabulary_meanings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  languageCode: varchar('language_code', { length: 5 }).notNull(), // 'vi', 'en'
  meaning: text('meaning').notNull(),
  displayOrder: smallint('display_order').default(0),
});

export const exampleSentences = pgTable('example_sentences', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  chineseText: text('chinese_text').notNull(),
  pinyinText: text('pinyin_text'),
  translation: text('translation'),
  audioUrl: text('audio_url'),
  source: varchar('source', { length: 20 }).default('manual'), // 'manual' | 'ai_generated'
});

export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique(),
});

export const vocabularyTopics = pgTable('vocabulary_topics', {
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  topicId: integer('topic_id')
    .references(() => topics.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.vocabularyId, t.topicId] }),
}));

// ==========================================
// 3. NHÓM: BỘ TỪ (DECKS & WORDLISTS)
// ==========================================
export const decks = pgTable('decks', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }), // NULL nếu là deck hệ thống
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  hskLevel: smallint('hsk_level'),
  isSystem: boolean('is_system').default(false),
  isPublic: boolean('is_public').default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // soft delete
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const deckItems = pgTable('deck_items', {
  deckId: bigint('deck_id', { mode: 'number' })
    .references(() => decks.id, { onDelete: 'cascade' }).notNull(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  displayOrder: integer('display_order').default(0),
}, (t) => ({
  pk: primaryKey({ columns: [t.deckId, t.vocabularyId] }),
}));

export const userDecks = pgTable('user_decks', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  deckId: bigint('deck_id', { mode: 'number' }).references(() => decks.id, { onDelete: 'cascade' }).notNull(),
  isActive: boolean('is_active').default(true),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.deckId] }),
}));

// ==========================================
// 4. NHÓM: TIẾN ĐỘ HỌC & SRS (BẢNG LÕI)
// ==========================================
export const userVocabularyProgress = pgTable('user_vocabulary_progress', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 20 }).default('new'), // new | learning | reviewing | mastered
  
  // SM-2 / FSRS algorithms fields
  easeFactor: numeric('ease_factor', { precision: 4, scale: 2 }).default('2.50'),
  intervalDays: integer('interval_days').default(0).notNull(),
  repetitions: integer('repetitions').default(0).notNull(),
  stability: numeric('stability', { precision: 6, scale: 2 }), // FSRS
  difficulty: numeric('difficulty', { precision: 4, scale: 2 }), // FSRS
  
  nextReviewAt: timestamp('next_review_at', { withTimezone: true }),
  lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
  correctCount: integer('correct_count').default(0),
  wrongCount: integer('wrong_count').default(0),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  uniqueUserVocab: unique().on(t.userId, t.vocabularyId),
  idxProgressDue: index('idx_progress_due').on(t.userId, t.nextReviewAt),
}));

// ==========================================
// 5. NHÓM: PHIÊN ÔN TẬP & LỊCH SỬ
// ==========================================
export const studySessions = pgTable('study_sessions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  deckId: bigint('deck_id', { mode: 'number' }).references(() => decks.id),
  sessionType: varchar('session_type', { length: 20 }), // 'flashcard' | 'quiz' | 'typing' | 'test'
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  totalWords: integer('total_words').default(0),
  correctWords: integer('correct_words').default(0),
});

export const reviewLogs = pgTable('review_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sessionId: bigint('session_id', { mode: 'number' })
    .references(() => studySessions.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' }).references(() => vocabularies.id).notNull(),
  
  isCorrect: boolean('is_correct').notNull(),
  responseQuality: smallint('response_quality'), // 0-5 theo SM-2
  responseTimeMs: integer('response_time_ms'),   // thời gian phản xạ (ms)
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  idxReviewLogsUserVocab: index('idx_review_logs_user_vocab').on(t.userId, t.vocabularyId),
}));

// ==========================================
// 6. NHÓM: KIỂM TRA / TEST (QUIZZES)
// ==========================================
export const quizzes = pgTable('quizzes', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 150 }),
  hskLevel: smallint('hsk_level'),
  quizType: varchar('quiz_type', { length: 20 }), // 'placement' | 'hsk_mock' | 'custom'
});

export const quizQuestions = pgTable('quiz_questions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  quizId: bigint('quiz_id', { mode: 'number' }).references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' }).references(() => vocabularies.id),
  questionType: varchar('question_type', { length: 20 }), // 'multiple_choice' | 'listening' | 'typing'
  options: jsonb('options'),                              // ['A. ...', 'B. ...']
  correctAnswer: text('correct_answer'),
});

export const quizAttempts = pgTable('quiz_attempts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  quizId: bigint('quiz_id', { mode: 'number' }).references(() => quizzes.id).notNull(),
  score: numeric('score', { precision: 5, scale: 2 }),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// 7. NHÓM: TÍNH NĂNG NÂNG CAO (ADVANCED)
// ==========================================
export const badges = pgTable('badges', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  description: text('description'),
  iconUrl: text('icon_url'),
  conditionType: varchar('condition_type', { length: 50 }), // 'streak_7' | 'mastered_100_words'...
});

export const userBadges = pgTable('user_badges', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  badgeId: integer('badge_id').references(() => badges.id, { onDelete: 'cascade' }).notNull(),
  earnedAt: timestamp('earned_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.badgeId] }),
}));

export const handwritingAttempts = pgTable('handwriting_attempts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' }).references(() => vocabularies.id),
  imageUrl: text('image_url'),
  accuracyScore: numeric('accuracy_score', { precision: 5, scale: 2 }),
  attemptedAt: timestamp('attempted_at', { withTimezone: true }).defaultNow(),
});

export const deckReviews = pgTable('deck_reviews', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  deckId: bigint('deck_id', { mode: 'number' }).references(() => decks.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rating: smallint('rating'), // CHECK (rating BETWEEN 1 AND 5) sẽ được xử lý ở tầng Validate/API hoặc Custom SQL
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// 8. NHÓM: AUTH & BẢO MẬT
// ==========================================
export const oauthAccounts = pgTable('oauth_accounts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider: varchar('provider', { length: 20 }).notNull(), // 'google' | 'facebook'
  providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  uniqProviderUser: unique().on(t.provider, t.providerUserId),
  idxOauthUser: index('idx_oauth_user').on(t.userId),
}));

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
});

// ==========================================
// 9. NHÓM: KHOÁ HỌC / BÀI HỌC (giáo trình)
// ==========================================
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(), // "Giáo trình Hán ngữ 1"
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const lessons = pgTable('lessons', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 150 }).notNull(),
  orderIndex: integer('order_index').default(0),
  deckId: bigint('deck_id', { mode: 'number' }).references(() => decks.id), // liên kết tới deck từ vựng của bài
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  idxLessonsCourse: index('idx_lessons_course').on(t.courseId),
}));

export const userLessonProgress = pgTable('user_lesson_progress', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  lessonId: bigint('lesson_id', { mode: 'number' }).references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 20 }).default('in_progress'), // in_progress | completed
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.lessonId] }),
}));

// ==========================================
// 10. NHÓM: QUIZ - CHI TIẾT CÂU TRẢ LỜI
// ==========================================
export const quizAnswers = pgTable('quiz_answers', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  attemptId: bigint('attempt_id', { mode: 'number' })
    .references(() => quizAttempts.id, { onDelete: 'cascade' }).notNull(),
  questionId: bigint('question_id', { mode: 'number' })
    .references(() => quizQuestions.id, { onDelete: 'cascade' }).notNull(),
  userAnswer: text('user_answer'),
  isCorrect: boolean('is_correct'),
  answeredAt: timestamp('answered_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  idxQuizAnswersAttempt: index('idx_quiz_answers_attempt').on(t.attemptId),
}));

// ==========================================
// 11. NHÓM: THÔNG BÁO / NHẮC NHỞ
// ==========================================
export const notifications = pgTable('notifications', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 30 }), // 'daily_reminder' | 'streak_warning' | 'achievement' | 'system'
  title: varchar('title', { length: 150 }),
  message: text('message'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  idxNotificationsUser: index('idx_notifications_user').on(t.userId, t.isRead),
}));

// ==========================================
// 12. NHÓM: TỪ DỄ NHẦM LẪN
// ==========================================
export const vocabularyConfusions = pgTable('vocabulary_confusions', {
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  confusedWithId: bigint('confused_with_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  note: text('note'), // ví dụ: 的/得/地 dễ nhầm khi dùng
}, (t) => ({
  pk: primaryKey({ columns: [t.vocabularyId, t.confusedWithId] }),
}));

// ==========================================
// 13. NHÓM: BÁO LỖI NỘI DUNG
// ==========================================
export const contentReports = pgTable('content_reports', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' }).references(() => vocabularies.id, { onDelete: 'set null' }),
  reason: text('reason').notNull(),
  status: varchar('status', { length: 20 }).default('pending'), // pending | reviewed | resolved | rejected
  adminNote: text('admin_note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
}, (t) => ({
  idxReportsStatus: index('idx_reports_status').on(t.status),
}));

// ==========================================
// DRIZZLE RELATIONS (CHO QUERY BUILDER)
// ==========================================
export const usersRelations = relations(users, ({ one, many }) => ({
  streak: one(userStreaks, { fields: [users.id], references: [userStreaks.userId] }),
  userDecks: many(userDecks),
  progresses: many(userVocabularyProgress),
  studySessions: many(studySessions),
  reviewLogs: many(reviewLogs),
  quizAttempts: many(quizAttempts),
  userBadges: many(userBadges),
  handwritingAttempts: many(handwritingAttempts),
  deckReviews: many(deckReviews),
  oauthAccounts: many(oauthAccounts),
  lessonProgress: many(userLessonProgress),
  notifications: many(notifications),
  contentReports: many(contentReports),
}));

export const vocabulariesRelations = relations(vocabularies, ({ many }) => ({
  meanings: many(vocabularyMeanings),
  examples: many(exampleSentences),
  topics: many(vocabularyTopics),
  deckItems: many(deckItems),
  progresses: many(userVocabularyProgress),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  owner: one(users, { fields: [decks.ownerId], references: [users.id] }),
  items: many(deckItems),
  userDecks: many(userDecks),
  reviews: many(deckReviews),
}));

export const studySessionsRelations = relations(studySessions, ({ one, many }) => ({
  user: one(users, { fields: [studySessions.userId], references: [users.id] }),
  deck: one(decks, { fields: [studySessions.deckId], references: [decks.id] }),
  logs: many(reviewLogs),
}));

export const reviewLogsRelations = relations(reviewLogs, ({ one }) => ({
  session: one(studySessions, { fields: [reviewLogs.sessionId], references: [studySessions.id] }),
  user: one(users, { fields: [reviewLogs.userId], references: [users.id] }),
  vocabulary: one(vocabularies, { fields: [reviewLogs.vocabularyId], references: [vocabularies.id] }),
}));

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, { fields: [oauthAccounts.userId], references: [users.id] }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, { fields: [lessons.courseId], references: [courses.id] }),
  deck: one(decks, { fields: [lessons.deckId], references: [decks.id] }),
  userProgress: many(userLessonProgress),
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
  user: one(users, { fields: [userLessonProgress.userId], references: [users.id] }),
  lesson: one(lessons, { fields: [userLessonProgress.lessonId], references: [lessons.id] }),
}));

export const quizAnswersRelations = relations(quizAnswers, ({ one }) => ({
  attempt: one(quizAttempts, { fields: [quizAnswers.attemptId], references: [quizAttempts.id] }),
  question: one(quizQuestions, { fields: [quizAnswers.questionId], references: [quizQuestions.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const contentReportsRelations = relations(contentReports, ({ one }) => ({
  user: one(users, { fields: [contentReports.userId], references: [users.id] }),
  vocabulary: one(vocabularies, { fields: [contentReports.vocabularyId], references: [vocabularies.id] }),
}));

export const deckItemsRelations = relations(deckItems, ({ one }) => ({
  deck: one(decks, { fields: [deckItems.deckId], references: [decks.id] }),
  vocabulary: one(vocabularies, { fields: [deckItems.vocabularyId], references: [vocabularies.id] }),
}));