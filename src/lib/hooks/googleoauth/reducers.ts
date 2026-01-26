import type { GoogleOAuthState } from './types';

export const initialGoogleOAuthState: GoogleOAuthState = {
  loading: false,
  error: null,
};

type GoogleOAuthAction =
  | { type: 'GOOGLE_OAUTH_START' }
  | { type: 'GOOGLE_OAUTH_SUCCESS' }
  | { type: 'GOOGLE_OAUTH_ERROR'; payload: string };

export function googleOAuthReducer(
  state: GoogleOAuthState,
  action: GoogleOAuthAction,
): GoogleOAuthState {
  switch (action.type) {
    case 'GOOGLE_OAUTH_START':
      return { ...state, loading: true, error: null };
    case 'GOOGLE_OAUTH_SUCCESS':
      return { ...state, loading: false, error: null };
    case 'GOOGLE_OAUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

