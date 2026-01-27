import { clearCachedByPrefix, clearCachedValue } from './cache';
import { STORAGE_KEYS } from './config';
import { AUTH_USER_CACHE_KEY } from './hooks/auth/api';

/**
 * clearSessionData
 * 
 * Clears all user-specific data from localStorage and memory cache.
 * This ensures that when a user logs out, no stale data remains for the next user.
 */
export function clearSessionData() {
    if (typeof window === 'undefined') return;

    // 1. Clear core session keys
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.removeItem('postsiva_subscription');
    localStorage.removeItem('postsiva_selected_page');

    // 2. Clear known cache keys
    clearCachedValue(AUTH_USER_CACHE_KEY);

    // 3. Clear all cache prefixes used in the app
    // These cover API responses for posts, usage, orders, etc.
    const prefixesToClear = [
        'facebook_',          // facebook_posts:v1:, facebook_token:v1, facebook_user_profile:v1
        'usage:v1:',          // usage:v1:facebook, etc.
        'platform_tiers:v1:', // platform_tiers:v1:facebook
        'my_orders:v1:',      // my_orders:v1:all
        'dashboard_',         // dashboard_overview:v1, dashboard_videos:v1
        'credits_check:v1:',  // credits_check:v1:facebook:post_scheduling
        'postsiva_'           // Catch-all for any other postsiva_ prefixed keys
    ];

    prefixesToClear.forEach(prefix => {
        clearCachedByPrefix(prefix);
    });
}
