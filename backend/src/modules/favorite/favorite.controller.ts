import { Request, Response } from 'express';
import { FavoriteService } from './favorite.service';

export class FavoriteController {
  static async toggle(req: Request, res: Response): Promise<void> {
    try {
      // Quét các key phổ biến thường dùng để lưu ID trong payload JWT
      const userPayload = (req as any).user;
      const userId = userPayload?.id || userPayload?.userId || userPayload?.sub; 

      if (!userId) {
        res.status(401).json({ success: false, message: 'Không tìm thấy ID người dùng trong Token' });
        return;
      }

      const vocabularyId = Number(req.body.vocabularyId);
      if (!vocabularyId) {
        res.status(400).json({ success: false, message: 'Thiếu vocabularyId' });
        return;
      }

      const result = await FavoriteService.toggleFavorite(userId, vocabularyId);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      console.error('🔥 Lỗi Controller toggleFavorite:', error);
      res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
  }

  static async getMyFavorites(req: Request, res: Response): Promise<void> {
    try {
      const userPayload = (req as any).user;
      const userId = userPayload?.id || userPayload?.userId || userPayload?.sub; 

      if (!userId) {
        res.status(401).json({ success: false, message: 'Không xác thực được người dùng' });
        return;
      }

      const ids = await FavoriteService.getFavoriteIds(userId);
      res.status(200).json({ success: true, data: ids });
    } catch (error: any) {
      console.error('🔥 Lỗi Controller getMyFavorites:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
}