import { apiFetch } from '../../../apiClient';
import type { FacebookTextPostResponse } from './types';

export interface CreateFacebookTextPostPayload {
  message: string;
  page_id: string;
  scheduled_time?: string | null;
}

export async function createFacebookTextPost(
  payload: CreateFacebookTextPostPayload,
): Promise<FacebookTextPostResponse> {
  const form = new FormData();
  form.append('message', payload.message);
  form.append('page_id', payload.page_id);
  if (payload.scheduled_time) {
    form.append('scheduled_time', payload.scheduled_time);
  }

  const result = await apiFetch<FacebookTextPostResponse>(
    '/facebook/text-post/post',
    {
      method: 'POST',
      body: form,
      // Let browser set multipart boundary, so don't set Content-Type here
      headers: {},
    },
    { withAuth: true },
  );

  return result;
}

