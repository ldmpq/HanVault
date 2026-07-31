import { pgTable, pgEnum, uuid, varchar, text, smallint, integer,timestamp, numeric, jsonb, boolean, date, bigserial, bigint, serial,primaryKey, unique, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// ENUMS
// ==========================================
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'banned', 'suspended']);
export const progressStatusEnum = pgEnum('progress_status', ['new', 'learning', 'reviewing', 'mastered']);
export const sessionTypeEnum = pgEnum('session_type', ['flashcard', 'quiz', 'typing', 'test']);
export const exampleSourceEnum = pgEnum('example_source', ['manual', 'ai_generated']);
export const quizTypeEnum = pgEnum('quiz_type', ['placement', 'hsk_mock', 'custom']);
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'listening', 'typing']);
export const lessonProgressStatusEnum = pgEnum('lesson_progress_status', ['in_progress', 'completed']);
export const notificationTypeEnum = pgEnum('notification_type', ['daily_reminder', 'streak_warning', 'achievement', 'system']);
export const reportStatusEnum = pgEnum('report_status', ['pending', 'reviewed', 'resolved', 'rejected']);
export const oauthProviderEnum = pgEnum('oauth_provider', ['google', 'facebook']);

// ==========================================
// 0. NHÓM: MEDIA (QUẢN LÝ FILE TẬP TRUNG)
// ==========================================
export const media = pgTable('media', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  url: text('url').notNull(),
  provider: varchar('provider', { length: 50 }),
  mime: varchar('mime', { length: 50 }),
  size: integer('size'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// 1. NHÓM: NGƯỜI DÙNG (USERS & STREAKS)
// ==========================================
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }), // NULL nếu chỉ đăng nhập qua OAuth
  displayName: varchar('display_name', { length: 100 }),
  avatarMediaId: bigint('avatar_media_id', { mode: 'number' }).references(() => media.id),
  currentHskLevel: smallint('current_hsk_level').default(1),
  targetHskLevel: smallint('target_hsk_level'),
  dailyGoal: smallint('daily_goal').default(20),
  timezone: varchar('timezone', { length: 50 }).default('Asia/Ho_Chi_Minh'),
  role: userRoleEnum('role').default('user'),
  emailVerified: boolean('email_verified').default(false),
  status: userStatusEnum('status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

export const userStreaks = pgTable('user_streaks', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastStudyDate: date('last_study_date'),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  idxRefreshTokensUser: index('idx_refresh_tokens_user').on(t.userId),
}));

// ==========================================
// 2. NHÓM: HÁN TỰ (CHARACTERS & COMPONENTS)
// ==========================================
export const characters = pgTable('characters', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  hanzi: varchar('hanzi', { length: 10 }).notNull(),
  traditional: varchar('traditional', { length: 10 }),
  pinyin: varchar('pinyin', { length: 100 }),
  radical: varchar('radical', { length: 10 }),
  radicalMeaning: varchar('radical_meaning', { length: 100 }),
  strokeCount: smallint('stroke_count'),
  strokeOrderData: jsonb('stroke_order_data'),
  decomposition: varchar('decomposition', { length: 50 }),
  unicode: varchar('unicode', { length: 10 }),
  frequencyRank: integer('frequency_rank'),
  audioMediaId: bigint('audio_media_id', { mode: 'number' }).references(() => media.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (t) => ({
  idxCharacterHanzi: index('idx_character_hanzi').on(t.hanzi),
  idxCharacterRadical: index('idx_character_radical').on(t.radical),
}));

// Hỗ trợ chữ đa âm (多音字) — VD: 行 = xíng / háng tuỳ ngữ cảnh
export const characterPronunciations = pgTable('character_pronunciations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  characterId: bigint('character_id', { mode: 'number' })
    .references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  pinyin: varchar('pinyin', { length: 50 }).notNull(),
  isPrimary: boolean('is_primary').default(false),
});

// Phân rã ký tự thành bộ phận cấu thành — VD: 谢 = 讠+ 身 + 寸
export const characterComponents = pgTable('character_components', {
  characterId: bigint('character_id', { mode: 'number' })
    .references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  componentCharacterId: bigint('component_character_id', { mode: 'number' })
    .references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  position: smallint('position'),
}, (t) => ({
  pk: primaryKey({ columns: [t.characterId, t.componentCharacterId] }),
}));

// ==========================================
// 3. NHÓM: TỪ VỰNG (VOCABULARY CỐT LÕI)
// ==========================================
export const vocabularies = pgTable('vocabularies', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  simplified: varchar('simplified', { length: 50 }).notNull(),
  traditional: varchar('traditional', { length: 50 }),
  pinyin: varchar('pinyin', { length: 100 }).notNull(),
  hskLevel: smallint('hsk_level').notNull(),
  partOfSpeech: varchar('part_of_speech', { length: 30 }),
  frequencyRank: integer('frequency_rank'),
  audioMediaId: bigint('audio_media_id', { mode: 'number' }).references(() => media.id),
  imageMediaId: bigint('image_media_id', { mode: 'number' }).references(() => media.id),
  hskVersion: varchar('hsk_version', { length: 10 }).default('3.0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (t) => ({
  idxVocabSimplified: index('idx_vocab_simplified').on(t.simplified),
  idxVocabTraditional: index('idx_vocab_traditional').on(t.traditional),
  idxVocabPinyin: index('idx_vocab_pinyin').on(t.pinyin),
  idxVocabHskLevel: index('idx_vocab_hsk_level').on(t.hskLevel),
  idxVocabFreqRank: index('idx_vocab_freq_rank').on(t.frequencyRank),
}));

export const vocabularyCharacters = pgTable('vocabulary_characters', {
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  characterId: bigint('character_id', { mode: 'number' })
    .references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  position: smallint('position').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.vocabularyId, t.position] }), // ✅ sửa từ characterId -> position
  idxVocabCharsChar: index('idx_vocab_chars_char').on(t.characterId),
}));

export const vocabularyMeanings = pgTable('vocabulary_meanings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  languageCode: varchar('language_code', { length: 5 }).notNull(),
  meaning: text('meaning').notNull(),
  displayOrder: smallint('display_order').default(0),
}, (t) => ({
  idxMeaningLang: index('idx_meaning_lang').on(t.languageCode),
}));

export const exampleSentences = pgTable('example_sentences', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  chineseText: text('chinese_text').notNull(),
  pinyinText: text('pinyin_text'),
  audioMediaId: bigint('audio_media_id', { mode: 'number' }).references(() => media.id),
  source: exampleSourceEnum('source').default('manual'),
});

export const exampleSentenceTranslations = pgTable('example_sentence_translations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sentenceId: bigint('sentence_id', { mode: 'number' })
    .references(() => exampleSentences.id, { onDelete: 'cascade' }).notNull(),
  languageCode: varchar('language_code', { length: 5 }).notNull(),
  translation: text('translation').notNull(),
}, (t) => ({
  idxExampleTranslationsSentence: index('idx_example_translations_sentence').on(t.sentenceId, t.languageCode),
}));

export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
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
// 4. NHÓM: BỘ TỪ (DECKS & WORDLISTS)
// ==========================================
export const decks = pgTable('decks', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  hskLevel: smallint('hsk_level'),
  isSystem: boolean('is_system').default(false),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
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
// 5. NHÓM: TIẾN ĐỘ HỌC & SRS (BẢNG LÕI)
// ==========================================
export const userVocabularyProgress = pgTable('user_vocabulary_progress', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  status: progressStatusEnum('status').default('new'),

  easeFactor: numeric('ease_factor', { precision: 4, scale: 2 }).default('2.50'),
  intervalDays: integer('interval_days').default(0).notNull(),
  repetitions: integer('repetitions').default(0).notNull(),

  stability: numeric('stability', { precision: 6, scale: 2 }),
  difficulty: numeric('difficulty', { precision: 4, scale: 2 }),
  lapses: integer('lapses').default(0).notNull(),
  fsrsState: smallint('fsrs_state').default(0).notNull(),

  nextReviewAt: timestamp('next_review_at', { withTimezone: true }),
  lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
  correctCount: integer('correct_count').default(0),
  wrongCount: integer('wrong_count').default(0),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.vocabularyId] }),
  idxProgressDue: index('idx_progress_due').on(t.userId, t.nextReviewAt),
}));

// ==========================================
// 6. NHÓM: PHIÊN ÔN TẬP & LỊCH SỬ
// ==========================================
export const studySessions = pgTable('study_sessions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  deckId: bigint('deck_id', { mode: 'number' }).references(() => decks.id, { onDelete: 'set null' }),
  sessionType: sessionTypeEnum('session_type'),
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
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),

  isCorrect: boolean('is_correct').notNull(),
  responseQuality: smallint('response_quality'),
  responseTimeMs: integer('response_time_ms'),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  idxReviewLogsUserVocab: index('idx_review_logs_user_vocab').on(t.userId, t.vocabularyId),
}));

// ==========================================
// 7. NHÓM: KIỂM TRA / TEST (QUIZZES)
// ==========================================
export const quizzes = pgTable('quizzes', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 150 }),
  hskLevel: smallint('hsk_level'),
  quizType: quizTypeEnum('quiz_type'),
});

export const quizQuestions = pgTable('quiz_questions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  quizId: bigint('quiz_id', { mode: 'number' }).references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' }).references(() => vocabularies.id, { onDelete: 'set null' }),
  questionType: questionTypeEnum('question_type'),
  options: jsonb('options'),
  correctAnswer: text('correct_answer'),
});

export const quizAttempts = pgTable('quiz_attempts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  quizId: bigint('quiz_id', { mode: 'number' }).references(() => quizzes.id).notNull(),
  score: numeric('score', { precision: 5, scale: 2 }),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow(),
});

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
// 8. NHÓM: TÍNH NĂNG NÂNG CAO (ADVANCED)
// ==========================================
export const badges = pgTable('badges', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  description: text('description'),
  iconMediaId: bigint('icon_media_id', { mode: 'number' }).references(() => media.id),
  conditionType: varchar('condition_type', { length: 50 }),
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
  vocabularyId: bigint('vocabulary_id', { mode: 'number' }).references(() => vocabularies.id, { onDelete: 'cascade' }),
  imageMediaId: bigint('image_media_id', { mode: 'number' }).references(() => media.id),
  accuracyScore: numeric('accuracy_score', { precision: 5, scale: 2 }),
  attemptedAt: timestamp('attempted_at', { withTimezone: true }).defaultNow(),
});

export const deckReviews = pgTable('deck_reviews', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  deckId: bigint('deck_id', { mode: 'number' }).references(() => decks.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rating: smallint('rating'),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// 9. NHÓM: AUTH & BẢO MẬT
// ==========================================
export const oauthAccounts = pgTable('oauth_accounts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider: oauthProviderEnum('provider').notNull(),
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
// 10. NHÓM: KHOÁ HỌC / BÀI HỌC (Giáo trình)
// ==========================================
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  coverImageMediaId: bigint('cover_image_media_id', { mode: 'number' }).references(() => media.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const lessons = pgTable('lessons', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 150 }).notNull(),
  orderIndex: integer('order_index').default(0),
  deckId: bigint('deck_id', { mode: 'number' }).references(() => decks.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (t) => ({
  idxLessonsCourse: index('idx_lessons_course').on(t.courseId),
}));

export const userLessonProgress = pgTable('user_lesson_progress', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  lessonId: bigint('lesson_id', { mode: 'number' }).references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  status: lessonProgressStatusEnum('status').default('in_progress'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.lessonId] }),
}));

// ==========================================
// 11. NHÓM: THÔNG BÁO & LỖI NỘI DUNG
// ==========================================
export const notifications = pgTable('notifications', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: notificationTypeEnum('type'),
  title: varchar('title', { length: 150 }),
  message: text('message'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  idxNotificationsUser: index('idx_notifications_user').on(t.userId, t.isRead),
}));

export const vocabularyConfusions = pgTable('vocabulary_confusions', {
  vocabularyId: bigint('vocabulary_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  confusedWithId: bigint('confused_with_id', { mode: 'number' })
    .references(() => vocabularies.id, { onDelete: 'cascade' }).notNull(),
  note: text('note'),
}, (t) => ({
  pk: primaryKey({ columns: [t.vocabularyId, t.confusedWithId] }),
}));

export const contentReports = pgTable('content_reports', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vocabularyId: bigint('vocabulary_id', { mode: 'number' }).references(() => vocabularies.id, { onDelete: 'set null' }),
  reason: text('reason').notNull(),
  status: reportStatusEnum('status').default('pending'),
  adminNote: text('admin_note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
}, (t) => ({
  idxReportsStatus: index('idx_reports_status').on(t.status),
}));


// =========================================================================
// DRIZZLE RELATIONS
// =========================================================================

export const mediaRelations = relations(media, ({ many }) => ({
  users: many(users),
  vocabulariesAudio: many(vocabularies, { relationName: 'audioMedia' }),
  vocabulariesImage: many(vocabularies, { relationName: 'imageMedia' }),
  charactersAudio: many(characters, { relationName: 'audioMedia' }),
  exampleSentences: many(exampleSentences),
  badges: many(badges),
  courses: many(courses),
  handwritingAttempts: many(handwritingAttempts),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  avatar: one(media, { fields: [users.avatarMediaId], references: [media.id] }),
  streak: one(userStreaks, { fields: [users.id], references: [userStreaks.userId] }),
  refreshTokens: many(refreshTokens),
  ownedDecks: many(decks),
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

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  audioMedia: one(media, { fields: [characters.audioMediaId], references: [media.id], relationName: 'audioMedia' }),
  pronunciations: many(characterPronunciations),
  vocabularyCharacters: many(vocabularyCharacters),
  componentsAsParent: many(characterComponents, { relationName: 'parentCharacter' }),
  componentsAsChild: many(characterComponents, { relationName: 'childComponent' }),
}));

export const characterPronunciationsRelations = relations(characterPronunciations, ({ one }) => ({
  character: one(characters, { fields: [characterPronunciations.characterId], references: [characters.id] }),
}));

export const characterComponentsRelations = relations(characterComponents, ({ one }) => ({
  parent: one(characters, { fields: [characterComponents.characterId], references: [characters.id], relationName: 'parentCharacter' }),
  component: one(characters, { fields: [characterComponents.componentCharacterId], references: [characters.id], relationName: 'childComponent' }),
}));

export const vocabulariesRelations = relations(vocabularies, ({ one, many }) => ({
  audioMedia: one(media, { fields: [vocabularies.audioMediaId], references: [media.id], relationName: 'audioMedia' }),
  imageMedia: one(media, { fields: [vocabularies.imageMediaId], references: [media.id], relationName: 'imageMedia' }),
  vocabularyCharacters: many(vocabularyCharacters),
  meanings: many(vocabularyMeanings),
  examples: many(exampleSentences),
  topics: many(vocabularyTopics),
  deckItems: many(deckItems),
  progresses: many(userVocabularyProgress),
  confusions: many(vocabularyConfusions, { relationName: 'baseVocabulary' }),
  confusedByOthers: many(vocabularyConfusions, { relationName: 'confusedVocabulary' }),
}));

export const vocabularyCharactersRelations = relations(vocabularyCharacters, ({ one }) => ({
  vocabulary: one(vocabularies, { fields: [vocabularyCharacters.vocabularyId], references: [vocabularies.id] }),
  character: one(characters, { fields: [vocabularyCharacters.characterId], references: [characters.id] }),
}));

export const vocabularyMeaningsRelations = relations(vocabularyMeanings, ({ one }) => ({
  vocabulary: one(vocabularies, { fields: [vocabularyMeanings.vocabularyId], references: [vocabularies.id] }),
}));

export const exampleSentencesRelations = relations(exampleSentences, ({ one, many }) => ({
  vocabulary: one(vocabularies, { fields: [exampleSentences.vocabularyId], references: [vocabularies.id] }),
  audioMedia: one(media, { fields: [exampleSentences.audioMediaId], references: [media.id] }),
  translations: many(exampleSentenceTranslations),
}));

export const exampleSentenceTranslationsRelations = relations(exampleSentenceTranslations, ({ one }) => ({
  sentence: one(exampleSentences, { fields: [exampleSentenceTranslations.sentenceId], references: [exampleSentences.id] }),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  vocabularyTopics: many(vocabularyTopics),
}));

export const vocabularyTopicsRelations = relations(vocabularyTopics, ({ one }) => ({
  vocabulary: one(vocabularies, { fields: [vocabularyTopics.vocabularyId], references: [vocabularies.id] }),
  topic: one(topics, { fields: [vocabularyTopics.topicId], references: [topics.id] }),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  owner: one(users, { fields: [decks.ownerId], references: [users.id] }),
  items: many(deckItems),
  userDecks: many(userDecks),
  reviews: many(deckReviews),
  studySessions: many(studySessions),
  lessons: many(lessons),
}));

export const deckItemsRelations = relations(deckItems, ({ one }) => ({
  deck: one(decks, { fields: [deckItems.deckId], references: [decks.id] }),
  vocabulary: one(vocabularies, { fields: [deckItems.vocabularyId], references: [vocabularies.id] }),
}));

export const userDecksRelations = relations(userDecks, ({ one }) => ({
  user: one(users, { fields: [userDecks.userId], references: [users.id] }),
  deck: one(decks, { fields: [userDecks.deckId], references: [decks.id] }),
}));

export const userVocabularyProgressRelations = relations(userVocabularyProgress, ({ one }) => ({
  user: one(users, { fields: [userVocabularyProgress.userId], references: [users.id] }),
  vocabulary: one(vocabularies, { fields: [userVocabularyProgress.vocabularyId], references: [vocabularies.id] }),
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

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, { fields: [quizQuestions.quizId], references: [quizzes.id] }),
  vocabulary: one(vocabularies, { fields: [quizQuestions.vocabularyId], references: [vocabularies.id] }),
  answers: many(quizAnswers),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one, many }) => ({
  user: one(users, { fields: [quizAttempts.userId], references: [users.id] }),
  quiz: one(quizzes, { fields: [quizAttempts.quizId], references: [quizzes.id] }),
  answers: many(quizAnswers),
}));

export const quizAnswersRelations = relations(quizAnswers, ({ one }) => ({
  attempt: one(quizAttempts, { fields: [quizAnswers.attemptId], references: [quizAttempts.id] }),
  question: one(quizQuestions, { fields: [quizAnswers.questionId], references: [quizQuestions.id] }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
  badge: one(badges, { fields: [userBadges.badgeId], references: [badges.id] }),
}));

export const badgesRelations = relations(badges, ({ one, many }) => ({
  iconMedia: one(media, { fields: [badges.iconMediaId], references: [media.id] }),
  userBadges: many(userBadges),
}));

export const handwritingAttemptsRelations = relations(handwritingAttempts, ({ one }) => ({
  user: one(users, { fields: [handwritingAttempts.userId], references: [users.id] }),
  vocabulary: one(vocabularies, { fields: [handwritingAttempts.vocabularyId], references: [vocabularies.id] }),
  imageMedia: one(media, { fields: [handwritingAttempts.imageMediaId], references: [media.id] }),
}));

export const deckReviewsRelations = relations(deckReviews, ({ one }) => ({
  user: one(users, { fields: [deckReviews.userId], references: [users.id] }),
  deck: one(decks, { fields: [deckReviews.deckId], references: [decks.id] }),
}));

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, { fields: [oauthAccounts.userId], references: [users.id] }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  coverImageMedia: one(media, { fields: [courses.coverImageMediaId], references: [media.id] }),
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

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const vocabularyConfusionsRelations = relations(vocabularyConfusions, ({ one }) => ({
  baseVocab: one(vocabularies, {
    fields: [vocabularyConfusions.vocabularyId],
    references: [vocabularies.id],
    relationName: 'baseVocabulary'
  }),
  confusedVocab: one(vocabularies, {
    fields: [vocabularyConfusions.confusedWithId],
    references: [vocabularies.id],
    relationName: 'confusedVocabulary'
  }),
}));

export const contentReportsRelations = relations(contentReports, ({ one }) => ({
  user: one(users, { fields: [contentReports.userId], references: [users.id] }),
  vocabulary: one(vocabularies, { fields: [contentReports.vocabularyId], references: [vocabularies.id] }),
}));