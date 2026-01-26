import { apiFetch } from '../../../apiClient';

export interface FacebookImagePostResponse {
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

export interface CreateFacebookImagePostPayload {
  image_id: string;
  page_id: string;
  message?: string;
  scheduled_time?: string | null;
}

export async function createFacebookImagePost(
  payload: CreateFacebookImagePostPayload,
): Promise<FacebookImagePostResponse> {
  const form = new FormData();
  form.append('image_id', payload.image_id);
  form.append('page_id', payload.page_id);
  if (payload.message) {
    form.append('message', payload.message);
  }
  if (payload.scheduled_time) {
    form.append('scheduled_time', payload.scheduled_time);
  }

  const result = await apiFetch<FacebookImagePostResponse>(
    '/facebook/single-post/post',
    {
      method: 'POST',
      body: form,
      headers: {},
    },
    { withAuth: true },
  );

  return result;
}
