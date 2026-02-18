import { API_BASE_URL, STORAGE_KEYS, buildApiUrl } from './config';

// Re-export for backward compatibility
export { API_BASE_URL };

export const ACCESS_TOKEN_KEY = STORAGE_KEYS.ACCESS_TOKEN;
export const USER_INFO_KEY = STORAGE_KEYS.USER_INFO;

// Request deduplication: prevent duplicate concurrent requests
const pendingRequests = new Map<string, Promise<any>>();

function getRequestKey(path: string, options: RequestInit, withAuth: boolean): string {
  const method = options.method || 'GET';
  const body = options.body ? JSON.stringify(options.body) : '';
  const auth = withAuth ? getAccessToken() || '' : '';
  return `${method}:${path}:${body}:${auth}`;
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

const REFRESH_TOKEN_KEY = STORAGE_KEYS.REFRESH_TOKEN;

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function setUserInfo(user: unknown | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_INFO_KEY);
  }
}

export function getUserInfo<T = any>(): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  { withAuth }: { withAuth?: boolean } = {},
): Promise<T> {
  // For GET requests, check if there's a pending identical request
  const isGetRequest = !options.method || options.method === 'GET';
  if (isGetRequest) {
    const requestKey = getRequestKey(path, options, withAuth || false);
    const pendingRequest = pendingRequests.get(requestKey);
    if (pendingRequest) {
      return pendingRequest as Promise<T>;
    }
  }

  const url = buildApiUrl(path);

  const headers = new Headers(options.headers || {});
  // If body is FormData, let the browser set Content-Type with boundary
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData) {
    headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json');
  }

  if (withAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Create AbortController for 3-minute timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes = 180000ms

  const requestPromise = (async () => {
    try {
      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = res.statusText;
        try {
          const data = await res.json();
          // Handle different error response formats
          if (typeof data === 'string') {
            message = data;
          } else if (data && typeof data === 'object') {
            message = data.detail || data.message || data.error || JSON.stringify(data);
          }
        } catch {
          // If response is not JSON, use status text
        }
        throw new Error(message);
      }

      if (res.status === 204) {
        return undefined as unknown as T;
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout after 3 minutes');
      }
      throw error;
    } finally {
      // Remove from pending requests after completion (only for GET requests)
      if (isGetRequest) {
        const requestKey = getRequestKey(path, options, withAuth || false);
        pendingRequests.delete(requestKey);
      }
    }
  })();

  // Store pending request for GET requests to enable deduplication
  if (isGetRequest) {
    const requestKey = getRequestKey(path, options, withAuth || false);
    pendingRequests.set(requestKey, requestPromise);
  }

  return requestPromise;
}

