'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { authReducer, initialAuthState } from './reducers';
import type { LoginPayload, AuthUser } from './types';
import { getAccessToken, getUserInfo, setAccessToken, setUserInfo } from '../../apiClient';
import { fetchCurrentUser, loginRequest, signupRequest } from './api';

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Hydrate from localStorage on first client render
  useEffect(() => {
    const token = getAccessToken();
    const user = getUserInfo<AuthUser>();

    if (token && user) {
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, accessToken: token },
      });
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await loginRequest(payload);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: res.user, accessToken: res.access_token },
      });
      return res;
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message ?? 'Login failed' });
      throw err;
    }
  }, []);

  const signup = useCallback(async (payload: {
    email: string;
    username: string;
    full_name?: string;
    password: string;
  }) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await signupRequest(payload);
      // Signup doesn't return a token - user needs to login after signup
      return user;
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message ?? 'Signup failed' });
      throw err;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await fetchCurrentUser();
      const token = getAccessToken();
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, accessToken: token ?? '' },
      });
      return user;
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message ?? 'Failed to load user' });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUserInfo(null);
    // Clear Facebook token cache on logout
    localStorage.removeItem('facebook_token_cache');
    // Clear OAuth redirect flag
    localStorage.removeItem('oauth_redirecting');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  return {
    ...state,
    isAuthenticated: Boolean(state.accessToken && state.user),
    login,
    signup,
    refreshUser,
    logout,
  };
}

