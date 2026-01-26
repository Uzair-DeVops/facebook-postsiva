import { apiFetch } from '../../apiClient';
import { buildApiUrl, API_ENDPOINTS } from '../../config';
import type { ScheduledPostsResponse, GetScheduledPostsParams, ScheduledPost } from './types';

interface BackendScheduledPostsResponse {
  success: boolean;
  message: string;
  data?: {
    scheduled_posts?: ScheduledPost[];
    total?: number;
    platform?: string | null;
  };
  error?: string | null;
}

export async function getScheduledPosts(
  params?: GetScheduledPostsParams
): Promise<ScheduledPostsResponse> {
  const url = buildApiUrl('/scheduled-posts/my-scheduled-posts');
  const queryParams = new URLSearchParams();
  
  if (params?.platform) {
    queryParams.append('platform', params.platform);
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }
  
  const queryString = queryParams.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  const response = await apiFetch<BackendScheduledPostsResponse>(
    fullUrl,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  // Transform backend response to frontend format
  if (response.success && response.data) {
    return {
      user_id: '', // Will be set by the hook if needed
      scheduled_posts: response.data.scheduled_posts || [],
      total: response.data.total || 0,
      platform: response.data.platform || null,
    };
  }

  // Return empty response if not successful
  return {
    user_id: '',
    scheduled_posts: [],
    total: 0,
    platform: null,
  };
}

export interface UpdateScheduledPostRequest {
  scheduled_time?: string;
  post_data?: Record<string, any>;
  status?: string;
}

export async function updateScheduledPost(
  scheduledPostId: string,
  updateData: UpdateScheduledPostRequest
): Promise<ScheduledPostsResponse> {
  const url = buildApiUrl(`/scheduled-posts/${scheduledPostId}`);
  
  const response = await apiFetch<BackendScheduledPostsResponse>(
    url,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    },
    { withAuth: true },
  );

  // Transform backend response to frontend format
  if (response.success && response.data) {
    return {
      user_id: '',
      scheduled_posts: response.data.scheduled_posts || [],
      total: response.data.total || 0,
      platform: response.data.platform || null,
    };
  }

  // Return empty response if not successful
  return {
    user_id: '',
    scheduled_posts: [],
    total: 0,
    platform: null,
  };
}

export async function deleteScheduledPost(
  scheduledPostId: string
): Promise<ScheduledPostsResponse> {
  const url = buildApiUrl(`/scheduled-posts/${scheduledPostId}`);
  
  const response = await apiFetch<BackendScheduledPostsResponse>(
    url,
    {
      method: 'DELETE',
    },
    { withAuth: true },
  );

  // Transform backend response to frontend format
  if (response.success && response.data) {
    return {
      user_id: '',
      scheduled_posts: response.data.scheduled_posts || [],
      total: response.data.total || 0,
      platform: response.data.platform || null,
    };
  }

  // Return empty response if not successful
  return {
    user_id: '',
    scheduled_posts: [],
    total: 0,
    platform: null,
  };
}
