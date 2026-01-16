import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStories } from './useStories';
import { storyService } from '../services/storyService';

vi.mock('../services/storyService', () => ({
  storyService: {
    getAll: vi.fn(),
  },
}));

describe('useStories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch stories successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Stories fetched',
        data: [
          { id: '1', title: 'Story 1', author: 'Author 1', category: 'FINANCIAL', tags: [], status: 'PUBLISH', createdAt: '', updatedAt: '', synopsis: '' }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      }
    };

    vi.mocked(storyService.getAll).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useStories());

    expect(result.current.loading).toBe(false);
    expect(result.current.stories).toEqual([]);

    await result.current.fetchStories({});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stories).toEqual(mockResponse.data.data);
    expect(storyService.getAll).toHaveBeenCalledWith({});
  });

  it('should handle fetch error', async () => {
    vi.mocked(storyService.getAll).mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useStories());

    await result.current.fetchStories({});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed');
    expect(result.current.stories).toEqual([]);
  });

  it('should call getAll with correct params', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Stories fetched',
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      }
    };

    vi.mocked(storyService.getAll).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useStories());

    await result.current.fetchStories({ search: 'test' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(storyService.getAll).toHaveBeenCalledWith({ search: 'test' });
  });
});
