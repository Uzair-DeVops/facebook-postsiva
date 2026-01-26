import type { ScheduledPost, ScheduledPostsState } from './types';

export const initialScheduledPostsState: ScheduledPostsState = {
  loading: false,
  error: null,
  scheduledPosts: [],
  total: 0,
  platform: null,
};

type ScheduledPostsAction =
  | { type: 'SCHEDULED_POSTS_START' }
  | { type: 'SCHEDULED_POSTS_SUCCESS'; payload: { posts: ScheduledPost[]; total: number; platform: string | null } }
  | { type: 'SCHEDULED_POSTS_ERROR'; payload: string }
  | { type: 'SCHEDULED_POSTS_RESET' };

export function scheduledPostsReducer(
  state: ScheduledPostsState,
  action: ScheduledPostsAction,
): ScheduledPostsState {
  switch (action.type) {
    case 'SCHEDULED_POSTS_START':
      return { ...state, loading: true, error: null };
    case 'SCHEDULED_POSTS_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        scheduledPosts: action.payload.posts,
        total: action.payload.total,
        platform: action.payload.platform,
      };
    case 'SCHEDULED_POSTS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SCHEDULED_POSTS_RESET':
      return initialScheduledPostsState;
    default:
      return state;
  }
}
