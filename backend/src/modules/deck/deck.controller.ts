import { Request, Response } from 'express';
import { DeckService } from './deck.service';
import { GetDecksQuery, CreateDeckInput, AddItemsInput } from './deck.validation';

export class DeckController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query as unknown as GetDecksQuery;
      const userId = req.user?.userId;
      const result = await DeckService.getDecks(query, userId);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      throw error;
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID bộ thẻ không hợp lệ' });
        return;
      }
      const result = await DeckService.getDeckById(id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      if (error.message?.startsWith('DECK_NOT_FOUND')) {
        res.status(404).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      throw error;
    }
  }

  static async create(req: Request<{}, {}, CreateDeckInput>, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await DeckService.createDeck(req.body, userId);
      res.status(201).json({ success: true, message: 'Tạo bộ thẻ mới thành công! 🎉', data: result });
    } catch (error: any) {
      throw error;
    }
  }

  static async addItems(req: Request<{ id: string }, {}, AddItemsInput>, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await DeckService.addItemsToDeck(id, req.body);
      res.status(200).json({ success: true, message: 'Đã thêm từ vựng vào bộ thẻ!', data: result });
    } catch (error: any) {
      if (error.message?.startsWith('DECK_NOT_FOUND')) {
        res.status(404).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      throw error;
    }
  }

  static async startStudy(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = req.user!.userId;
      const result = await DeckService.startStudyDeck(id, userId);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      if (error.message?.startsWith('DECK_NOT_FOUND')) {
        res.status(404).json({ success: false, message: error.message.split(': ')[1] });
        return;
      }
      throw error;
    }
  }

  static async updateDeck(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = (req as any).user!.userId;
      const result = await DeckService.updateDeck(id, req.body, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      const err = error as Error;
      res.status(403).json({ success: false, message: err.message });
    }
  }

  static async deleteDeck(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = (req as any).user!.userId;
      await DeckService.deleteDeck(id, userId);
      res.status(200).json({ success: true, message: 'Đã xóa bộ thẻ' });
    } catch (error) {
      const err = error as Error;
      res.status(403).json({ success: false, message: err.message });
    }
  }
}