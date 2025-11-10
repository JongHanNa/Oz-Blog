export interface Comment {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  username: string;
  profile_image?: string;
  parent_id?: number | null;
  replies?: Comment[];
  created_at: string;
}

export interface CommentFormData {
  content: string;
  post_id: number;
  parent_id?: number | null;
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
  };
}
