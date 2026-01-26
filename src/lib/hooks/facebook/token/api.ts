import { apiFetch } from '../../../apiClient';
import type { FacebookTokenResponse } from './types';

export async function fetchFacebookToken(): Promise<FacebookTokenResponse> {
  const data = await apiFetch<FacebookTokenResponse>(
    '/facebook/get-token',
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  return data;
}

