import { Router } from 'express';
import { getDashboardData } from './dashboard.controller';
import { authenticateJwt } from '../../shared/middlewares/auth.middleware'; // Adjust path to your Auth middleware

const router = Router();

// Endpoint: GET /api/dashboard
router.get('/', authenticateJwt, getDashboardData);

export default router;