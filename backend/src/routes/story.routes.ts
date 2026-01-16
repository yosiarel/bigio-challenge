import { Router } from 'express';
import storyController from '../controllers/story.controller';
import chapterController from '../controllers/chapter.controller';
import {
  validateStoryCreate,
  validateStoryUpdate,
  validateChapter,
  handleValidationErrors,
} from '../middleware/validation';

const router = Router();

router.get('/stats/dashboard', storyController.getDashboardStats);
router.post(
  '/',
  validateStoryCreate,
  handleValidationErrors,
  storyController.createStory
);
router.get('/', storyController.getAllStories);
router.get('/:id', storyController.getStoryById);
router.put(
  '/:id',
  validateStoryUpdate,
  handleValidationErrors,
  storyController.updateStory
);
router.delete('/:id', storyController.deleteStory);

router.post(
  '/:storyId/chapters',
  validateChapter,
  handleValidationErrors,
  chapterController.createChapter
);

router.get(
  '/:storyId/chapters/:chapterId',
  chapterController.getChapterById
);

router.put(
  '/:storyId/chapters/:chapterId',
  validateChapter,
  handleValidationErrors,
  chapterController.updateChapterByStory
);

export default router;
