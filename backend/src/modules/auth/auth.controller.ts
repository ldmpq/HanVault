import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput, RefreshTokenInput } from './auth.validation';

export class AuthController {
  static async register(req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công! 🎉',
        data: result,
      });
    } catch (error: any) {
      if (error.message && error.message.startsWith('EMAIL_EXISTS')) {
        res.status(400).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      throw error;
    }
  }

  static async login(req: Request<{}, {}, LoginInput>, res: Response): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
        data: result,
      });
    } catch (error: any) {
      if (error.message && error.message.startsWith('INVALID_CREDENTIALS')) {
        res.status(401).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      throw error;
    }
  }

  static async refreshToken(req: Request<{}, {}, RefreshTokenInput>, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Cấp lại token mới thành công!',
        data: result,
      });
    } catch (error: any) {
      if (
        error.message && 
        (error.message.startsWith('INVALID_REFRESH_TOKEN') || error.message.startsWith('USER_NOT_FOUND'))
      ) {
        res.status(401).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      throw error;
    }
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    
    try {
      const userProfile = await AuthService.getMe(userId);
      res.status(200).json({
        success: true,
        data: userProfile,
      });
    } catch (error: any) {
      if (error.message && error.message.startsWith('USER_NOT_FOUND')) {
        res.status(404).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      throw error;
    }
  }
}