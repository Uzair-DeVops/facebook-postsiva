export interface FacebookTextPost {
  id?: string;
  message?: string;
  permalink_url?: string;
  created_time?: string;
  scheduled_publish_time?: string | null;
  status?: string;
}

export interface FacebookTextPostResponse {
  success: boolean;
  message: string;
  post?: FacebookTextPost | null;
  error?: string | null;
}

export interface FacebookTextPostState {
  loading: boolean;
  error: string | null;
  lastPost: FacebookTextPost | null;
}

