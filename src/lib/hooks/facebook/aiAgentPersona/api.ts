import { apiFetch } from '../../../apiClient';
import { buildApiUrl, API_ENDPOINTS } from '../../../config';
import type {
  AIAgentPersonaResponse,
  AIAgentPersonaUpdateRequest,
  AIAgentPersonaPatchRequest,
  AIAgentPersonaRegenerateRequest,
} from './types';

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
): Promise<AIAgentPersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.AI_AGENT_PERSONA.GET}/${pageId}`);
  
  const data = await apiFetch<AIAgentPersonaResponse>(
    url,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

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

  return data;
}
