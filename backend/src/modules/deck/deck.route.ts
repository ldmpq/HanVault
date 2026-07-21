import { Router } from 'express';
import { DeckController } from './deck.controller';
import { validate } from '../../shared/middlewares/validate.middleware';
import { authenticateJwt } from '../../shared/middlewares/auth.middleware';
import { getDecksSchema, createDeckSchema, addItemsSchema } from './deck.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Decks
 *     description: Quản lý các Bộ thẻ từ vựng (Wordlists/Flashcard Decks)
 */

/**
 * @swagger
 * /api/decks:
 *   get:
 *     summary: Lấy danh sách bộ thẻ (Lọc theo HSK hoặc từ khóa)
 *     tags: [Decks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng bộ thẻ mỗi trang
 *       - in: query
 *         name: hskLevel
 *         schema:
 *           type: integer
 *         description: Lọc theo cấp HSK (1-9)
 *       - in: query
 *         name: isSystem
 *         schema:
 *           type: boolean
 *         description: Lọc bộ từ chuẩn hệ thống (true) hoặc bộ từ cá nhân (false)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên bộ thẻ
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công.
 */
router.get('/', validate(getDecksSchema), DeckController.getAll);

/**
 * @swagger
 * /api/decks/{id}:
 *   get:
 *     summary: Lấy chi tiết bộ thẻ và toàn bộ danh sách từ vựng bên trong
 *     tags: [Decks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bộ thẻ
 *     responses:
 *       200:
 *         description: Trả về chi tiết kèm mảng vocabularies.
 *       404:
 *         description: Không tìm thấy bộ thẻ.
 */
router.get('/:id', DeckController.getById);

/**
 * @swagger
 * /api/decks:
 *   post:
 *     summary: Tạo một bộ thẻ mới
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: HSK 1 - 150 Từ vựng cốt lõi
 *               description:
 *                 type: string
 *                 example: Bộ từ vựng tiêu chuẩn dành cho người mới bắt đầu
 *               hskLevel:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo thành công. Deck luôn được tạo với isSystem=false và ownerId lấy từ token.
 *       401:
 *         description: Thiếu Access Token.
 */
router.post('/', authenticateJwt, validate(createDeckSchema), DeckController.create);

/**
 * @swagger
 * /api/decks/{id}/items:
 *   post:
 *     summary: Thêm danh sách từ vựng vào một bộ thẻ
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bộ thẻ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vocabularyIds
 *             properties:
 *               vocabularyIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Thêm từ vựng vào bộ thành công.
 *       404:
 *         description: Không tìm thấy bộ thẻ.
 */
router.post('/:id/items', authenticateJwt, validate(addItemsSchema), DeckController.addItems);

/**
 * @swagger
 * /api/decks/{id}/start:
 *   post:
 *     summary: Ghi nhận người dùng bắt đầu theo học bộ thẻ này (lưu vào bảng user_decks)
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bộ thẻ
 *     responses:
 *       200:
 *         description: Bắt đầu học thành công.
 *       401:
 *         description: Thiếu Access Token.
 */
router.post('/:id/start', authenticateJwt, DeckController.startStudy);

export default router;