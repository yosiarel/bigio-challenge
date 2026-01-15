import { Router } from 'express';
import chapterController from '../controllers/chapter.controller';
import { validateChapter, handleValidationErrors } from '../middleware/validation';

const router = Router();

router.put(
  '/:id',
  validateChapter,
  handleValidationErrors,
  chapterController.updateChapter
);
router.delete('/:id', chapterController.deleteChapter);

export default router;
