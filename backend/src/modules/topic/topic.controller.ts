import { Request, Response } from 'express';
import { TopicService } from './topic.service';

export class TopicController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await TopicService.getAllTopics();
      
      res.status(200).json({ 
        success: true, 
        message: 'Lấy danh sách chủ đề thành công',
        data: result 
      });
    } catch (error: any) {
      console.error('Lỗi khi lấy danh sách chủ đề:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi lấy danh sách chủ đề', 
        error: error.message 
      });
    }
  }
}