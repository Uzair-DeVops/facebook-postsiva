import type { AuthAction, AuthState } from './types';

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...initialAuthState };
    default:
      return state;
  }
}

