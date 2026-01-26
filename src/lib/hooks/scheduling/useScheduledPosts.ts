'use client';

import { useCallback, useReducer } from 'react';
import { scheduledPostsReducer, initialScheduledPostsState } from './reducers';
import { getScheduledPosts } from './api';
import type { GetScheduledPostsParams } from './types';

export function useScheduledPosts() {
  const [state, dispatch] = useReducer(
    scheduledPostsReducer,
    initialScheduledPostsState,
  );

  const loadScheduledPosts = useCallback(async (params?: GetScheduledPostsParams) => {
    dispatch({ type: 'SCHEDULED_POSTS_START' });
    try {
      const res = await getScheduledPosts(params);
      dispatch({
        type: 'SCHEDULED_POSTS_SUCCESS',
        payload: {
          posts: res.scheduled_posts || [],
          total: res.total || 0,
          platform: res.platform || null,
        },
      });
      return res;
    } catch (err: any) {
      dispatch({
        type: 'SCHEDULED_POSTS_ERROR',
        payload: err.message ?? 'Failed to load scheduled posts',
      });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'SCHEDULED_POSTS_RESET' });
  }, []);

  return {
    ...state,
    loadScheduledPosts,
    reset,
  };
}
