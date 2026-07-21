import { z } from 'zod';

// Schema cho danh sách từ vựng (lọc theo HSK, từ khóa, phân trang)
export const getVocabulariesSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
    hskLevel: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
    keyword: z.string().optional(), // Tìm theo Hán tự hoặc Pinyin
  }),
});

// Schema cho việc thêm mới từ vựng kèm ý nghĩa và ví dụ
export const createVocabularySchema = z.object({
  body: z.object({
    simplified: z.string().min(1, 'Hán tự giản thể là bắt buộc'),
    traditional: z.string().optional(),
    pinyin: z.string().min(1, 'Pinyin là bắt buộc'),
    hskLevel: z.number().int().min(1).max(9),
    partOfSpeech: z.string().optional(),
    frequencyRank: z.number().int().optional(),
    audioUrl: z.string().url().optional(),
    // Danh sách ý nghĩa (Việt/Anh)
    meanings: z.array(
      z.object({
        languageCode: z.enum(['vi', 'en']).default('vi'),
        meaning: z.string().min(1, 'Nghĩa của từ không được để trống'),
        displayOrder: z.number().int().default(0),
      })
    ).min(1, 'Phải có ít nhất 1 ý nghĩa'),
    // Danh sách câu ví dụ
    examples: z.array(
      z.object({
        chineseText: z.string().min(1),
        pinyinText: z.string().optional(),
        translation: z.string().optional(),
        audioUrl: z.string().url().optional(),
      })
    ).optional(),
  }),
});

export type GetVocabulariesQuery = z.infer<typeof getVocabulariesSchema>['query'];
export type CreateVocabularyInput = z.infer<typeof createVocabularySchema>['body'];