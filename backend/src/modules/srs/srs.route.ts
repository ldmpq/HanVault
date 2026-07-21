import { Router } from 'express';
import { SrsController } from './srs.controller';
import { validate } from '../../shared/middlewares/validate.middleware';
import { authenticateJwt } from '../../shared/middlewares/auth.middleware';
import { submitReviewSchema, endSessionSchema } from './srs.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: SRS (Spaced Repetition)
 *     description: Quản lý ôn tập từ vựng theo thuật toán lặp lại ngắt quãng SuperMemo-2
 */

/**
 * @swagger
 * /api/srs/review:
 *   post:
 *     summary: Ghi nhận kết quả lật thẻ (0-5) và tự động tính toán ngày ôn tiếp theo
 *     tags: [SRS (Spaced Repetition)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vocabularyId
 *               - quality
 *             properties:
 *               vocabularyId:
 *                 type: integer
 *                 example: 1
 *                 description: ID của từ vựng vừa lật
 *               quality:
 *                 type: integer
 *                 example: 4
 *                 description: Đánh giá chất lượng nhớ từ 0 (Quên sạch) đến 5 (Dễ ợt, phản xạ ngay)
 *     responses:
 *       200:
 *         description: Ghi nhận thành công, trả về ngày nextReviewAt và các chỉ số mới.
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ.
 *       401:
 *         description: Thiếu Access Token.
 */
router.post('/review', authenticateJwt, validate(submitReviewSchema), SrsController.submitReview);

/**
 * @swagger
 * /api/srs/decks/{deckId}/study:
 *   get:
 *     summary: Bắt đầu phiên học (Lấy danh sách trộn lẫn Thẻ Mới và Thẻ Cũ Đến Hạn)
 *     tags: [SRS (Spaced Repetition)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bộ thẻ muốn học
 *     responses:
 *       200:
 *         description: Trả về một ID Session và danh sách Flashcard ngẫu nhiên.
 *       401:
 *         description: Thiếu Access Token.
 */
router.get('/decks/:deckId/study', authenticateJwt, SrsController.startSession);

/**
 * @swagger
 * /api/srs/sessions/{sessionId}/end:
 *   post:
 *     summary: Kết thúc phiên học và gửi báo cáo thống kê kèm lịch sử lật thẻ
 *     tags: [SRS (Spaced Repetition)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của phiên học (lấy từ API start study)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalWords:
 *                 type: integer
 *                 example: 10
 *               correctWords:
 *                 type: integer
 *                 example: 8
 *               logs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     vocabularyId:
 *                       type: integer
 *                       example: 1
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 *                     responseQuality:
 *                       type: integer
 *                       example: 4
 *                     responseTimeMs:
 *                       type: integer
 *                       example: 1200
 *     responses:
 *       200:
 *         description: Kết thúc phiên học thành công.
 *       400:
 *         description: Phiên học không tồn tại hoặc đã kết thúc.
 */
router.post('/sessions/:sessionId/end', authenticateJwt, validate(endSessionSchema), SrsController.endSession);

export default router;