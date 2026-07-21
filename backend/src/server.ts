import app from './app';
import { env } from './config/env';
import { db } from './config/database';

const startServer = async () => {
  try {
    // Kiểm tra kết nối DB bằng một câu query nhẹ
    await db.execute('SELECT 1');
    console.log('✅ Kết nối PostgreSQL qua Drizzle ORM thành công!');

    app.listen(env.PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${env.PORT}`);
      console.log(`📚 Swagger API Docs tại: http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error);
    process.exit(1);
  }
};

startServer();