import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../shared/middlewares/validate.middleware';
import { authenticateJwt } from '../../shared/middlewares/auth.middleware';
import { registerSchema, loginSchema, refreshTokenSchema, updatePasswordSchema } from './auth.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Quản lý xác thực người dùng (Đăng ký, Đăng nhập, JWT Tokens)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testuser@gmail.com
 *               password:
 *                 type: string
 *                 example: secret123456
 *               displayName:
 *                 type: string
 *                 example: Quý Lê
 *     responses:
 *       201:
 *         description: Đăng ký thành công, trả về User và JWT Tokens.
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc Email đã tồn tại.
 */
router.post('/register', validate(registerSchema), AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: testuser@gmail.com
 *               password:
 *                 type: string
 *                 example: secret123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công.
 *       401:
 *         description: Email hoặc mật khẩu không chính xác.
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Cấp lại Access Token từ Refresh Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cấp lại cặp token mới thành công.
 *       401:
 *         description: Refresh token hết hạn hoặc không hợp lệ.
 */
router.post('/refresh-token', validate(refreshTokenSchema), AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin Profile và Streak của người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết user (bao gồm Drizzle JOIN bảng user_streaks).
 *       401:
 *         description: Thiếu hoặc lỗi Bearer Access Token.
 */
router.get('/me', authenticateJwt, AuthController.getMe);

/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     summary: Cập nhật mật khẩu mới
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công.
 *       400:
 *         description: Sai mật khẩu hiện tại.
 */
router.put('/update-password', authenticateJwt, validate(updatePasswordSchema), AuthController.updatePassword);

export default router;