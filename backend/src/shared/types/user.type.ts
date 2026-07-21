import { users } from '../schema';

// Type dùng khi truy vấn User từ DB ra (Select)
export type User = typeof users.$inferSelect;

// Type dùng khi tạo mới một User vào DB (Insert - tự động bỏ qua các trường có default như id, createdAt)
export type NewUser = typeof users.$inferInsert;

// Type dành cho User payload trả về cho Frontend (loại bỏ passwordHash)
export type UserResponse = Omit<User, 'passwordHash'>;