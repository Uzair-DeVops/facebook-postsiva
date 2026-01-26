import { apiFetch } from '../../../apiClient';

export interface FacebookVideoPostResponse {
  success: boolean;
  message: string;
  post?: {
    id?: string;
    post_id?: string;
    permalink_url?: string;
    created_time?: string;
  } | null;
  error?: string | null;
}

export interface CreateFacebookVideoPostPayload {
  video_id: string;
  page_id: string;
  description?: string;
  scheduled_time?: string | null;
}

export async function createFacebookVideoPost(
  payload: CreateFacebookVideoPostPayload,
): Promise<FacebookVideoPostResponse> {
  const form = new FormData();
  form.append('video_id', payload.video_id);
  form.append('page_id', payload.page_id);
  if (payload.description) {
    form.append('description', payload.description);
  }
  if (payload.scheduled_time) {
    form.append('scheduled_time', payload.scheduled_time);
  }

  const result = await apiFetch<FacebookVideoPostResponse>(
    '/facebook/video/post',
    {
      method: 'POST',
      body: form,
      headers: {},
    },
    { withAuth: true },
  );

  return result;
}
