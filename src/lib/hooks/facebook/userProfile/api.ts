import { apiFetch } from '../../../apiClient';
import type { FacebookUserProfileResponse } from './types';

export async function fetchFacebookUserProfile(
  refresh?: boolean,
): Promise<FacebookUserProfileResponse> {
  const query = `?refresh=${refresh === true ? 'true' : 'false'}`;
  const data = await apiFetch<FacebookUserProfileResponse>(
    `/facebook/user-profile/${query}`,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  return data;
}

