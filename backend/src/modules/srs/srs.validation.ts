import { z } from 'zod';

export const submitReviewSchema = z.object({
  body: z.object({
    vocabularyId: z.number().int().positive('ID từ vựng phải là số nguyên dương'),
    quality: z.number().int().min(0, 'Điểm chất lượng thấp nhất là 0 (Quên)').max(5, 'Điểm chất lượng cao nhất là 5 (Quá dễ)'),
  }),
});

export const endSessionSchema = z.object({
  body: z.object({
    totalWords: z.number().int().min(0).default(0),
    correctWords: z.number().int().min(0).default(0),
    logs: z.array(
      z.object({
        vocabularyId: z.number().int(),
        isCorrect: z.boolean(),
        responseQuality: z.number().int().min(0).max(5),
        responseTimeMs: z.number().int().min(0).optional(),
      })
    ).optional(),
  }),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>['body'];

export type EndSessionInput = z.infer<typeof endSessionSchema>['body'];