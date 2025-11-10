export type { User, LoginCredentials, SignupData, AuthResponse } from './user';
export type { Post, PostFormData, PostsResponse, PostDetailResponse, PostFilters } from './post';
export type { Comment, CommentFormData, CommentsResponse } from './comment';
export type { Category, CategoriesResponse } from './category';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
