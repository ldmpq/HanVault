import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { env } from './env';

// 🚀 Thủ thuật chuyên nghiệp cho Windows: Lấy đường dẫn tuyệt đối và đổi toàn bộ '\' thành '/'
const routesPath = path.join(__dirname, '../modules/**/*.route.{ts,js}').replace(/\\/g, '/');
const controllersPath = path.join(__dirname, '../modules/**/*.controller.{ts,js}').replace(/\\/g, '/');

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Han Vault API Documentation',
      version: '1.0.0',
      description: 'Tài liệu API cho hệ thống Website Ôn từ vựng tiếng Trung (theo HSK)',
      contact: {
        name: 'Le Dai Minh Phu Quy',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập Access Token vào đây (định dạng: Bearer <token>)',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Sử dụng đường dẫn đã được chuẩn hóa 100% cho Windows
  apis: [routesPath, controllersPath],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

// 🔍 TRICK CHẨN ĐOÁN: In thử số lượng API quét được ra Terminal
const totalPaths = Object.keys((swaggerSpec as any).paths || {}).length;
console.log(`🔎 Swagger đã tìm thấy: ${totalPaths} endpoints trong code! (Path: ${routesPath})`);