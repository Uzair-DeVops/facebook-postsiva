import { apiFetch } from '../../apiClient';
import { clearCachedByPrefix, setCachedValue, getCachedValue } from '../../cache';
import type { FacebookPagesResponse } from './types';

const LONG_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year

interface CreateTokenResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    user_id: string;
    auth_url: string;
    instructions: string;
  };
}

export async function createFacebookAuthUrl(): Promise<string> {
  const data = await apiFetch<CreateTokenResponse>(
    '/facebook/create-token',
    {
      method: 'POST',
    },
    { withAuth: true },
  );

  if (!data.success || !data.data?.auth_url) {
    throw new Error(data.message || 'Failed to create Facebook auth URL');
  }

  return data.data.auth_url;
}

export async function fetchFacebookPages(options?: { forceRefresh?: boolean }): Promise<FacebookPagesResponse> {
  const cacheKey = 'facebook_pages:v1';

  if (!options?.forceRefresh) {
    const cached = getCachedValue<FacebookPagesResponse>(cacheKey);
    if (cached) return cached;
  }

  const response = await apiFetch<any>(
    '/facebook/pages',
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  console.log("Raw API response:", response); // Debug log

  // Backend structure: { success, message, data: { success, message, user_id, pages: [...], count } }
  if (response.data) {
    const data = response.data;
    let pagesArray: any[] = [];
    
    // Extract pages array from data.pages
    if (data.pages !== undefined) {
      if (Array.isArray(data.pages)) {
        pagesArray = data.pages;
      } else if (data.pages !== null) {
        // If it's a single page object, wrap it in an array
        pagesArray = [data.pages];
      }
    }
    
    const normalizedResponse: FacebookPagesResponse = {
      success: response.success && data.success !== false,
      message: response.message || data.message || "",
      data: data,
      // Expose pages at root level for easier access
      pages: pagesArray,
      count: data.count || pagesArray.length,
      user_id: data.user_id,
    };
    
    console.log("Normalized response:", normalizedResponse); // Debug log
    console.log("Pages array length:", pagesArray.length); // Debug log

    setCachedValue(cacheKey, normalizedResponse, LONG_CACHE_TTL_MS);
    return normalizedResponse;
  }

  // Fallback: If data is not present, check for pages at root level (legacy)
  if (response.pages !== undefined) {
    const pagesArray = Array.isArray(response.pages) ? response.pages : (response.pages ? [response.pages] : []);
    const legacyResponse: FacebookPagesResponse = {
      success: response.success || false,
      message: response.message || "",
      pages: pagesArray,
      count: response.count || pagesArray.length,
      user_id: response.user_id,
    };

    setCachedValue(cacheKey, legacyResponse, LONG_CACHE_TTL_MS);
    return legacyResponse;
  }

  // If no pages found
  console.warn("No pages found in response");
  const emptyResponse: FacebookPagesResponse = {
    success: response.success || false,
    message: response.message || "No pages found",
    pages: [],
    count: 0,
  };

  setCachedValue(cacheKey, emptyResponse, LONG_CACHE_TTL_MS);
  return emptyResponse;
}

export async function disconnectFacebook(): Promise<void> {
  await apiFetch(
    '/facebook/delete-token',
    {
      method: 'DELETE',
    },
    { withAuth: true },
  );

  clearCachedByPrefix('facebook_pages:v1');
}

