import { z } from 'zod';

export const getVocabulariesSchema = z.object({
  query: z.object({
    page: z.union([z.string(), z.number()]).optional(),
    limit: z.union([z.string(), z.number()]).optional(),
    hskLevel: z.union([z.string(), z.number()]).optional(),
    keyword: z.string().optional(),
    topicId: z.union([z.string(), z.number()]).optional(),
    ids: z.string().optional(),
  }).passthrough(),
});

export const createVocabularySchema = z.object({
  body: z.object({
    simplified: z.string().min(1, 'Hán tự giản thể là bắt buộc'),
    traditional: z.string().optional(),
    pinyin: z.string().min(1, 'Pinyin là bắt buộc'),
    hskLevel: z.number().int().min(1).max(9),
    partOfSpeech: z.string().optional(),
    frequencyRank: z.number().int().optional(),

    audioUrl: z.string().url().optional(),
    imageUrl: z.string().url().optional(),

    meanings: z.array(
      z.object({
        languageCode: z.enum(['vi', 'en', 'es']).default('vi'),
        meaning: z.string().min(1, 'Nghĩa không được trống'),
        displayOrder: z.number().int().default(0),
      })
    ).min(1, 'Phải có ít nhất 1 ý nghĩa'),
    
    examples: z.array(
      z.object({
        chineseText: z.string().min(1),
        pinyinText: z.string().optional(),
        audioUrl: z.string().url().optional(),
        // Cấu trúc dịch thuật đa ngôn ngữ mới
        translations: z.array(
          z.object({
            languageCode: z.enum(['vi', 'en', 'es']).default('vi'),
            translation: z.string().min(1),
          })
        ).min(1, 'Câu ví dụ phải có ít nhất 1 bản dịch'),
      })
    ).optional(),
  }),
});

export type GetVocabulariesQuery = z.infer<typeof getVocabulariesSchema>['query'];
export type CreateVocabularyInput = z.infer<typeof createVocabularySchema>['body'];