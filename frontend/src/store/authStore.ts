import { create } from 'zustand';
import { authApi } from '@/lib/api';
import type { User, LoginCredentials, SignupData } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  initialize: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Login user
   */
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);

      if (response.success && response.data) {
        const { token, user } = response.data;

        // Save token to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  /**
   * Signup new user
   */
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.signup(userData);

      if (response.success && response.data) {
        const { token, user } = response.data;

        // Save token to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    // Remove token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * Initialize auth state from localStorage
   */
  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token) {
        // Verify token and get user info
        authApi.getMe()
          .then((response) => {
            if (response.success && response.data) {
              set({
                user: response.data.user,
                token,
                isAuthenticated: true,
              });
            } else {
              // Token is invalid, clear it
              localStorage.removeItem('token');
              set({
                user: null,
                token: null,
                isAuthenticated: false,
              });
            }
          })
          .catch(() => {
            // Token verification failed
            localStorage.removeItem('token');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          });
      }
    }
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));
