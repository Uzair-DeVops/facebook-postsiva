import { apiFetch, setAccessToken, setUserInfo } from '../../apiClient';
import { getCachedValue, setCachedValue } from '../../cache';
import type { LoginPayload, LoginResponse, AuthUser } from './types';

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // Persist token + user for future sessions
  setAccessToken(data.access_token);
  setUserInfo(data.user);

  return data;
}

export async function signupRequest(payload: {
  email: string;
  username: string;
  full_name?: string;
  password: string;
}): Promise<AuthUser> {
  const data = await apiFetch<AuthUser>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export const AUTH_USER_CACHE_KEY = 'auth_user:v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year

export async function fetchCurrentUser(options?: { forceRefresh?: boolean }): Promise<AuthUser> {
  // Local-first: return from cache unless forceRefresh
  if (!options?.forceRefresh) {
    const cached = getCachedValue<AuthUser>(AUTH_USER_CACHE_KEY);
    if (cached) return cached;
  }

  const data = await apiFetch<AuthUser>(
    '/auth/me',
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  // Keep user info in local storage in sync
  setUserInfo(data);
  setCachedValue(AUTH_USER_CACHE_KEY, data, CACHE_TTL_MS);

  return data;
}

