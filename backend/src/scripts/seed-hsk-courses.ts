import { db } from '../config/database';
import { vocabularies, courses, lessons, decks, deckItems } from '../shared/schema';
import { eq, asc } from 'drizzle-orm';

// Cấu hình chính xác theo bảng thiết kế của bạn
const hskConfigs = [
  { level: 1, totalWords: 500, units: 5, lessons: 25, wordsPerLesson: 20 },
  { level: 2, totalWords: 772, units: 8, lessons: 40, wordsPerLesson: 20 },
  { level: 3, totalWords: 973, units: 10, lessons: 50, wordsPerLesson: 20 },
  { level: 4, totalWords: 1000, units: 10, lessons: 50, wordsPerLesson: 20 },
  { level: 5, totalWords: 1071, units: 11, lessons: 55, wordsPerLesson: 20 },
  { level: 6, totalWords: 1140, units: 12, lessons: 60, wordsPerLesson: 20 },
  { level: 7, totalWords: 3697, units: 37, lessons: 185, wordsPerLesson: 20 },
  { level: 8, totalWords: 3697, units: 37, lessons: 185, wordsPerLesson: 20 },
  { level: 9, totalWords: 3698, units: 37, lessons: 185, wordsPerLesson: 20 },
];

async function seedHskCourses() {
  console.log('🚀 Bắt đầu quá trình chia bộ thẻ và tạo khóa học HSK...');

  try {
    for (const config of hskConfigs) {
      console.log(`\n📚 Đang xử lý HSK ${config.level}...`);

      // 1. Lấy toàn bộ từ vựng của cấp độ này, sắp xếp theo ID hoặc Frequency
      const vocabs = await db.select()
        .from(vocabularies)
        .where(eq(vocabularies.hskLevel, config.level))
        .orderBy(asc(vocabularies.id));

      if (vocabs.length === 0) {
        console.log(`⚠️ Không tìm thấy từ vựng nào cho HSK ${config.level}. Bỏ qua.`);
        continue;
      }

      // 2. Tạo Course (Khóa học tổng)
      const [newCourse] = await db.insert(courses).values({
        name: `HSK ${config.level} Standard Course`,
        description: `Khóa học HSK ${config.level} tiêu chuẩn bao gồm ${vocabs.length} từ vựng, được chia thành ${config.units} Units và ${config.lessons} Lessons.`,
      }).returning();

      let vocabIndex = 0;
      let globalLessonIndex = 1;
      const lessonsPerUnit = config.lessons / config.units;

      // 3. Vòng lặp tạo Unit & Lesson
      for (let u = 1; u <= config.units; u++) {
        for (let l = 1; l <= lessonsPerUnit; l++) {
          // Lấy ra 20 từ vựng cho Lesson này
          const chunk = vocabs.slice(vocabIndex, vocabIndex + config.wordsPerLesson);
          
          if (chunk.length === 0) break; // Hết từ vựng

          const lessonTitle = `Unit ${u} - Lesson ${l}`;
          
          // 3.1. Tạo Deck (Bộ thẻ hệ thống)
          const [newDeck] = await db.insert(decks).values({
            name: `HSK ${config.level} - ${lessonTitle}`,
            description: `Bộ thẻ từ vựng cho ${lessonTitle} thuộc HSK ${config.level}.`,
            hskLevel: config.level,
            isSystem: true, 
            isPublic: true,
          }).returning();

          // 3.2. Đổ 20 từ vựng vào Deck (deck_items)
          const deckItemsData = chunk.map((v, idx) => ({
            deckId: newDeck.id,
            vocabularyId: v.id,
            displayOrder: idx,
          }));
          await db.insert(deckItems).values(deckItemsData);

          // 3.3. Tạo Lesson và liên kết với Deck vừa tạo
          await db.insert(lessons).values({
            courseId: newCourse.id,
            title: lessonTitle,
            orderIndex: globalLessonIndex,
            deckId: newDeck.id,
          });

          vocabIndex += config.wordsPerLesson;
          globalLessonIndex++;
        }
      }
      
      console.log(`✅ Đã hoàn tất HSK ${config.level}: Tạo ${globalLessonIndex - 1} bộ thẻ.`);
    }

    console.log('\n🎉 Toàn bộ quá trình Seed dữ liệu đã thành công!');
    process.exit(0);
  } catch (error) {
    console.error('🔥 Lỗi trong quá trình Seed:', error);
    process.exit(1);
  }
}

seedHskCourses();