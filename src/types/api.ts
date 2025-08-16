// Типы для API responses
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Типы для Supabase responses
export interface SupabaseResponse<T = any> {
  data: T | null;
  error: {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
  } | null;
}

// Типы для Edge Functions
export interface EdgeFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

// Типы для аутентификации
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: AuthUser;
}

// Типы для хранилища
export interface StorageUploadResponse {
  path: string;
  id: string;
  fullPath: string;
}
