import { apiFetch } from '../../apiClient';
import { clearCachedByPrefix, getCachedValue, setCachedValue } from '../../cache';

export interface MediaUploadResponse {
  success: boolean;
  message: string;
  media_id?: string;
  public_url?: string;
  filename?: string;
  file_size?: number;
  media_type?: string;
  platform?: string;
  error?: string;
}

export interface BulkMediaUploadResponse {
  success: boolean;
  message: string;
  uploaded_count: number;
  failed_count: number;
  media_ids: string[];
  results: Array<{
    success: boolean;
    media_id?: string;
    public_url?: string;
    filename?: string;
    error?: string;
  }>;
  errors?: string[];
}

export interface MediaItem {
  media_id: string;
  media_type: string;
  platform: string | null;
  public_url: string;
  filename: string;
  file_size: number;
  status: string;
  uploaded_at: string;
  expires_at: string | null;
}

export interface MediaListResponse {
  success: boolean;
  media: MediaItem[];
  total: number;
  limit: number;
  offset: number;
  count: number;
}

export interface UploadMediaParams {
  media?: File;
  media_url?: string;
  images?: File[];
  image_urls?: string;
  media_type: 'image' | 'video' | 'images';
  platform?: string;
}

const LIST_CACHE_TTL_MS = 60 * 1000; // 1 minute
const listCacheKey = (params?: {
  media_type?: 'image' | 'video';
  platform?: string;
  limit?: number;
  offset?: number;
}) =>
  `media_list:v1:${params?.media_type || 'all'}:${params?.platform || 'all'}:${
    params?.limit || 'default'
  }:${params?.offset || 0}`;

export async function uploadMedia(params: UploadMediaParams): Promise<MediaUploadResponse | BulkMediaUploadResponse> {
  const formData = new FormData();
  
  if (params.media_type === 'images') {
    // Multiple images upload
    if (params.images && params.images.length > 0) {
      params.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    if (params.image_urls) {
      formData.append('image_urls', params.image_urls);
    }
    formData.append('media_type', 'images');
  } else {
    // Single image or video upload
    if (params.media) {
      formData.append('media', params.media);
    }
    if (params.media_url) {
      formData.append('media_url', params.media_url);
    }
    formData.append('media_type', params.media_type);
  }
  
  if (params.platform) {
    formData.append('platform', params.platform);
  }

  const result = await apiFetch<MediaUploadResponse | BulkMediaUploadResponse>(
    '/media/upload',
    {
      method: 'POST',
      body: formData,
      headers: {},
    },
    { withAuth: true },
  );

  clearCachedByPrefix('media_list:v1');

  return result;
}

export async function listMedia(params?: {
  media_type?: 'image' | 'video';
  platform?: string;
  limit?: number;
  offset?: number;
  forceRefresh?: boolean;
}): Promise<MediaListResponse> {
  const cacheKey = listCacheKey(params);

  if (!params?.forceRefresh) {
    const cached = getCachedValue<MediaListResponse>(cacheKey);
    if (cached) return cached;
  }

  const queryParams = new URLSearchParams();
  
  if (params?.media_type) {
    queryParams.append('media_type', params.media_type);
  }
  if (params?.platform) {
    queryParams.append('platform', params.platform);
  }
  if (params?.limit) {
    queryParams.append('limit', String(params.limit));
  }
  if (params?.offset) {
    queryParams.append('offset', String(params.offset));
  }

  const query = queryParams.toString();
  const path = query ? `/media/?${query}` : '/media/';

  const result = await apiFetch<MediaListResponse>(
    path,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  setCachedValue(cacheKey, result, LIST_CACHE_TTL_MS);

  return result;
}

export async function getMedia(mediaId: string): Promise<MediaUploadResponse> {
  const result = await apiFetch<MediaUploadResponse>(
    `/media/${mediaId}`,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  return result;
}

export async function deleteMedia(mediaId: string): Promise<{ success: boolean; message: string }> {
  const result = await apiFetch<{ success: boolean; message: string }>(
    `/media/${mediaId}`,
    {
      method: 'DELETE',
    },
    { withAuth: true },
  );

  clearCachedByPrefix('media_list:v1');

  return result;
}
