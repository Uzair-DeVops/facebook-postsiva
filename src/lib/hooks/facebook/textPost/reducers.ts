import type { FacebookTextPost, FacebookTextPostState } from './types';

export const initialFacebookTextPostState: FacebookTextPostState = {
  loading: false,
  error: null,
  lastPost: null,
};

type FacebookTextPostAction =
  | { type: 'TEXT_POST_START' }
  | { type: 'TEXT_POST_SUCCESS'; payload: FacebookTextPost | null }
  | { type: 'TEXT_POST_ERROR'; payload: string };

export function facebookTextPostReducer(
  state: FacebookTextPostState,
  action: FacebookTextPostAction,
): FacebookTextPostState {
  switch (action.type) {
    case 'TEXT_POST_START':
      return { ...state, loading: true, error: null };
    case 'TEXT_POST_SUCCESS':
      return { ...state, loading: false, error: null, lastPost: action.payload };
    case 'TEXT_POST_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

