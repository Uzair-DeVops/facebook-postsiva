import { apiFetch } from '../../apiClient';

export interface UserPhoneResponse {
  success: boolean;
  message?: string;
  data?: {
    user_id: string;
    phone_number: string;
    created_at?: string;
    updated_at?: string;
  };
  error?: string;
}

export async function getUserPhone(): Promise<UserPhoneResponse> {
  return apiFetch<UserPhoneResponse>(
    '/user/phone/me',
    { method: 'GET' },
    { withAuth: true },
  );
}

export async function setUserPhone(phoneNumber: string): Promise<UserPhoneResponse> {
  return apiFetch<UserPhoneResponse>(
    '/user/phone/me',
    {
      method: 'PUT',
      body: JSON.stringify({ phone_number: phoneNumber }),
    },
    { withAuth: true },
  );
}

export async function deleteUserPhone(): Promise<UserPhoneResponse> {
  return apiFetch<UserPhoneResponse>(
    '/user/phone/me',
    { method: 'DELETE' },
    { withAuth: true },
  );
}
