import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '.././shared/schema';
import { env } from './env';

console.log('DATABASE_URL:', env.DATABASE_URL);

// Khởi tạo connection pool
const queryClient = postgres(env.DATABASE_URL, {
  max: 10, // Số lượng kết nối tối đa trong pool
  idle_timeout: 20, // Đóng kết nối nếu rảnh trong 20s
});

// Xuất instance của Drizzle kèm theo schema để query builder có auto-completion
export const db = drizzle(queryClient, { schema });