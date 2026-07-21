import { Request, Response } from 'express';
import { SrsService } from './srs.service';
import { EndSessionInput, SubmitReviewInput } from './srs.validation';

export class SrsController {
  static async submitReview(req: Request<{}, {}, SubmitReviewInput>, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { vocabularyId, quality } = req.body;
      const result = await SrsService.submitReview(userId, vocabularyId, quality);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      throw error;
    }
  }

  static async startSession(req: Request<{ deckId: string }>, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const deckId = Number(req.params.deckId);
      
      if (isNaN(deckId)) {
        res.status(400).json({ success: false, message: 'ID bộ thẻ không hợp lệ' });
        return;
      }

      const result = await SrsService.startStudySession(userId, deckId);
      
      res.status(200).json({
        success: true,
        message: result.totalCards === 0 
          ? 'Tuyệt vời! Bạn đã hoàn thành tất cả thẻ cần học hôm nay.' 
          : 'Sẵn sàng! Phiên học đã được bắt đầu.',
        data: result,
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async endSession(req: Request<{ sessionId: string }, {}, EndSessionInput>, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const sessionId = Number(req.params.sessionId);

      if (isNaN(sessionId)) {
        res.status(400).json({ success: false, message: 'ID phiên học không hợp lệ' });
        return;
      }

      const result = await SrsService.endStudySession(userId, sessionId, req.body);
      
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      if (error.message?.startsWith('SESSION_NOT_FOUND') || error.message?.startsWith('SESSION_ENDED')) {
        res.status(400).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      throw error;
    }
  }
}