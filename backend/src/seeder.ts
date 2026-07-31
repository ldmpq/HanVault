import 'dotenv/config'; 
import { VocabularyService } from './modules/vocabulary/vocabulary.service';

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.json';

async function translateEngToVie(text: string) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json() as any[];

    if (!data || !Array.isArray(data) || !data[0]) {
      return text;
    }

    return data[0].map((item: any) => item[0]).join(''); 
  } catch (error) {
    return text; // Nếu lỗi mạng, trả về nguyên bản Tiếng Anh
  }
}

async function seedDatabase() {
  try {
    console.log('⏳ Đang tải dữ liệu JSON từ GitHub...');
    const response = await fetch(GITHUB_RAW_URL);
    if (!response.ok) throw new Error(`Lỗi tải dữ liệu: ${response.statusText}`);

    const rawData = await response.json();
    const vocabularies = Array.isArray(rawData) ? rawData : [];

    // Có thể giới hạn 20 từ để test tốc độ dịch (Google Dịch cần thời gian xử lý)
    // Nếu thấy chạy ổn, đổi thành vocabularies.length để chạy toàn bộ
    const limit = vocabularies.length;
    const dataToSeed = vocabularies.slice(0, limit);

    console.log(`✅ Bắt đầu nạp và DỊCH TỰ ĐỘNG ${dataToSeed.length} từ vựng sang Tiếng Việt...`);

    let successCount = 0;
    let errorCount = 0;

    for (const item of dataToSeed) {
      // 1. Lấy Hán tự
      const simplifiedChar = item.simplified || 'N/A';
      
      // 2. Chui vào mảng forms để lấy Pinyin, Phồn thể và Nghĩa Tiếng Anh
      const firstForm = (Array.isArray(item.forms) && item.forms.length > 0) ? item.forms[0] : {};
      const pinyinStr = firstForm.transcriptions?.pinyin || 'Chưa rõ';
      const traditionalChar = firstForm.traditional || undefined;

      const englishMeaning = Array.isArray(firstForm.meanings) 
        ? firstForm.meanings.join('; ') 
        : '';

      // 3. Xử lý Từ loại (pos) - Dữ liệu là mảng ["n", "v"]
      const pos = Array.isArray(item.pos) ? item.pos.join(', ') : undefined;

      // 4. Xử lý HSK Level - Dữ liệu là mảng ["new-1", "old-3"]
      let hskNumber = 1;
      if (Array.isArray(item.level)) {
        // Ưu tiên quét chữ "new-" (HSK 3.0), nếu không có thì lấy phần tử đầu
        const targetLevelStr = item.level.find((l: any) => String(l).includes('new-')) || item.level[0] || '1';
        hskNumber = parseInt(String(targetLevelStr).match(/\d+/)?.[0] || '1', 10);
      }

      try {
        // 5. Kêu gọi Google dịch sang Tiếng Việt
        let vietnameseMeaning = 'Chưa cập nhật';
        if (englishMeaning) {
          vietnameseMeaning = await translateEngToVie(englishMeaning);
        }

        const payload = {
          simplified: simplifiedChar,
          traditional: traditionalChar,
          pinyin: pinyinStr,
          hskLevel: hskNumber,
          partOfSpeech: pos,
          
          meanings: [
            {
              languageCode: 'vi' as const, 
              meaning: vietnameseMeaning, 
              displayOrder: 0
            },
            {
              languageCode: 'en' as const, 
              meaning: englishMeaning, 
              displayOrder: 1
            }
          ],
        };

        await VocabularyService.createVocabulary(payload);
        
        successCount++;
        process.stdout.write(`\rTiến độ: ${successCount}/${dataToSeed.length} từ (Vừa xử lý xong: ${simplifiedChar})...`);
        
      } catch (err: any) {
        if (!err.message?.includes('VOCAB_EXISTS')) {
          console.error(`\n❌ Lỗi ở chữ [${simplifiedChar}]:`, err.message || err);
          errorCount++;
        }
      }
    }

    console.log(`\n🎉 HOÀN TẤT SEEDING & DỊCH THUẬT!`);
    console.log(`✅ Thành công: ${successCount}`);
    console.log(`❌ Thất bại: ${errorCount}`);
    process.exit(0);

  } catch (error) {
    console.error('💥 Lỗi hệ thống:', error);
    process.exit(1);
  }
}

seedDatabase();