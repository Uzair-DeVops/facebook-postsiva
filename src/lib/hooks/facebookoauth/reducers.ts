import type { FacebookOAuthState } from './types';

export const initialFacebookOAuthState: FacebookOAuthState = {
  loading: false,
  error: null,
  connected: false,
  isPopupOpen: false,
};

type FacebookOAuthAction =
  | { type: 'FACEBOOK_OAUTH_START' }
  | { type: 'FACEBOOK_OAUTH_SUCCESS' }
  | { type: 'FACEBOOK_OAUTH_ERROR'; payload: string }
  | { type: 'FACEBOOK_OAUTH_DISCONNECT' }
  | { type: 'FACEBOOK_OAUTH_POPUP_OPEN' }
  | { type: 'FACEBOOK_OAUTH_POPUP_CLOSE' };

export function facebookOAuthReducer(
  state: FacebookOAuthState,
  action: FacebookOAuthAction,
): FacebookOAuthState {
  switch (action.type) {
    case 'FACEBOOK_OAUTH_START':
      return { ...state, loading: true, error: null };
    case 'FACEBOOK_OAUTH_SUCCESS':
      return { ...state, loading: false, error: null, connected: true };
    case 'FACEBOOK_OAUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'FACEBOOK_OAUTH_DISCONNECT':
      return { ...initialFacebookOAuthState, connected: false };
    default:
      return state;
  }
}

