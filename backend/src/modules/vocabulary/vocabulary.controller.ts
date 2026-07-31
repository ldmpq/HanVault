import { Request, Response } from 'express';
import { VocabularyService } from './vocabulary.service';
import { GetVocabulariesQuery, CreateVocabularyInput } from './vocabulary.validation';
import { eq } from 'drizzle-orm';
import { db } from '../../config/database';
import { } from '../../shared/schema';

export class VocabularyController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = req.query as unknown as GetVocabulariesQuery;
      const result = await VocabularyService.getVocabularies(queryParams);
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách từ vựng thành công',
        ...result,
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID từ vựng không hợp lệ' });
        return;
      }
      const result = await VocabularyService.getVocabularyById(id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.message && error.message.startsWith('VOCAB_NOT_FOUND')) {
        res.status(404).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi lấy chi tiết từ vựng',
        error: error.message 
      });
    }
  }

  static async create(req: Request<{}, {}, CreateVocabularyInput>, res: Response): Promise<void> {
    try {
      const result = await VocabularyService.createVocabulary(req.body);
      res.status(201).json({
        success: true,
        message: 'Thêm từ vựng mới thành công! 🎉',
        data: result,
      });
    } catch (error: any) {
      if (error.message && error.message.startsWith('VOCAB_EXISTS')) {
        res.status(400).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      throw error;
    }
  }
}