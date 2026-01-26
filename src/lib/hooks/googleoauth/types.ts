export interface GoogleAuthUser {
  id: string;
  email: string;
  username: string;
  full_name?: string | null;
  profile_picture?: string | null;
}

export interface GoogleAuthResponse {
  access_token: string;
  token_type: string;
  user: GoogleAuthUser;
}

export interface GoogleOAuthState {
  loading: boolean;
  error: string | null;
}

