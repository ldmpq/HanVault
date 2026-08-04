import 'dotenv/config'; 
import { VocabularyService } from '../modules/vocabulary/vocabulary.service';

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.json';

export async function runSeeder() {
  try {
    console.log('⏳ Downloading vocabulary dataset from GitHub...');
    const response = await fetch(GITHUB_RAW_URL);
    if (!response.ok) throw new Error(`Failed to download dataset: ${response.statusText}`);

    const rawData = await response.json();
    const vocabularies = Array.isArray(rawData) ? rawData : [];

    console.log(`✅ Dataset downloaded. Importing ${vocabularies.length} vocabulary entries...`);

    let successCount = 0;
    let errorCount = 0;

    for (const item of vocabularies) {
      const simplifiedChar = item.simplified || 'N/A';
      const firstForm = (Array.isArray(item.forms) && item.forms.length > 0) ? item.forms[0] : {};
      const pinyinStr = firstForm.transcriptions?.pinyin || 'Chưa rõ';
      const traditionalChar = firstForm.traditional || undefined;

      const englishMeaning = Array.isArray(firstForm.meanings) 
        ? firstForm.meanings.join('; ') 
        : '';

      const pos = Array.isArray(item.pos) ? item.pos.join(', ') : undefined;

      let hskNumber = 1;
      if (Array.isArray(item.level)) {
        const targetLevelStr = item.level.find((l: any) => String(l).includes('new-')) || item.level[0] || '1';
        hskNumber = parseInt(String(targetLevelStr).match(/\d+/)?.[0] || '1', 10);
      }

      try {
        const payload = {
          simplified: simplifiedChar,
          traditional: traditionalChar,
          pinyin: pinyinStr,
          hskLevel: hskNumber,
          partOfSpeech: pos,
          
          meanings: [
            { languageCode: 'vi' as const, meaning: 'Đang chờ AI dịch...', displayOrder: 0 },
            { languageCode: 'en' as const, meaning: englishMeaning, displayOrder: 1 }
          ],
        };

        await VocabularyService.createVocabulary(payload);
        
        successCount++;

        if (successCount % 50 === 0) {
            process.stdout.write(`\rProgress: ${successCount}/${vocabularies.length} entries imported...`);
        }
        
      } catch (err: any) {
        if (!err.message?.includes('VOCAB_EXISTS')) {
          console.error(`\n❌ Failed to import [${simplifiedChar}]:`, err.message || err);
          errorCount++;
        }
      }
    }

    console.log(`\n🎉 Vocabulary import completed.`);
    console.log(`✅ Imported: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);

  } catch (error) {
    console.error('💥 System error:', error);
    throw error;
  }
}