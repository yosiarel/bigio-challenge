import { Request, Response, NextFunction } from 'express';
import chapterService from '../services/chapter.service';

class ChapterController {
  async createChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { storyId } = req.params;
      const chapterData = {
        ...req.body,
        storyId,
      };

      const chapter = await chapterService.createChapter(chapterData);

      res.status(201).json({
        success: true,
        message: 'Chapter created successfully',
        data: chapter,
      });
    } catch (error: any) {
      if (error.message === 'Story not found') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }

  async updateChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const chapter = await chapterService.updateChapter(id as string, req.body);

      res.status(200).json({
        success: true,
        message: 'Chapter updated successfully',
        data: chapter,
      });
    } catch (error: any) {
      if (error.message === 'Chapter not found') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }

  async deleteChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await chapterService.deleteChapter(id as string);

      res.status(200).json({
        success: true,
        message: 'Chapter deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Chapter not found') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }
}

export default new ChapterController();
