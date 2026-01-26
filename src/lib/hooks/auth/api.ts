import { apiFetch, setAccessToken, setUserInfo } from '../../apiClient';
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

export async function fetchCurrentUser(): Promise<AuthUser> {
  const data = await apiFetch<AuthUser>(
    '/auth/me',
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  // Keep user info in local storage in sync
  setUserInfo(data);

  return data;
}

