import { apiFetch } from '../../../apiClient';
import { clearCachedValue, getCachedValue, setCachedValue } from '../../../cache';
import { buildApiUrl, API_ENDPOINTS } from '../../../config';
import type {
  AIAgentPersonaResponse,
  AIAgentPersonaUpdateRequest,
  AIAgentPersonaPatchRequest,
  AIAgentPersonaRegenerateRequest,
} from './types';

// Long-lived cache; use forceRefresh to pull fresh after edits
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year
const cacheKey = (pageId: string) => `ai_agent_persona:v1:${pageId}`;

export async function buildAIAgentPersona(
  pageId: string,
  userRequirements?: string | null,
): Promise<AIAgentPersonaResponse> {
  const url = buildApiUrl(API_ENDPOINTS.FACEBOOK.AI_AGENT_PERSONA.BUILD);
  const queryParams = new URLSearchParams({
    page_id: pageId,
  });
  
  // User enters a string in the textarea, we convert it to the format backend expects
  // Backend route uses: user_requirements: Optional[str] = Body(None, ...)
  // FastAPI Body(None, ...) for a single parameter expects the body to be the value directly
  // So we send the string value itself as JSON string, or null if empty
  const trimmedRequirements = userRequirements?.trim();
  
  // Prepare request options
  const requestOptions: RequestInit = {
    method: 'POST',
  };
  
  // If requirements provided, send as JSON string (the body IS the string value)
  // If empty, send null (backend will receive None)
  if (trimmedRequirements) {
    requestOptions.body = JSON.stringify(trimmedRequirements);
  } else {
    requestOptions.body = null;
  }
  
  const data = await apiFetch<AIAgentPersonaResponse>(
    `${url}?${queryParams.toString()}`,
    requestOptions,
    { withAuth: true },
  );

  return data;
}

export async function getAIAgentPersona(
  pageId: string,
  options?: { forceRefresh?: boolean },
): Promise<AIAgentPersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.AI_AGENT_PERSONA.GET}/${pageId}`);

  if (!options?.forceRefresh) {
    const cached = getCachedValue<AIAgentPersonaResponse>(cacheKey(pageId));
    if (cached) return cached;
  }
  
  const data = await apiFetch<AIAgentPersonaResponse>(
    url,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  setCachedValue(cacheKey(pageId), data, CACHE_TTL_MS);

  return data;
}

export async function updateAIAgentPersona(
  pageId: string,
  request: AIAgentPersonaUpdateRequest,
): Promise<AIAgentPersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.AI_AGENT_PERSONA.UPDATE}/${pageId}`);
  
  const data = await apiFetch<AIAgentPersonaResponse>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    },
    { withAuth: true },
  );

  clearCachedValue(cacheKey(pageId));

  return data;
}

export async function patchAIAgentPersona(
  pageId: string,
  request: AIAgentPersonaPatchRequest,
): Promise<AIAgentPersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.AI_AGENT_PERSONA.PATCH}/${pageId}`);
  
  const data = await apiFetch<AIAgentPersonaResponse>(
    url,
    {
      method: 'PATCH',
      body: JSON.stringify(request),
    },
    { withAuth: true },
  );

  clearCachedValue(cacheKey(pageId));

  return data;
}

export async function deleteAIAgentPersona(
  pageId: string,
): Promise<AIAgentPersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.AI_AGENT_PERSONA.DELETE}/${pageId}`);
  
  const data = await apiFetch<AIAgentPersonaResponse>(
    url,
    {
      method: 'DELETE',
    },
    { withAuth: true },
  );

  clearCachedValue(cacheKey(pageId));

  return data;
}

export async function regenerateAIAgentPersona(
  pageId: string,
  request: AIAgentPersonaRegenerateRequest,
): Promise<AIAgentPersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.AI_AGENT_PERSONA.REGENERATE}/${pageId}/regenerate`);
  
  const data = await apiFetch<AIAgentPersonaResponse>(
    url,
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    { withAuth: true },
  );

  clearCachedValue(cacheKey(pageId));

  return data;
}
