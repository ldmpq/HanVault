import { db } from '../../config/database';
import { vocabularies, vocabularyMeanings, decks, deckItems } from '../schema';

export async function seedData() {
  console.log("🌱 Đang bắt đầu gieo dữ liệu mẫu...");

  // 1. Thêm từ vựng mẫu
  const [vocab] = await db.insert(vocabularies).values({
    simplified: '你好',
    pinyin: 'nǐ hǎo',
    hskLevel: 1,
  }).returning();

  // 2. Thêm nghĩa
  await db.insert(vocabularyMeanings).values({
    vocabularyId: vocab.id,
    languageCode: 'vi',
    meaning: 'Xin chào',
  });

  // 3. Tạo bộ thẻ mẫu
  const [deck] = await db.insert(decks).values({
    name: 'HSK 1 - Từ vựng cốt lõi',
    isSystem: true,
  }).returning();

  // 4. Thêm từ vào bộ thẻ
  await db.insert(deckItems).values({
    deckId: deck.id,
    vocabularyId: vocab.id,
  });

  console.log("✅ Gieo dữ liệu thành công!");
}

seedData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Lỗi gieo dữ liệu:", err);
    process.exit(1);
  });