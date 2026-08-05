import { Router } from 'express';
import { TopicController } from './topic.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Topic
 *     description: Quản lý danh sách các chủ đề từ vựng
 */

/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Lấy danh sách toàn bộ chủ đề (Kèm số lượng từ vựng)
 *     tags: [Topic]
 *     responses:
 *       200:
 *         description: Trả về danh sách chủ đề thành công.
 *       500:
 *         description: Lỗi server.
 */
router.get('/', TopicController.getAll);

export default router;