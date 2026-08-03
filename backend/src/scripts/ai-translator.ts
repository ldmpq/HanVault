import { db } from '../config/database';
import { vocabularies, vocabularyMeanings } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' }); 

const BATCH_SIZE = 50; 
const DELAY_MS = 5000; 

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runTranslatorFromScratch() {
  console.log('🚀 STARTING AI-POWERED RE-TRANSLATION FOR THE ENTIRE DATABASE...');

  const allWords = await db
    .select({
      meaningId: vocabularyMeanings.id,
      hanzi: vocabularies.simplified,
      pinyin: vocabularies.pinyin,
    })
    .from(vocabularyMeanings)
    .innerJoin(vocabularies, eq(vocabularyMeanings.vocabularyId, vocabularies.id))
    .where(eq(vocabularyMeanings.languageCode, 'vi'));

  console.log(`📊 Total entries to be translated: ${allWords.length}\n`);

  for (let i = 0; i < allWords.length; i += BATCH_SIZE) {
    const batch = allWords.slice(i, i + BATCH_SIZE);
    console.log(`⏳ Processing batch from ${i} to ${i + batch.length}...`);

    const promptData = batch.map((w) => `ID: ${w.meaningId} | Word: ${w.hanzi} (${w.pinyin})`).join('\n');
    
    const prompt = `
      Bạn là chuyên gia ngôn ngữ Trung - Việt hàng đầu. Hãy dịch các từ tiếng Trung sau sang tiếng Việt.
      YÊU CẦU BẮT BUỘC:
      1. Nghĩa phải CỰC KỲ NGẮN GỌN, TỰ NHIÊN (từ 1 đến tối đa 4 chữ).
      2. Ưu tiên tuyệt đối TỪ HÁN VIỆT nếu thông dụng (VD: "座谈" -> "tọa đàm", "座谈会" -> "tọa đàm, hội nghị"). KHÔNG diễn giải dài dòng.
      3. TRẢ VỀ DUY NHẤT MỘT OBJECT JSON, KHÔNG CÓ MARKDOWN, KHÔNG GIẢI THÍCH.
      Định dạng: {"ID": "nghĩa"}
      
      Dữ liệu:
      ${promptData}
    `;

    let retries = 3;
    let success = false;

    while (retries > 0 && !success) {
      try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          responseText = responseText.substring(firstBrace, lastBrace + 1);
        }

        const translatedObj = JSON.parse(responseText);

        const updatePromises = Object.keys(translatedObj).map(async (meaningIdStr) => {
          const meaningId = parseInt(meaningIdStr);
          await db
            .update(vocabularyMeanings)
            .set({ meaning: translatedObj[meaningIdStr] })
            .where(eq(vocabularyMeanings.id, meaningId));
        });

        await Promise.all(updatePromises);
        console.log(`✅ Successfully updated batch ${i}.`);
        success = true;

      } catch (error: any) {
        retries--;
        console.error(`⚠️ Error processing batch ${i} (${error.message || 'Network Error'}). Retrying... ${retries} attempt(s) remaining.`);
        
        if (retries === 0) {
          console.error(`❌ SKIPPED batch ${i} after 3 unsuccessful attempts.`);
        } else {
          await sleep(5000); 
        }
      }
    }
    await sleep(DELAY_MS);
  }

  console.log(`🎉 AI re-translation completed successfully for all ${allWords.length} vocabulary entries.`);
}

// To run this script independently, uncomment the following line:
// runTranslatorFromScratch();