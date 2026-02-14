import { useState, useCallback } from 'react';
import {
  generateContentFromIdea,
  enhanceContent,
  generateImageForContent,
  editImage,
  generateContentFromImage,
  generateContentFromVideo,
  type ContentGenerationRequest,
  type ContentGenerationResponse,
  type EnhanceContentRequest,
  type EnhanceContentResponse,
  type ContentToImageRequest,
  type ContentToImageResponse,
  type EditImageRequest,
  type ImageToContentRequest,
  type VideoToContentRequest,
  type MediaToContentResponse,
} from './api';

export interface UseContentGeneratorOptions {
  pageId: string;
  onSuccess?: (result: ContentGenerationResponse | EnhanceContentResponse | ContentToImageResponse | MediaToContentResponse) => void;
  onError?: (error: Error) => void;
}

export interface ContentGeneratorState {
  loading: boolean;
  error: string | null;
  lastGeneratedContent: string | null;
  lastGeneratedImage: {
    image_url: string;
    media_id: string;
  } | null;
  lastEditedImage: {
    old_image_url: string;
    new_image_url: string;
    new_media_id: string;
  } | null;
}

/**
 * Custom hook for Facebook content generation with three use cases:
 * 
 * 1. Generate whole post with image (from idea)
 * 2. Generate/regenerate post content only (with or without previous content)
 * 3. Enhance existing content
 */
export function useContentGenerator({ pageId, onSuccess, onError }: UseContentGeneratorOptions) {
  const [state, setState] = useState<ContentGeneratorState>({
    loading: false,
    error: null,
    lastGeneratedContent: null,
    lastGeneratedImage: null,
    lastEditedImage: null,
  });

  /**
   * Use Case 1: Generate whole post with image from idea
   * This generates both content and image
   */
  const generatePostWithImage = useCallback(
    async (postIdea: string, additionalRequirements?: string) => {
      if (!pageId) {
        const error = new Error('Please select a Facebook page first');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      if (!postIdea.trim()) {
        const error = new Error('Please enter a post idea');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await generateContentFromIdea(pageId, {
          post_idea: postIdea.trim(),
          user_requirements: additionalRequirements?.trim() || undefined,
        });

        setState((prev) => ({
          ...prev,
          loading: false,
          lastGeneratedContent: result.content,
          lastGeneratedImage: result.image_url && result.media_id
            ? { image_url: result.image_url, media_id: result.media_id }
            : null,
        }));

        onSuccess?.(result);
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err.message || 'Failed to generate content');
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        onError?.(error);
        throw error;
      }
    },
    [pageId, onSuccess, onError]
  );

  /**
   * Use Case 2: Generate content only (no image) – enhance content from idea or from current text.
   * Sends content in body (backend does not use previous_output).
   * - When previousContent provided: enhances that content (content + user_requirements).
   * - When only postIdea: sends postIdea as content to expand (content + user_requirements).
   */
  const generateContentOnly = useCallback(
    async (postIdea: string, requirements?: string, previousContent?: string) => {
      if (!pageId) {
        const error = new Error('Please select a Facebook page first');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      const contentToSend = (previousContent?.trim() || postIdea?.trim() || '').trim();
      if (!contentToSend) {
        const error = new Error('Please enter a post idea or provide content to enhance');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await enhanceContent(pageId, {
          content: contentToSend,
          user_requirements: requirements?.trim() || undefined,
        });

        setState((prev) => ({
          ...prev,
          loading: false,
          lastGeneratedContent: result.content,
        }));

        onSuccess?.(result);
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err.message || 'Failed to generate content');
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        onError?.(error);
        throw error;
      }
    },
    [pageId, onSuccess, onError]
  );

  /**
   * Regenerate from last saved draft (backend loads previous content from DB).
   * Send only optional user_requirements; no content in body.
   */
  const regenerateFromDraft = useCallback(
    async (requirements?: string) => {
      if (!pageId) {
        const error = new Error('Please select a Facebook page first');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await enhanceContent(
          pageId,
          { user_requirements: requirements?.trim() || undefined },
          { regenerate: true }
        );

        setState((prev) => ({
          ...prev,
          loading: false,
          lastGeneratedContent: result.content,
        }));

        onSuccess?.(result);
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err.message || 'Failed to regenerate from draft');
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        onError?.(error);
        throw error;
      }
    },
    [pageId, onSuccess, onError]
  );

  /**
   * Use Case 3: Enhance existing content
   * Takes existing content and improves it based on requirements
   */
  const enhanceExistingContent = useCallback(
    async (currentContent: string, requirements?: string) => {
      if (!pageId) {
        const error = new Error('Please select a Facebook page first');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      if (!currentContent.trim()) {
        const error = new Error('Please provide content to enhance');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await enhanceContent(pageId, {
          content: currentContent.trim(),
          user_requirements: requirements?.trim() || undefined,
        });

        setState((prev) => ({
          ...prev,
          loading: false,
          lastGeneratedContent: result.content,
        }));

        onSuccess?.(result);
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err.message || 'Failed to enhance content');
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        onError?.(error);
        throw error;
      }
    },
    [pageId, onSuccess, onError]
  );

  /**
   * Use Case 4: Generate image from content
   * User can use existing content or provide their own requirements
   */
  const generateImageFromContent = useCallback(
    async (content: string, requirements?: string) => {
      if (!pageId) {
        const error = new Error('Please select a Facebook page first');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      if (!content.trim()) {
        const error = new Error('Please provide content to generate image from');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await generateImageForContent(pageId, {
          content: content.trim(),
          user_requirements: requirements?.trim() || undefined,
        });

        setState((prev) => ({
          ...prev,
          loading: false,
          lastGeneratedImage: result.image_url && result.media_id
            ? { image_url: result.image_url, media_id: result.media_id }
            : null,
        }));

        onSuccess?.(result);
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err.message || 'Failed to generate image');
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        onError?.(error);
        throw error;
      }
    },
    [pageId, onSuccess, onError]
  );

  /**
   * Use Case 5: Edit existing image
   * Regenerates image based on previous image and requirements
   * Returns both old and new image for user to choose
   */
  const editExistingImage = useCallback(
    async (previousImageUrl: string, requirements: string, referenceContent?: string) => {
      if (!pageId) {
        const error = new Error('Please select a Facebook page first');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      if (!previousImageUrl.trim()) {
        const error = new Error('Previous image URL is required');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      if (!requirements.trim()) {
        const error = new Error('Please provide requirements for image editing');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await editImage(pageId, {
          previous_image_url: previousImageUrl.trim(),
          user_requirements: requirements.trim(),
          reference_content: referenceContent?.trim() || undefined,
        });

        setState((prev) => ({
          ...prev,
          loading: false,
          lastEditedImage: result.image_url && result.media_id
            ? {
                old_image_url: previousImageUrl,
                new_image_url: result.image_url,
                new_media_id: result.media_id,
              }
            : null,
        }));

        onSuccess?.(result);
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err.message || 'Failed to edit image');
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        onError?.(error);
        throw error;
      }
    },
    [pageId, onSuccess, onError]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Use Case 6: Generate content from image
   * Takes an image URL and generates content based on it
   */
  const generateContentFromImageUrl = useCallback(
    async (imageUrl: string, postContent?: string, requirements?: string) => {
      if (!pageId) {
        const error = new Error('Please select a Facebook page first');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      if (!imageUrl.trim()) {
        const error = new Error('Image URL is required');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await generateContentFromImage(pageId, {
          image_url: imageUrl.trim(),
          post_content: postContent?.trim() || undefined,
          user_requirements: requirements?.trim() || undefined,
        });

        if (!result.success || !result.data) {
          throw new Error(result.message || result.error || 'Failed to generate content from image');
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          lastGeneratedContent: result.data?.content || null,
        }));

        onSuccess?.(result);
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err.message || 'Failed to generate content from image');
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        onError?.(error);
        throw error;
      }
    },
    [pageId, onSuccess, onError]
  );

  /**
   * Use Case 7: Generate content from video
   * Takes a video URL and generates content based on it
   */
  const generateContentFromVideoUrl = useCallback(
    async (videoUrl: string, postContent?: string, requirements?: string) => {
      if (!pageId) {
        const error = new Error('Please select a Facebook page first');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      if (!videoUrl.trim()) {
        const error = new Error('Video URL is required');
        setState((prev) => ({ ...prev, error: error.message }));
        onError?.(error);
        throw error;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await generateContentFromVideo(pageId, {
          video_url: videoUrl.trim(),
          post_content: postContent?.trim() || undefined,
          user_requirements: requirements?.trim() || undefined,
        });

        if (!result.success || !result.data) {
          throw new Error(result.message || result.error || 'Failed to generate content from video');
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          lastGeneratedContent: result.data?.content || null,
        }));

        onSuccess?.(result);
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err.message || 'Failed to generate content from video');
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        onError?.(error);
        throw error;
      }
    },
    [pageId, onSuccess, onError]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      lastGeneratedContent: null,
      lastGeneratedImage: null,
      lastEditedImage: null,
    });
  }, []);

  return {
    // State
    loading: state.loading,
    error: state.error,
    lastGeneratedContent: state.lastGeneratedContent,
    lastGeneratedImage: state.lastGeneratedImage,
    lastEditedImage: state.lastEditedImage,

    // Actions
    generatePostWithImage,
    generateContentOnly,
    regenerateFromDraft,
    enhanceExistingContent,
    generateImageFromContent,
    editExistingImage,
    generateContentFromImageUrl,
    generateContentFromVideoUrl,
    clearError,
    reset,
  };
}
