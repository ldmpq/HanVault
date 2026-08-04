import { db } from '../config/database';
import { vocabularies, vocabularyMeanings, exampleSentences, exampleSentenceTranslations } from '../shared/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' }); 

const BATCH_SIZE = 20;
const DELAY_MS = 6000; 
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runAIEnrichment() {
  console.log('🚀 Starting AI data enrichment...');

  const allWords = await db
    .select({
      id: vocabularies.id,
      hanzi: vocabularies.simplified,
      pinyin: vocabularies.pinyin,
    })
    .from(vocabularies)
    .where(isNull(vocabularies.sinoVietnamese));

  console.log(`📊 Total words to process: ${allWords.length}\n`);

  for (let i = 3880; i < allWords.length; i += BATCH_SIZE) {
    const batch = allWords.slice(i, i + BATCH_SIZE);
    console.log(`⏳ Processing batch ${i} to ${i + batch.length}...`);

    const promptData = batch.map((w) => `ID: ${w.id} | Word: ${w.hanzi} (${w.pinyin})`).join('\n');

    const prompt = `
      Bạn là chuyên gia Hán ngữ. Dựa vào danh sách từ vựng sau, hãy trả về 1 object JSON chứa:
      1. Nghĩa tiếng Việt ngắn gọn, chuẩn xác (vi)
      2. Âm Hán Việt viết thường (sv)
      3. ĐÚNG 2 câu ví dụ thông dụng (ex) gồm: chữ Hán (ch), Pinyin (py), Bản dịch Việt (en)
      
      YÊU CẦU BẮT BUỘC: 
      - CHỈ TRẢ VỀ JSON HỢP LỆ, KHÔNG BỌC MARKDOWN.
      - Cấu trúc bắt buộc:
      {
        "ID": {
          "vi": "nghĩa ngắn gọn",
          "sv": "âm hán việt",
          "ex": [
             {"ch": "câu tiếng trung", "py": "pinyin", "en": "bản dịch tiếng việt"}
          ]
        }
      }
      
      Dữ liệu:
      ${promptData}
    `;

    let retries = 3;
    let success = false;

    while (retries > 0 && !success) {
      try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          responseText = responseText.substring(firstBrace, lastBrace + 1);
        }

        const dataObj = JSON.parse(responseText);

        // Lưu toàn bộ dữ liệu vào Database
        const updatePromises = Object.keys(dataObj).map(async (idStr) => {
          const wordId = parseInt(idStr);
          const aiData = dataObj[idStr];

          // 1. Cập nhật Âm Hán Việt vào vocabularies
          await db
            .update(vocabularies)
            .set({ sinoVietnamese: aiData.sv })
            .where(eq(vocabularies.id, wordId));

          // 2. Cập nhật Nghĩa tiếng Việt vào vocabularyMeanings
          const meaningRecord = await db.query.vocabularyMeanings.findFirst({
              where: and(
                  eq(vocabularyMeanings.vocabularyId, wordId),
                  eq(vocabularyMeanings.languageCode, 'vi')
              )
          });
          if (meaningRecord && aiData.vi) {
             await db.update(vocabularyMeanings).set({ meaning: aiData.vi }).where(eq(vocabularyMeanings.id, meaningRecord.id));
          }

          // 3. Thêm Câu ví dụ 
          if (aiData.ex && Array.isArray(aiData.ex)) {
            for (const ex of aiData.ex) {
              const [insertedSentence] = await db
                .insert(exampleSentences)
                .values({ vocabularyId: wordId, chineseText: ex.ch, pinyinText: ex.py, source: 'ai_generated' })
                .returning({ id: exampleSentences.id });

              await db.insert(exampleSentenceTranslations).values({
                sentenceId: insertedSentence.id, languageCode: 'vi', translation: ex.en
              });
            }
          }
        });

        await Promise.all(updatePromises);
        console.log(`✅ Batch ${i} completed.`);
        success = true;

      } catch (error: any) {
        retries--;
        console.error(`⚠️ Batch ${i} failed (${error.message}). Retrying... ${retries} attempt(s) remaining.`);
        if (retries > 0) await sleep(5000);
      }
    }
    await sleep(DELAY_MS);
  }
  console.log(`🎉 AI data enrichment completed successfully.`);
}

// To run the AI enrichment script independently, uncomment the following line:
runAIEnrichment();