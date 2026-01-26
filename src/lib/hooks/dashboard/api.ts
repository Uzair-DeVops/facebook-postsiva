import { apiFetch } from '@/lib/apiClient';

export interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data?: {
    total_posts: number;
    published_posts: number;
    scheduled_posts: number;
    draft_posts: number;
    total_engagement: number;
    total_reach: number;
    average_engagement_rate: number;
    top_performing_post?: {
      id: string;
      platform: string;
      engagement: number;
      reach: number;
    };
    platforms_connected: string[];
    recent_posts: Array<{
      id: string;
      message?: string;
      platform: string;
      created_time: string;
      engagement?: number;
      reach?: number;
    }>;
    daily_stats?: Array<{
      date: string;
      posts_published: number;
      engagement: number;
      reach: number;
    }>;
  };
  error?: string;
}

export interface DashboardVideosResponse {
  success: boolean;
  message: string;
  videos?: Array<{
    video_id: string;
    title?: string;
    platform: string;
    created_at: string;
    views?: number;
    engagement?: number;
  }>;
  total?: number;
  error?: string;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  totalEngagement: number;
  totalReach: number;
  averageEngagementRate: number;
  platformsConnected: string[];
}

export async function fetchDashboardOverview(): Promise<DashboardOverviewResponse> {
  return apiFetch<DashboardOverviewResponse>(
    '/dashboard-overview/',
    { method: 'GET' },
    { withAuth: true }
  );
}

export async function fetchDashboardVideos(): Promise<DashboardVideosResponse> {
  return apiFetch<DashboardVideosResponse>(
    '/dashboard-overview/videos',
    { method: 'GET' },
    { withAuth: true }
  );
}
