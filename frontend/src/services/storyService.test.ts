import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import { storyService, chapterService } from './storyService';
import type { Story, Chapter, PaginatedResponse, ApiResponse } from './storyService';

vi.mock('./api');

describe('storyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all stories', async () => {
      const mockResponse: PaginatedResponse<Story> = {
        success: true,
        message: 'Stories fetched successfully',
        data: [
          {
            id: '1',
            title: 'Test Story',
            author: 'Test Author',
            synopsis: 'Test synopsis',
            category: 'FINANCIAL',
            tags: ['test'],
            status: 'PUBLISH',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockResponse });

      const result = await storyService.getAll();

      expect(api.get).toHaveBeenCalledWith('/stories', { params: undefined });
      expect(result.data).toEqual(mockResponse);
    });

    it('should fetch stories with search filter', async () => {
      const mockResponse: PaginatedResponse<Story> = {
        success: true,
        message: 'Stories fetched successfully',
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockResponse });

      await storyService.getAll({ search: 'test query' });

      expect(api.get).toHaveBeenCalledWith('/stories', {
        params: { search: 'test query' },
      });
    });

    it('should fetch stories with category filter', async () => {
      const mockResponse: PaginatedResponse<Story> = {
        success: true,
        message: 'Stories fetched successfully',
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockResponse });

      await storyService.getAll({ category: 'FINANCIAL' });

      expect(api.get).toHaveBeenCalledWith('/stories', {
        params: { category: 'FINANCIAL' },
      });
    });

    it('should fetch stories with pagination', async () => {
      const mockResponse: PaginatedResponse<Story> = {
        success: true,
        message: 'Stories fetched successfully',
        data: [],
        pagination: { page: 2, limit: 20, total: 40, totalPages: 2 },
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockResponse });

      await storyService.getAll({ page: 2, limit: 20 });

      expect(api.get).toHaveBeenCalledWith('/stories', {
        params: { page: 2, limit: 20 },
      });
    });
  });

  describe('getById', () => {
    it('should fetch story by id', async () => {
      const mockStory: Story = {
        id: '1',
        title: 'Test Story',
        author: 'Test Author',
        synopsis: 'Test synopsis',
        category: 'FINANCIAL',
        tags: ['test'],
        status: 'PUBLISH',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      const mockResponse: ApiResponse<Story> = {
        success: true,
        message: 'Story fetched successfully',
        data: mockStory,
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockResponse });

      const result = await storyService.getById('1');

      expect(api.get).toHaveBeenCalledWith('/stories/1');
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new story', async () => {
      const newStory = {
        title: 'New Story',
        author: 'Author',
        synopsis: 'Synopsis',
        category: 'FINANCIAL' as const,
        tags: ['tag1'],
        status: 'DRAFT' as const,
      };

      const mockResponse: ApiResponse<Story> = {
        success: true,
        message: 'Story created successfully',
        data: {
          id: '1',
          ...newStory,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      const result = await storyService.create(newStory);

      expect(api.post).toHaveBeenCalledWith('/stories', newStory);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update an existing story', async () => {
      const updateData = {
        title: 'Updated Title',
        status: 'PUBLISH' as const,
      };

      const mockResponse: ApiResponse<Story> = {
        success: true,
        message: 'Story updated successfully',
        data: {
          id: '1',
          title: 'Updated Title',
          author: 'Author',
          synopsis: 'Synopsis',
          category: 'FINANCIAL',
          tags: ['tag1'],
          status: 'PUBLISH',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-02',
        },
      };

      vi.mocked(api.put).mockResolvedValue({ data: mockResponse });

      const result = await storyService.update('1', updateData);

      expect(api.put).toHaveBeenCalledWith('/stories/1', updateData);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a story', async () => {
      const mockResponse: ApiResponse<null> = {
        success: true,
        message: 'Story deleted successfully',
        data: null,
      };

      vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

      const result = await storyService.delete('1');

      expect(api.delete).toHaveBeenCalledWith('/stories/1');
      expect(result.data).toEqual(mockResponse);
    });
  });
});

describe('chapterService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('should fetch chapter by id', async () => {
      const mockChapter: Chapter = {
        id: '1',
        title: 'Chapter 1',
        content: '<p>Chapter content</p>',
        storyId: 'story-1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      const mockResponse: ApiResponse<Chapter> = {
        success: true,
        message: 'Chapter fetched successfully',
        data: mockChapter,
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockResponse });

      const result = await chapterService.getById('story-1', '1');

      expect(api.get).toHaveBeenCalledWith('/stories/story-1/chapters/1');
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new chapter', async () => {
      const mockChapter: Chapter = {
        id: '1',
        title: 'Chapter 1',
        content: '<p>Chapter content</p>',
        storyId: 'story-1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      const mockResponse: ApiResponse<Chapter> = {
        success: true,
        message: 'Chapter created successfully',
        data: mockChapter,
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      const chapterData = {
        title: 'Chapter 1',
        content: '<p>Chapter content</p>',
      };

      const result = await chapterService.create('story-1', chapterData);

      expect(api.post).toHaveBeenCalledWith('/stories/story-1/chapters', chapterData);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update a chapter', async () => {
      const mockChapter: Chapter = {
        id: '1',
        title: 'Updated Chapter',
        content: '<p>Updated content</p>',
        storyId: 'story-1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      };

      const mockResponse: ApiResponse<Chapter> = {
        success: true,
        message: 'Chapter updated successfully',
        data: mockChapter,
      };

      vi.mocked(api.put).mockResolvedValue({ data: mockResponse });

      const chapterData = {
        title: 'Updated Chapter',
        content: '<p>Updated content</p>',
      };

      const result = await chapterService.update('story-1', '1', chapterData);

      expect(api.put).toHaveBeenCalledWith('/stories/story-1/chapters/1', chapterData);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a chapter', async () => {
      const mockResponse: ApiResponse<void> = {
        success: true,
        message: 'Chapter deleted successfully',
        data: undefined,
      };

      vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

      const result = await chapterService.delete('1');

      expect(api.delete).toHaveBeenCalledWith('/chapters/1');
      expect(result.data).toEqual(mockResponse);
    });
  });
});
