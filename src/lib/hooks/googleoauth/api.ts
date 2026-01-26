import { API_BASE_URL, setAccessToken, setUserInfo } from '../../apiClient';
import { buildGoogleOAuthLoginUrl, getFrontendCallbackUrl } from '../../config';
import type { GoogleAuthResponse } from './types';
import { fetchFacebookToken } from '../facebook/token/api';

/**
 * Build the Google login URL on the backend.
 * Frontend will redirect the browser to this URL.
 * Uses config function to ensure localhost callback URLs are used.
 */
export function buildGoogleLoginUrl(params?: { redirectPath?: string }): string {
  // Use the config function which ensures localhost callback URLs
  const redirectUri = getFrontendCallbackUrl();
  return buildGoogleOAuthLoginUrl(redirectUri);
}

/**
 * Handle Google callback query params on the frontend.
 * Expects backend to have redirected like:
 *   FRONTEND_URL + redirect_path?token=...&user=...&email=...&success=true
 * 
 * After storing the access token, immediately checks for Facebook token
 * and returns the appropriate redirect path.
 */
export async function handleGoogleCallbackFromSearch(search: string): Promise<{ response: GoogleAuthResponse; redirectPath: string } | null> {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(search);
  const token = params.get('token');
  const email = params.get('email');
  const username = params.get('user');
  const success = params.get('success');

  if (!token || success !== 'true' || !email || !username) {
    return null;
  }

  const user = {
    id: '', // backend does not send ID in query; main identity is email
    email,
    username,
    full_name: null,
    profile_picture: null,
  };

  // Store the access token immediately
  setAccessToken(token);
  setUserInfo(user);

  const response: GoogleAuthResponse = {
    access_token: token,
    token_type: 'bearer',
    user,
  };

  // Immediately check for Facebook token after storing access token
  try {
    const fbTokenRes = await fetchFacebookToken();
    // Check if we have a valid Facebook token
    // The response structure: { success: boolean, data: { access_token?: string, ... } }
    const hasFacebookToken = 
      fbTokenRes.success && 
      fbTokenRes.data && 
      fbTokenRes.data.access_token && 
      fbTokenRes.data.access_token.length > 0;
    
    // Return response with appropriate redirect path
    // Ensure we never redirect to /dashboard - always use /profile
    const redirectPath = hasFacebookToken ? '/profile' : '/facebook-connect';
    return {
      response,
      redirectPath,
    };
  } catch (err) {
    // If check fails, assume no token and redirect to connect page
    console.warn('Facebook token check failed, redirecting to connect page:', err);
    return {
      response,
      redirectPath: '/facebook-connect',
    };
  }
}

