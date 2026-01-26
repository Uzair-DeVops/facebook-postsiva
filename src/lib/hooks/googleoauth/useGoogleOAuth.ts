'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { googleOAuthReducer, initialGoogleOAuthState } from './reducers';
import { buildGoogleLoginUrl, handleGoogleCallbackFromSearch } from './api';
import type { GoogleAuthResponse } from './types';

export function useGoogleOAuth() {
  const [state, dispatch] = useReducer(googleOAuthReducer, initialGoogleOAuthState);
  const router = useRouter();

  const startLogin = useCallback((redirectPath?: string) => {
    dispatch({ type: 'GOOGLE_OAUTH_START' });
    try {
      const url = buildGoogleLoginUrl({ redirectPath });
      window.location.href = url;
    } catch (err: any) {
      dispatch({
        type: 'GOOGLE_OAUTH_ERROR',
        payload: err.message ?? 'Failed to start Google login',
      });
    }
  }, []);

  const handleCallback = useCallback(async (search: string): Promise<{ response: GoogleAuthResponse; redirectPath: string } | null> => {
    dispatch({ type: 'GOOGLE_OAUTH_START' });
    try {
      const result = await handleGoogleCallbackFromSearch(search);
      if (!result) {
        dispatch({
          type: 'GOOGLE_OAUTH_ERROR',
          payload: 'Invalid or missing Google auth parameters',
        });
        return null;
      }
      dispatch({ type: 'GOOGLE_OAUTH_SUCCESS' });
      return result;
    } catch (err: any) {
      dispatch({
        type: 'GOOGLE_OAUTH_ERROR',
        payload: err.message ?? 'Failed to process Google callback',
      });
      return null;
    }
  }, []);

  // Auto-handle callback when mounted and redirect based on Facebook token status
  const useAutoHandleCallback = (): GoogleAuthResponse | null => {
    const [result, setResult] = useReducer(
      (state: GoogleAuthResponse | null, action: GoogleAuthResponse | null) => action,
      null,
    );

    useEffect(() => {
      if (typeof window === 'undefined') return;
      
      const processCallback = async () => {
        const callbackResult = await handleCallback(window.location.search);
        if (callbackResult) {
          setResult(callbackResult.response);
          // Redirect to the appropriate path based on Facebook token status
          router.replace(callbackResult.redirectPath);
        }
      };
      
      processCallback();
    }, [handleCallback, router]);

    return result;
  };

  return {
    ...state,
    startLogin,
    handleCallback,
    useAutoHandleCallback,
  };
}

