'use client';

import { useCallback, useReducer } from 'react';
import { facebookTextPostReducer, initialFacebookTextPostState } from './reducers';
import { createFacebookTextPost, type CreateFacebookTextPostPayload } from './api';

export function useFacebookTextPost() {
  const [state, dispatch] = useReducer(
    facebookTextPostReducer,
    initialFacebookTextPostState,
  );

  const publishTextPost = useCallback(async (payload: CreateFacebookTextPostPayload) => {
    dispatch({ type: 'TEXT_POST_START' });
    try {
      const res = await createFacebookTextPost(payload);
      if (!res.success) {
        throw new Error(res.error || res.message || 'Failed to create Facebook text post');
      }
      dispatch({ type: 'TEXT_POST_SUCCESS', payload: res.post ?? null });
      return res;
    } catch (err: any) {
      dispatch({
        type: 'TEXT_POST_ERROR',
        payload: err.message ?? 'Failed to create Facebook text post',
      });
      throw err;
    }
  }, []);

  return {
    ...state,
    publishTextPost,
  };
}

