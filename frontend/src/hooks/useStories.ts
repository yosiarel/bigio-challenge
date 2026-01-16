import { useState, useCallback } from 'react';
import { storyService, Story, GetAllStoriesParams } from '../services/storyService';

interface UseStoriesReturn {
  stories: Story[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalStories: number;
  fetchStories: (params: GetAllStoriesParams) => Promise<void>;
  refreshStories: () => Promise<void>;
}

export function useStories(initialParams?: GetAllStoriesParams): UseStoriesReturn {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStories, setTotalStories] = useState(0);
  const [lastParams, setLastParams] = useState<GetAllStoriesParams | undefined>(initialParams);

  const fetchStories = useCallback(async (params: GetAllStoriesParams) => {
    try {
      setLoading(true);
      setError(null);
      setLastParams(params);
      
      const response = await storyService.getAll(params);
      setStories(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalStories(response.data.pagination.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stories';
      setError(message);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStories = useCallback(async () => {
    if (lastParams) {
      await fetchStories(lastParams);
    }
  }, [lastParams, fetchStories]);

  return {
    stories,
    loading,
    error,
    totalPages,
    totalStories,
    fetchStories,
    refreshStories,
  };
}
