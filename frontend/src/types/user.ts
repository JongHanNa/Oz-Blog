export interface User {
  id: number;
  email: string;
  username: string;
  bio?: string;
  profile_image?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}
