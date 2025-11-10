import type {
  LoginCredentials,
  SignupData,
  AuthResponse,
  PostsResponse,
  PostDetailResponse,
  PostFormData,
  CommentsResponse,
  CommentFormData,
  CategoriesResponse,
  PostFilters,
  ApiResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get authentication headers with JWT token
 */
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// =============================================================================
// Authentication API
// =============================================================================

export const authApi = {
  /**
   * User login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiRequest<AuthResponse['data']>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * User signup
   */
  async signup(userData: SignupData): Promise<AuthResponse> {
    return apiRequest<AuthResponse['data']>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Get current user info
   */
  async getMe(): Promise<ApiResponse> {
    return apiRequest('/auth/me');
  },
};

// =============================================================================
// Posts API
// =============================================================================

export const postApi = {
  /**
   * Get all posts with filters
   */
  async getAll(filters?: PostFilters): Promise<PostsResponse> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    return apiRequest<PostsResponse['data']>(`/posts${query ? `?${query}` : ''}`);
  },

  /**
   * Get post by ID
   */
  async getById(id: number): Promise<PostDetailResponse> {
    return apiRequest<PostDetailResponse['data']>(`/posts/${id}`);
  },

  /**
   * Create new post
   */
  async create(postData: PostFormData): Promise<ApiResponse> {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  /**
   * Update post
   */
  async update(id: number, postData: Partial<PostFormData>): Promise<ApiResponse> {
    return apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  /**
   * Delete post
   */
  async delete(id: number): Promise<ApiResponse> {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// =============================================================================
// Comments API
// =============================================================================

export const commentApi = {
  /**
   * Get comments for a post
   */
  async getByPostId(postId: number): Promise<CommentsResponse> {
    return apiRequest<CommentsResponse['data']>(`/comments/post/${postId}`);
  },

  /**
   * Create new comment
   */
  async create(commentData: CommentFormData): Promise<ApiResponse> {
    return apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  /**
   * Delete comment
   */
  async delete(id: number): Promise<ApiResponse> {
    return apiRequest(`/comments/${id}`, {
      method: 'DELETE',
    });
  },
};

// =============================================================================
// Interactions API (Likes & Bookmarks)
// =============================================================================

export const interactionApi = {
  /**
   * Toggle like on post
   */
  async toggleLike(postId: number): Promise<ApiResponse> {
    return apiRequest(`/interactions/like/${postId}`, {
      method: 'POST',
    });
  },

  /**
   * Toggle bookmark on post
   */
  async toggleBookmark(postId: number): Promise<ApiResponse> {
    return apiRequest(`/interactions/bookmark/${postId}`, {
      method: 'POST',
    });
  },
};

// =============================================================================
// Categories API
// =============================================================================

export const categoryApi = {
  /**
   * Get all categories
   */
  async getAll(): Promise<CategoriesResponse> {
    return apiRequest<CategoriesResponse['data']>('/categories');
  },
};

// =============================================================================
// Users API
// =============================================================================

export const userApi = {
  /**
   * Get user profile by ID
   */
  async getById(id: number): Promise<ApiResponse> {
    return apiRequest(`/users/${id}`);
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<{ username: string; bio: string; profile_image: string }>): Promise<ApiResponse> {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};
