import { apiFetch } from '../../../apiClient';

export interface FacebookCarouselPostResponse {
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

export interface CreateFacebookCarouselPostPayload {
  image_ids: string[]; // Array of media IDs (UUIDs)
  page_id: string;
  message?: string;
  scheduled_time?: string | null;
}

export async function createFacebookCarouselPost(
  payload: CreateFacebookCarouselPostPayload,
): Promise<FacebookCarouselPostResponse> {
  const form = new FormData();
  // Backend expects comma-separated string of UUIDs
  form.append('image_ids', payload.image_ids.join(','));
  form.append('page_id', payload.page_id);
  if (payload.message) {
    form.append('message', payload.message);
  }
  if (payload.scheduled_time) {
    form.append('scheduled_time', payload.scheduled_time);
  }

  const result = await apiFetch<FacebookCarouselPostResponse>(
    '/facebook/carousel/post',
    {
      method: 'POST',
      body: form,
      headers: {},
    },
    { withAuth: true },
  );

  return result;
}
