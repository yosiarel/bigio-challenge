import { Router } from 'express';
import storyRoutes from './story.routes';
import chapterRoutes from './chapter.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/stories', storyRoutes);
router.use('/chapters', chapterRoutes);
router.use('/upload', uploadRoutes);

export default router;
