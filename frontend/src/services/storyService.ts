import api from './api';

export interface Story {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  category: 'FINANCIAL' | 'TECHNOLOGY' | 'HEALTH';
  coverUrl?: string;
  tags: string[];
  status: 'DRAFT' | 'PUBLISH';
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];
  _count?: { chapters: number };
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  storyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GetAllStoriesParams {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  total: number;
  published: number;
  draft: number;
  totalChapters: number;
}

export const storyService = {
  getAll: (params?: GetAllStoriesParams) => {
    return api.get<PaginatedResponse<Story>>('/stories', { params });
  },

  getById: (id: string) => {
    return api.get<ApiResponse<Story>>(`/stories/${id}`);
  },

  getDashboardStats: () => {
    return api.get<ApiResponse<DashboardStats>>('/stories/stats/dashboard');
  },

  create: (data: Omit<Story, 'id' | 'createdAt' | 'updatedAt' | 'chapters'>) => {
    return api.post<ApiResponse<Story>>('/stories', data);
  },

  update: (id: string, data: Partial<Omit<Story, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return api.put<ApiResponse<Story>>(`/stories/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete<ApiResponse<void>>(`/stories/${id}`);
  },
};

export const chapterService = {
  getById: (storyId: string, chapterId: string) => {
    return api.get<ApiResponse<Chapter>>(`/stories/${storyId}/chapters/${chapterId}`);
  },

  create: (storyId: string, data: { title: string; content: string }) => {
    return api.post<ApiResponse<Chapter>>(`/stories/${storyId}/chapters`, data);
  },

  update: (storyId: string, chapterId: string, data: { title: string; content: string }) => {
    return api.put<ApiResponse<Chapter>>(`/stories/${storyId}/chapters/${chapterId}`, data);
  },

  delete: (id: string) => {
    return api.delete<ApiResponse<void>>(`/chapters/${id}`);
  },
};
