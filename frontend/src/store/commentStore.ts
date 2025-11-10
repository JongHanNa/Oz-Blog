import { create } from 'zustand';
import { commentApi } from '@/lib/api';
import type { Comment, CommentFormData } from '@/types';

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchComments: (postId: number) => Promise<void>;
  addComment: (commentData: CommentFormData) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  clearComments: () => void;
  clearError: () => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  isLoading: false,
  error: null,

  /**
   * Fetch comments for a post
   */
  fetchComments: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await commentApi.getByPostId(postId);

      if (response.success && response.data) {
        set({
          comments: response.data.comments,
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '댓글을 불러오는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
        comments: [],
      });
    }
  },

  /**
   * Add new comment
   */
  addComment: async (commentData) => {
    set({ isLoading: true, error: null });
    try {
      await commentApi.create(commentData);

      // Refresh comments after adding
      const response = await commentApi.getByPostId(commentData.post_id);

      if (response.success && response.data) {
        set({
          comments: response.data.comments,
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '댓글 작성에 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Delete comment
   */
  deleteComment: async (commentId) => {
    set({ isLoading: true, error: null });
    try {
      await commentApi.delete(commentId);

      // Remove comment from state
      set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== commentId),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '댓글 삭제에 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Clear all comments
   */
  clearComments: () => {
    set({ comments: [] });
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));
