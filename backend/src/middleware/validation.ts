import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateStoryCreate = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('synopsis').trim().notEmpty().withMessage('Synopsis is required'),
  body('category')
    .isIn(['FINANCIAL', 'TECHNOLOGY', 'HEALTH'])
    .withMessage('Category must be FINANCIAL, TECHNOLOGY, or HEALTH'),
  body('coverUrl')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value) return true;

      const urlPattern = /^(https?:\/\/)?(localhost|127\.0\.0\.1|[\w-]+(\.[\w-]+)+)(:\d+)?(\/.*)?$/;
      if (urlPattern.test(value)) return true;
      throw new Error('Cover URL must be a valid URL');
    }),
  body('tags').isArray().withMessage('Tags must be an array'),
  body('tags.*').trim().notEmpty().withMessage('Each tag must not be empty'),
  body('status')
    .isIn(['DRAFT', 'PUBLISH'])
    .withMessage('Status must be DRAFT or PUBLISH'),
];

export const validateStoryUpdate = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
  body('synopsis').optional().trim().notEmpty().withMessage('Synopsis cannot be empty'),
  body('category')
    .optional()
    .isIn(['FINANCIAL', 'TECHNOLOGY', 'HEALTH'])
    .withMessage('Category must be FINANCIAL, TECHNOLOGY, or HEALTH'),
  body('coverUrl')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value) return true;
      const urlPattern = /^(https?:\/\/)?(localhost|127\.0\.0\.1|[\w-]+(\.[\w-]+)+)(:\d+)?(\/.*)?$/;
      if (urlPattern.test(value)) return true;
      throw new Error('Cover URL must be a valid URL');
    }),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().notEmpty().withMessage('Each tag must not be empty'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISH'])
    .withMessage('Status must be DRAFT or PUBLISH'),
];

export const validateChapter = [
  body('title').trim().notEmpty().withMessage('Chapter title is required'),
  body('content').trim().notEmpty().withMessage('Chapter content is required'),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};
