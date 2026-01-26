'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FacebookPost } from './types';
import { fetchFacebookPosts } from './api';

interface UseFacebookPostsOptions {
  pageId: string | null;
  limit?: number;
}

export function useFacebookPosts({ pageId, limit = 10 }: UseFacebookPostsOptions) {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (opts?: { forceRefresh?: boolean }) => {
      if (!pageId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchFacebookPosts({
          pageId,
          limit,
          forceRefresh: opts?.forceRefresh,
        });
        if (!res.success) {
          throw new Error(res.message || 'Failed to load Facebook posts');
        }
        setPosts(res.data || []);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load Facebook posts');
      } finally {
        setLoading(false);
      }
    },
    [pageId, limit],
  );

  useEffect(() => {
    if (!pageId) return;
    load().catch(() => undefined);
  }, [pageId, load]);

  return {
    posts,
    loading,
    error,
    reload: load,
  };
}

