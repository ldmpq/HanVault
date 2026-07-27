import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import authRoutes from './modules/auth/auth.route';
import vocabularyRoutes from './modules/vocabulary/vocabulary.route';
import srsRoutes from './modules/srs/srs.route';
import dashboardRoutes from './modules/dashboard/dashboard.route';

const app: Application = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Docs Endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Han Vault API is running smoothly 🚀' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Vocabulary routes
app.use('/api/vocabularies', vocabularyRoutes);

// SRS Study routes
app.use('/api/srs', srsRoutes);

// Quiz routes


// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('🔥 Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ (Internal Server Error)',
  });
});

export default app;