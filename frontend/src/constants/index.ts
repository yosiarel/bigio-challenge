export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  STORIES: '/stories',
  CHAPTERS: '/chapters',
  UPLOAD: '/upload/cover',
} as const;

export const STORY_CATEGORIES = {
  FINANCIAL: 'FINANCIAL',
  TECHNOLOGY: 'TECHNOLOGY',
  HEALTH: 'HEALTH',
} as const;

export const STORY_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISH: 'PUBLISH',
} as const;

export const COLORS = {
  PRIMARY: '#ff6600',
  SIDEBAR_ACTIVE: '#1cb9d2',
  ORANGE_500: 'rgb(255 102 0)',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 5,
  DEFAULT_PAGE: 1,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
} as const;

export type Category = keyof typeof STORY_CATEGORIES;
export type Status = keyof typeof STORY_STATUS;
