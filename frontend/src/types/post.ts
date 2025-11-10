export interface Post {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  author_id: number;
  author_name: string;
  author_image?: string;
  category_id?: number;
  category_name?: string;
  tags: string[];
  view_count: number;
  like_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostFormData {
  title: string;
  content: string;
  thumbnail?: string;
  category_id?: number;
  tags: string[];
}

export interface PostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface PostDetailResponse {
  success: boolean;
  data: {
    post: Post;
  };
}

export interface PostFilters {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}
