/**
 * Application Configuration
 * 
 * Centralized configuration for all API URLs and endpoints.
 * Change URLs here or via environment variables.
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_API_BASE_URL: Base URL for the backend API (default: https://backend.postsiva.com)
 * - NEXT_PUBLIC_API_URL: Alternative env var name (falls back to NEXT_PUBLIC_API_BASE_URL)
 * - NEXT_PUBLIC_FRONTEND_URL: Frontend URL for OAuth callbacks (default: http://localhost:3000)
 */

// Base API URL - can be overridden via environment variables
const getApiBaseUrl = (): string => {
  // Check both env var names for flexibility
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  );
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints
 * All API endpoints are relative to API_BASE_URL unless they start with http:// or https://
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ME: '/auth/me',
    GOOGLE_LOGIN: '/auth/google/login',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },

  // OAuth
  OAUTH: {
    FACEBOOK_CREATE_TOKEN: '/facebook/create-token',
    TOKENS: '/oauth/tokens',
  },

  // Facebook
  FACEBOOK: {
    GET_TOKEN: '/facebook/get-token',
    PAGES: '/facebook/pages',
    POSTS: '/facebook/posts',
    USER_PROFILE: '/facebook/user-profile',
    TEXT_POST: '/facebook/text-post',
    PERSONA: {
      BUILD: '/facebook/persona/build',
      GET: '/facebook/persona',
      UPDATE: '/facebook/persona',
      PATCH: '/facebook/persona',
      DELETE: '/facebook/persona',
      REGENERATE: '/facebook/persona',
    },
    AI_AGENT_PERSONA: {
      BUILD: '/facebook/ai-agent-persona/build',
      GET: '/facebook/ai-agent-persona',
      UPDATE: '/facebook/ai-agent-persona',
      PATCH: '/facebook/ai-agent-persona',
      DELETE: '/facebook/ai-agent-persona',
      REGENERATE: '/facebook/ai-agent-persona',
    },
  },

  // Media
  MEDIA: {
    UPLOAD: '/media/upload',
    LIST: '/media/list',
    GET: '/media/get',
    DELETE: '/media/delete',
  },

  // Dashboard
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    VIDEOS: '/dashboard/videos',
  },

  // Tier System
  TIER: {
    GET_TIERS: '/tiers',
    USAGE: '/usage',
    ORDERS: '/orders',
  },
} as const;

/**
 * Helper function to build full URL from endpoint
 * @param endpoint - API endpoint (relative or absolute)
 * @returns Full URL
 */
export function buildApiUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  return `${API_BASE_URL}${endpoint}`;
}

/**
 * Helper function to build Google OAuth login URL with redirect URI
 * @param redirectUri - The redirect path after OAuth (e.g., /auth/google/callback)
 * @param origin - Optional frontend origin URL (defaults to localhost:3000)
 * @returns Full Google OAuth login URL
 */
export function buildGoogleOAuthLoginUrl(redirectUri: string, origin?: string): string {
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`);
  url.searchParams.set('redirect_uri', redirectUri);
  
  // Add origin parameter so backend knows where to redirect after OAuth
  if (origin) {
    url.searchParams.set('origin', origin);
  } else if (typeof window !== 'undefined') {
    // Use current window origin if available
    url.searchParams.set('origin', window.location.origin);
  } else {
    // Default to localhost for server-side
    url.searchParams.set('origin', 'http://localhost:3000');
  }
  
  return url.toString();
}

/**
 * Helper function to build Google OAuth callback URL
 * @param code - Authorization code from Google
 * @param state - Optional state parameter
 * @returns Full Google OAuth callback URL
 */
export function buildGoogleOAuthCallbackUrl(code: string, state?: string): string {
  const params = new URLSearchParams({ code });
  if (state) {
    params.append('state', state);
  }
  return `${API_BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_CALLBACK}?${params.toString()}`;
}

/**
 * Frontend URLs (for redirects)
 */
export const FRONTEND_URLS = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/profile',
  FACEBOOK_CONNECT: '/facebook-connect',
  GOOGLE_CALLBACK: '/auth/google/callback',
} as const;

/**
 * Helper function to get frontend callback URL
 * Returns the path only (not full URL) for backend redirect_uri parameter
 * The backend will use this path to redirect after OAuth completes
 * @returns Frontend callback path (e.g., /auth/google/callback)
 */
export function getFrontendCallbackUrl(): string {
  // Return just the path - backend will prepend the frontend origin
  return FRONTEND_URLS.GOOGLE_CALLBACK;
}

/**
 * Helper function to get full frontend callback URL
 * Used when we need the complete URL (e.g., for display or logging)
 * @returns Full frontend callback URL
 */
export function getFullFrontendCallbackUrl(): string {
  const frontendUrl = 
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    // 'http://localhost:3000';
    'https://facebook-autoamtion-website-sigma.vercel.app';
  
  // Ensure it's a full URL with protocol
  const url = frontendUrl.startsWith('http') 
    ? frontendUrl 
    : `http://${frontendUrl}`;
  
  return `${url}${FRONTEND_URLS.GOOGLE_CALLBACK}`;
}

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'postsiva_access_token',
  USER_INFO: 'postsiva_user',
} as const;
