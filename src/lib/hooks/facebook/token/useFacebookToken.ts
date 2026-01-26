'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FacebookTokenData, FacebookTokenState } from './types';
import { fetchFacebookToken } from './api';

interface UseFacebookTokenOptions {
  autoLoad?: boolean;
}

const FACEBOOK_TOKEN_CACHE_KEY = 'facebook_token_cache';

export function useFacebookToken(options: UseFacebookTokenOptions = {}) {
  const { autoLoad = true } = options;
  const hasLoadedRef = useRef(false);

  const [state, setState] = useState<FacebookTokenState>({
    loading: false,
    error: null,
    hasToken: false,
    token: null,
  });

  const load = useCallback(async (skipCache = false) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // Try to get from cache first (unless explicitly skipping cache)
      if (!skipCache) {
        const cached = localStorage.getItem(FACEBOOK_TOKEN_CACHE_KEY);
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            if (cachedData && Object.keys(cachedData).length > 0) {
              setState({
                loading: false,
                error: null,
                hasToken: true,
                token: cachedData,
              });
              return { success: true, message: 'Loaded from cache', data: cachedData };
            }
          } catch {
            // Invalid cache, proceed with fetch
            localStorage.removeItem(FACEBOOK_TOKEN_CACHE_KEY);
          }
        }
      }

      // Fetch from server
      const res = await fetchFacebookToken();
      const hasToken = res.success && res.data && Object.keys(res.data).length > 0;
      
      // Cache the token if it exists
      if (hasToken && res.data) {
        localStorage.setItem(FACEBOOK_TOKEN_CACHE_KEY, JSON.stringify(res.data));
      } else {
        localStorage.removeItem(FACEBOOK_TOKEN_CACHE_KEY);
      }

      setState({
        loading: false,
        error: null,
        hasToken,
        token: hasToken ? (res.data as FacebookTokenData) : null,
      });
      return res;
    } catch (err: any) {
      // Clear cache on error
      localStorage.removeItem(FACEBOOK_TOKEN_CACHE_KEY);
      setState({
        loading: false,
        error: err.message ?? 'Failed to load Facebook token',
        hasToken: false,
        token: null,
      });
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!autoLoad || hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    load().catch(() => undefined);
  }, [autoLoad, load]);

  return {
    ...state,
    reload: load,
  };
}

