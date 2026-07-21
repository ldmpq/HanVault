import { z } from 'zod';

// Lọc danh sách bộ thẻ (theo HSK, bộ mặc định của hệ thống hoặc bộ tự tạo)
export const getDecksSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
    hskLevel: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
    isSystem: z.string().optional().transform((val) => val === 'true'),
    keyword: z.string().optional(),
  }),
});

// Tạo bộ thẻ mới
export const createDeckSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Tên bộ thẻ phải có ít nhất 3 ký tự'),
    description: z.string().optional(),
    hskLevel: z.number().int().min(1).max(9).optional(),
    isSystem: z.boolean().default(false),
    isPublic: z.boolean().default(false),
  }),
});

// Thêm danh sách từ vựng vào bộ thẻ
export const addItemsSchema = z.object({
  body: z.object({
    vocabularyIds: z.array(z.number().int()).min(1, 'Vui lòng chọn ít nhất 1 từ vựng để thêm vào bộ'),
  }),
});

export type GetDecksQuery = z.infer<typeof getDecksSchema>['query'];
export type CreateDeckInput = z.infer<typeof createDeckSchema>['body'];
export type AddItemsInput = z.infer<typeof addItemsSchema>['body'];