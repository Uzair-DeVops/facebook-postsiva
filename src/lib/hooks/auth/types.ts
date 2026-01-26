export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthUser; accessToken: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' };

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

