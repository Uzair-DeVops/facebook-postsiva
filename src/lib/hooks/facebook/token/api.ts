import { apiFetch } from '../../../apiClient';
import { getCachedValue, setCachedValue, clearCachedValue } from '../../../cache';
import type { FacebookTokenResponse } from './types';

const CACHE_KEY = 'facebook_token:v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year - local-first

export async function fetchFacebookToken(options?: { forceRefresh?: boolean }): Promise<FacebookTokenResponse> {
  if (!options?.forceRefresh) {
    const cached = getCachedValue<FacebookTokenResponse>(CACHE_KEY);
    if (cached) return cached;
  }

  const data = await apiFetch<FacebookTokenResponse>(
    '/facebook/get-token',
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  if (data?.success) {
    setCachedValue(CACHE_KEY, data, CACHE_TTL_MS);
  } else {
    // Clear cache if token doesn't exist or request failed
    clearCachedValue(CACHE_KEY);
  }

  return data;
}

