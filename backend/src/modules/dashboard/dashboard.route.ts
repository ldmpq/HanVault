import { Router } from 'express';
import { getDashboardData } from './dashboard.controller';
import { authenticateJwt } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateJwt, getDashboardData);

export default router;