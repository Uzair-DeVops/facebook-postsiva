'use client';

import { useCallback, useEffect, useReducer } from 'react';
import {
  facebookUserProfileReducer,
  initialFacebookUserProfileState,
} from './reducers';
import { fetchFacebookUserProfile } from './api';

export function useFacebookUserProfile({ autoLoad = true } = {}) {
  const [state, dispatch] = useReducer(
    facebookUserProfileReducer,
    initialFacebookUserProfileState,
  );

  const loadProfile = useCallback(
    async ({ refresh }: { refresh?: boolean } = {}) => {
      dispatch({ type: 'FB_PROFILE_START' });
      try {
        const res = await fetchFacebookUserProfile(refresh);
        if (!res.success) {
          throw new Error(res.error || res.message || 'Failed to load Facebook profile');
        }
        dispatch({ type: 'FB_PROFILE_SUCCESS', payload: res.profile });
        return res;
      } catch (err: any) {
        dispatch({
          type: 'FB_PROFILE_ERROR',
          payload: err.message ?? 'Failed to load Facebook profile',
        });
        throw err;
      }
    },
    [],
  );

  useEffect(() => {
    if (!autoLoad) return;
    loadProfile().catch(() => undefined);
  }, [autoLoad, loadProfile]);

  return {
    ...state,
    loadProfile,
  };
}

