import { Router } from 'express';
import { getRecommendedQuizzes, getQuizQuestions, submitQuizResult } from './quiz.controller';
import { authenticateJwt } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/recommended', getRecommendedQuizzes);
router.get('/:quizId/questions', getQuizQuestions);
router.post('/:quizId/submit', submitQuizResult);

export default router; 