import { create } from 'zustand';
import { postApi } from '@/lib/api';
import type { Post, PostFilters } from '@/types';

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  filters: PostFilters;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPosts: () => Promise<void>;
  fetchPostById: (id: number) => Promise<void>;
  setFilters: (filters: Partial<PostFilters>) => void;
  resetFilters: () => void;
  clearCurrentPost: () => void;
  clearError: () => void;
}

const defaultFilters: PostFilters = {
  page: 1,
  limit: 10,
  category: undefined,
  tag: undefined,
  search: undefined,
};

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  currentPost: null,
  filters: defaultFilters,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,

  /**
   * Fetch posts with current filters
   */
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await postApi.getAll(filters);

      if (response.success && response.data) {
        set({
          posts: response.data.posts,
          totalPages: response.data.totalPages,
          currentPage: response.data.page,
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
        posts: [],
      });
    }
  },

  /**
   * Fetch single post by ID
   */
  fetchPostById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await postApi.getById(id);

      if (response.success && response.data) {
        set({
          currentPost: response.data.post,
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
        currentPost: null,
      });
    }
  },

  /**
   * Update filters
   */
  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    }));
  },

  /**
   * Reset filters to default
   */
  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  /**
   * Clear current post
   */
  clearCurrentPost: () => {
    set({ currentPost: null });
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));
