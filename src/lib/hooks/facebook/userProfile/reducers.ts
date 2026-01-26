import type { FacebookUserProfile, FacebookUserProfileState } from './types';

export const initialFacebookUserProfileState: FacebookUserProfileState = {
  loading: false,
  error: null,
  profile: null,
};

type FacebookUserProfileAction =
  | { type: 'FB_PROFILE_START' }
  | { type: 'FB_PROFILE_SUCCESS'; payload: FacebookUserProfile | null }
  | { type: 'FB_PROFILE_ERROR'; payload: string };

export function facebookUserProfileReducer(
  state: FacebookUserProfileState,
  action: FacebookUserProfileAction,
): FacebookUserProfileState {
  switch (action.type) {
    case 'FB_PROFILE_START':
      return { ...state, loading: true, error: null };
    case 'FB_PROFILE_SUCCESS':
      return { ...state, loading: false, error: null, profile: action.payload };
    case 'FB_PROFILE_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

