import { apiFetch } from '../../../apiClient';
import { getCachedValue, setCachedValue } from '../../../cache';
import type { FacebookUserProfileResponse } from './types';

// Cache for a long period (1 year) and only refetch when explicitly forced.
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 365;
const CACHE_KEY = 'facebook_user_profile:v1';

export async function fetchFacebookUserProfile(
  refresh?: boolean,
  options?: { forceRefresh?: boolean },
): Promise<FacebookUserProfileResponse> {
  const force = options?.forceRefresh === true || refresh === true;

  if (!force) {
    const cached = getCachedValue<FacebookUserProfileResponse>(CACHE_KEY);
    if (cached) return cached;
  }

  const query = `?refresh=${force ? 'true' : 'false'}`;
  const data = await apiFetch<FacebookUserProfileResponse>(
    `/facebook/user-profile/${query}`,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  setCachedValue(CACHE_KEY, data, CACHE_TTL_MS);

  return data;
}

