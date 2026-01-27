import { apiFetch } from '../../../apiClient';
import { getCachedValue, setCachedValue } from '../../../cache';
import type { FacebookPostsResponse } from './types';

export interface FetchFacebookPostsParams {
  pageId: string;
  limit?: number;
  after?: string;
  before?: string;
  forceRefresh?: boolean;
}

const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

export async function fetchFacebookPosts(
  params: FetchFacebookPostsParams,
): Promise<FacebookPostsResponse> {
  const { pageId, limit = 10, after, before, forceRefresh = false } = params;

  const cacheKey = `facebook_posts:v1:${pageId}:${limit}:${after || ''}:${
    before || ''
  }`;

  if (!forceRefresh) {
    const cached = getCachedValue<FacebookPostsResponse>(cacheKey);
    if (cached) return cached;
  }

  const search = new URLSearchParams();
  search.set('page_id', pageId);
  search.set('limit', String(limit));
  if (after) {
    search.set('after', after);
  }
  if (before) {
    search.set('before', before);
  }
  if (forceRefresh) {
    search.set('force_refresh', 'true');
  }

  const path = `/facebook/posts?${search.toString()}`;

  const data = await apiFetch<FacebookPostsResponse>(
    path,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  setCachedValue(cacheKey, data, CACHE_TTL_MS);

  return data;
}

