export interface ScheduledPostMedia {
  media_id: string;
  public_url: string;
  media_type: string;
  filename: string;
  file_size: number;
  platform: string;
}

export interface ScheduledPostMediaInfo {
  media_count: number;
  media_urls: ScheduledPostMedia[];
}

export interface ScheduledPost {
  scheduled_post_id: string;
  platform: string;
  post_type: string;
  post_data: Record<string, any>;
  scheduled_time: string;
  scheduled_time_local?: string | null;
  scheduled_time_formatted?: string | null;
  status: string;
  file_path?: string | null;
  file_filename?: string | null;
  file_size?: number | null;
  published_post_id?: string | null;
  published_post_url?: string | null;
  error_message?: string | null;
  time_until_scheduled?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  published_at?: string | null;
  media?: ScheduledPostMediaInfo | null;
}

export interface ScheduledPostsResponse {
  user_id: string;
  scheduled_posts: ScheduledPost[];
  total: number;
  platform?: string | null;
}

export interface ScheduledPostsState {
  loading: boolean;
  error: string | null;
  scheduledPosts: ScheduledPost[];
  total: number;
  platform: string | null;
}

export interface GetScheduledPostsParams {
  platform?: string;
  limit?: number;
  offset?: number;
}
