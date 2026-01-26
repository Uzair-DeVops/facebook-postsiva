import { apiFetch } from '../../../apiClient';
import { buildApiUrl, API_ENDPOINTS } from '../../../config';

export interface FacebookStoryPostResponse {
  success: boolean;
  message: string;
  post?: {
    id: string;
    permalink_url?: string;
  };
  error?: string | null;
}

export interface CreateFacebookImageStoryPayload {
  image_id: string;
  page_id: string;
  scheduled_time?: string;
}

export interface CreateFacebookVideoStoryPayload {
  video_id: string;
  page_id: string;
  scheduled_time?: string;
}

export async function createFacebookImageStory(
  payload: CreateFacebookImageStoryPayload
): Promise<FacebookStoryPostResponse> {
  const formData = new FormData();
  formData.append('image_id', payload.image_id);
  formData.append('page_id', payload.page_id);
  
  if (payload.scheduled_time) {
    formData.append('scheduled_time', payload.scheduled_time);
  }

  const data = await apiFetch<FacebookStoryPostResponse>(
    '/facebook/stories/image/',
    {
      method: 'POST',
      body: formData,
    },
    { withAuth: true },
  );

  return data;
}

export async function createFacebookVideoStory(
  payload: CreateFacebookVideoStoryPayload
): Promise<FacebookStoryPostResponse> {
  const formData = new FormData();
  formData.append('video_id', payload.video_id);
  formData.append('page_id', payload.page_id);
  
  if (payload.scheduled_time) {
    formData.append('scheduled_time', payload.scheduled_time);
  }

  const data = await apiFetch<FacebookStoryPostResponse>(
    '/facebook/stories/video/',
    {
      method: 'POST',
      body: formData,
    },
    { withAuth: true },
  );

  return data;
}
