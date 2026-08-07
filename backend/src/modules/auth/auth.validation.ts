import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Email không đúng định dạng' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  displayName: z.string().min(2, { message: 'Tên hiển thị ít nhất 2 ký tự' }).optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email không đúng định dạng' }),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh Token là bắt buộc' }),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Vui lòng nhập mật khẩu hiện tại' }),
  newPassword: z.string().min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
});

// Infer ra TypeScript types để dùng trong Controller
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;