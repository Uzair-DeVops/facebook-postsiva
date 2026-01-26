import { apiFetch } from '../../../apiClient';
import { buildApiUrl, API_ENDPOINTS } from '../../../config';
import type {
  PersonaResponse,
  PersonaUpdateRequest,
  PersonaPatchRequest,
  PersonaRegenerateRequest,
} from './types';

export async function buildPersona(
  pageId: string,
  postsLimit: number = 30,
): Promise<PersonaResponse> {
  const url = buildApiUrl(API_ENDPOINTS.FACEBOOK.PERSONA.BUILD);
  const queryParams = new URLSearchParams({
    page_id: pageId,
    posts_limit: postsLimit.toString(),
  });
  
  const data = await apiFetch<PersonaResponse>(
    `${url}?${queryParams.toString()}`,
    {
      method: 'POST',
    },
    { withAuth: true },
  );

  return data;
}

export async function getPersona(
  pageId: string,
  forceRefresh: boolean = false,
): Promise<PersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.PERSONA.GET}/${pageId}`);
  const queryParams = new URLSearchParams({
    force_refresh: forceRefresh.toString(),
  });
  
  const data = await apiFetch<PersonaResponse>(
    `${url}?${queryParams.toString()}`,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  return data;
}

export async function updatePersona(
  pageId: string,
  request: PersonaUpdateRequest,
): Promise<PersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.PERSONA.UPDATE}/${pageId}`);
  
  const data = await apiFetch<PersonaResponse>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    },
    { withAuth: true },
  );

  return data;
}

export async function patchPersona(
  pageId: string,
  request: PersonaPatchRequest,
): Promise<PersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.PERSONA.PATCH}/${pageId}`);
  
  const data = await apiFetch<PersonaResponse>(
    url,
    {
      method: 'PATCH',
      body: JSON.stringify(request),
    },
    { withAuth: true },
  );

  return data;
}

export async function deletePersona(
  pageId: string,
): Promise<PersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.PERSONA.DELETE}/${pageId}`);
  
  const data = await apiFetch<PersonaResponse>(
    url,
    {
      method: 'DELETE',
    },
    { withAuth: true },
  );

  return data;
}

export async function regeneratePersona(
  pageId: string,
  request: PersonaRegenerateRequest,
  postsLimit: number = 30,
): Promise<PersonaResponse> {
  const url = buildApiUrl(`${API_ENDPOINTS.FACEBOOK.PERSONA.REGENERATE}/${pageId}/regenerate`);
  const queryParams = new URLSearchParams({
    posts_limit: postsLimit.toString(),
  });
  
  const data = await apiFetch<PersonaResponse>(
    `${url}?${queryParams.toString()}`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    { withAuth: true },
  );

  return data;
}
