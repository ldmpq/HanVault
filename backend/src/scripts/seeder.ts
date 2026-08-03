import 'dotenv/config'; 
import { VocabularyService } from '../modules/vocabulary/vocabulary.service';

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
    return text;
  }
}

export async function runSeeder() {
  try {
    console.log('⏳ Downloading JSON data from GitHub...');
    const response = await fetch(GITHUB_RAW_URL);
    if (!response.ok) throw new Error(`Error downloading data: ${response.statusText}`);

    const rawData = await response.json();
    const vocabularies = Array.isArray(rawData) ? rawData : [];

    const limit = vocabularies.length;
    const dataToSeed = vocabularies.slice(0, limit);

    console.log(`✅ Importing and automatically translation ${dataToSeed.length} vocabulary entries into Vietnamese...`);

    let successCount = 0;
    let errorCount = 0;

    for (const item of dataToSeed) {
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
        let vietnameseMeaning = 'Pending update';
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
            { languageCode: 'vi' as const, meaning: vietnameseMeaning, displayOrder: 0 },
            { languageCode: 'en' as const, meaning: englishMeaning, displayOrder: 1 }
          ],
        };

        await VocabularyService.createVocabulary(payload);
        
        successCount++;
        process.stdout.write(`\rProgress: ${successCount}/${dataToSeed.length} entries processed (Latest: ${simplifiedChar})...`);
        
      } catch (err: any) {
        if (!err.message?.includes('VOCAB_EXISTS')) {
          console.error(`\n❌ Error with character [${simplifiedChar}]:`, err.message || err);
          errorCount++;
        }
      }
    }

    console.log(`\n🎉 COMPLETED SEEDING & AUTOMATIC TRANSLATION!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);

  } catch (error) {
    console.error('💥 System error:', error);
    throw error;
  }
}