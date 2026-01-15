import { Request, Response, NextFunction } from 'express';
import storyService from '../services/story.service';
import { Category, Status } from '@prisma/client';

class StoryController {
  async createStory(req: Request, res: Response, next: NextFunction) {
    try {
      const story = await storyService.createStory(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Story created successfully',
        data: story,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAllStories(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category, status, page, limit } = req.query;
      const filters = {
        search: search as string,
        category: category ? (category as Category) : undefined,
        status: status ? (status as Status) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await storyService.getAllStories(filters);

      res.status(200).json({
        success: true,
        message: 'Stories retrieved successfully',
        data: result.stories,
        pagination: result.pagination,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getStoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const story = await storyService.getStoryById(id as string);

      res.status(200).json({
        success: true,
        message: 'Story retrieved successfully',
        data: story,
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

  async updateStory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const story = await storyService.updateStory(id as string, req.body);

      res.status(200).json({
        success: true,
        message: 'Story updated successfully',
        data: story,
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

  async deleteStory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await storyService.deleteStory(id as string);

      res.status(200).json({
        success: true,
        message: 'Story deleted successfully',
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
}

export default new StoryController();