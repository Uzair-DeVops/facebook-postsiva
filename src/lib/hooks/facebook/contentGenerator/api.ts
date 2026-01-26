import { apiFetch } from '../../../apiClient';

export interface ContentGenerationRequest {
  post_idea: string;
  user_requirements?: string;
}

export interface ContentGenerationResponse {
  content: string;
  image_url: string;
  media_id: string;
}

export interface EnhanceContentRequest {
  content?: string;
  user_requirements?: string;
  previous_output?: string;
}

export interface EnhanceContentResponse {
  page_id: string;
  content: string;
}

export interface ContentToImageRequest {
  content: string;
  user_requirements?: string;
}

export interface ContentToImageResponse {
  image_url: string;
  media_id: string;
}

export interface EditImageRequest {
  previous_image_url: string;
  user_requirements: string;
  reference_content?: string;
}

export interface ImageToContentRequest {
  image_url: string;
  post_content?: string;
  user_requirements?: string;
}

export interface VideoToContentRequest {
  video_url: string;
  post_content?: string;
  user_requirements?: string;
}

export interface MediaToContentResponse {
  success: boolean;
  message: string;
  data?: {
    page_id: string;
    content: string;
  };
  error?: string;
}

/**
 * Generate content from post idea (includes content + image)
 */
export async function generateContentFromIdea(
  pageId: string,
  payload: ContentGenerationRequest,
): Promise<ContentGenerationResponse> {
  const result = await apiFetch<ContentGenerationResponse>(
    `/facebook/content-generator/idea-to-post/${pageId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    { withAuth: true },
  );

  return result;
}

/**
 * Enhance existing content (content only, no image)
 */
export async function enhanceContent(
  pageId: string,
  payload: EnhanceContentRequest,
): Promise<EnhanceContentResponse> {
  const result = await apiFetch<EnhanceContentResponse>(
    `/facebook/content-generator/enhance-content/${pageId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    { withAuth: true },
  );

  return result;
}

/**
 * Generate image for existing content
 */
export async function generateImageForContent(
  pageId: string,
  payload: ContentToImageRequest,
): Promise<ContentToImageResponse> {
  const result = await apiFetch<ContentToImageResponse>(
    `/facebook/content-generator/content-to-image/${pageId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    { withAuth: true },
  );

  return result;
}

/**
 * Edit existing image based on requirements
 */
export async function editImage(
  pageId: string,
  payload: EditImageRequest,
): Promise<ContentToImageResponse> {
  const result = await apiFetch<ContentToImageResponse>(
    `/facebook/content-generator/edit-image/${pageId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    { withAuth: true },
  );

  return result;
}

/**
 * Generate content from image
 */
export async function generateContentFromImage(
  pageId: string,
  payload: ImageToContentRequest,
): Promise<MediaToContentResponse> {
  const result = await apiFetch<MediaToContentResponse>(
    `/facebook/content-generator/image-to-content/${pageId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    { withAuth: true },
  );

  return result;
}

/**
 * Generate content from video
 */
export async function generateContentFromVideo(
  pageId: string,
  payload: VideoToContentRequest,
): Promise<MediaToContentResponse> {
  const result = await apiFetch<MediaToContentResponse>(
    `/facebook/content-generator/video-to-content/${pageId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    { withAuth: true },
  );

  return result;
}
