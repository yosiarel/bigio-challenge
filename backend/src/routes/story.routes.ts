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

// Story CRUD routes
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

// Chapter routes (nested under story)
router.post(
  '/:storyId/chapters',
  validateChapter,
  handleValidationErrors,
  chapterController.createChapter
);

export default router;
