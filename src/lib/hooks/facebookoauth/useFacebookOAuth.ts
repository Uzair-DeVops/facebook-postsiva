'use client';

import { useCallback, useEffect, useReducer, useState } from 'react';
import { facebookOAuthReducer, initialFacebookOAuthState } from './reducers';
import { createFacebookAuthUrl, disconnectFacebook, fetchFacebookPages } from './api';
import type { FacebookPagesResponse } from './types';

export function useFacebookOAuth() {
  const [state, dispatch] = useReducer(facebookOAuthReducer, initialFacebookOAuthState);
  const [pages, setPages] = useState<FacebookPagesResponse | null>(null);

  const connect = useCallback(async () => {
    dispatch({ type: 'FACEBOOK_OAUTH_START' });
    try {
      const authUrl = await createFacebookAuthUrl();
      // Open Facebook OAuth in a new window (backend returns HTML page)
      const popup = window.open(authUrl, 'facebook-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        throw new Error('Popup blocked. Please allow popups for this site and try again.');
      }
      
      // Focus the popup
      popup.focus();
      
      // Note: We don't set success here - the parent page will check for token
      // when the popup closes or user completes OAuth
    } catch (err: any) {
      dispatch({
        type: 'FACEBOOK_OAUTH_ERROR',
        payload: err.message ?? 'Failed to start Facebook connection',
      });
      throw err;
    }
  }, []);

  const loadPages = useCallback(async () => {
    dispatch({ type: 'FACEBOOK_OAUTH_START' });
    try {
      const res = await fetchFacebookPages();
      setPages(res);
      dispatch({
        type: 'FACEBOOK_OAUTH_SUCCESS',
      });
      return res;
    } catch (err: any) {
      dispatch({
        type: 'FACEBOOK_OAUTH_ERROR',
        payload: err.message ?? 'Failed to load Facebook pages',
      });
      throw err;
    }
  }, []);

  const disconnect = useCallback(async () => {
    dispatch({ type: 'FACEBOOK_OAUTH_START' });
    try {
      await disconnectFacebook();
      setPages(null);
      dispatch({ type: 'FACEBOOK_OAUTH_DISCONNECT' });
    } catch (err: any) {
      dispatch({
        type: 'FACEBOOK_OAUTH_ERROR',
        payload: err.message ?? 'Failed to disconnect Facebook',
      });
      throw err;
    }
  }, []);

  // Optional: auto-check if user already has pages when hook mounts
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchFacebookPages();
        if (res && res.count !== undefined && res.count > 0) {
          setPages(res);
          dispatch({ type: 'FACEBOOK_OAUTH_SUCCESS' });
        }
      } catch {
        // Ignore on mount; user may not have connected Facebook yet
      }
    })();
  }, []);

  return {
    ...state,
    pages,
    connect,
    loadPages,
    disconnect,
  };
}

