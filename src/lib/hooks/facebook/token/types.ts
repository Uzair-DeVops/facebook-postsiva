export interface FacebookTokenData {
  // We don't need all fields, but keep it generic
  access_token?: string;
  expires_at?: string;
  [key: string]: any;
}

export interface FacebookTokenResponse {
  success: boolean;
  message: string;
  data: FacebookTokenData;
}

export interface FacebookTokenState {
  loading: boolean;
  error: string | null;
  hasToken: boolean;
  token: FacebookTokenData | null;
}

