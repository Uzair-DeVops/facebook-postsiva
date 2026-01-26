'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginRequest, fetchCurrentUser } from './api';
import { fetchFacebookToken } from '../facebook/token/api';
import type { AuthUser, LoginPayload } from './types';
import { API_ENDPOINTS, buildApiUrl, STORAGE_KEYS } from '../../config';
import { getUserUsage } from '../tier/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  hasFacebookToken: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  checkFacebookToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFacebookToken, setHasFacebookToken] = useState(false);

  // Hydrate session from localStorage on mount (runs once)
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        if (!accessToken) {
          setIsHydrated(true);
          return;
        }

        // Verify token is still valid by fetching user
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);

        // Check if Facebook token exists
        const hasFbToken = await checkFacebookTokenStatus();
        setHasFacebookToken(hasFbToken);

        // Silently check subscription status
        try {
          const usageResponse = await getUserUsage('facebook');
          if (usageResponse.success && usageResponse.usage) {
            const usage = usageResponse.usage;
            const isPaid = usage.current_tier_name !== 'free';
            const subscriptionInfo = {
              platform: 'facebook',
              tier_name: usage.current_tier_name,
              is_paid: isPaid,
              is_unlimited: usage.is_unlimited,
              credits_expire_at: usage.credits_expire_at,
              is_expired: usage.is_expired,
              usage,
            };
            localStorage.setItem('postsiva_subscription', JSON.stringify(subscriptionInfo));
          }
        } catch (err) {
          // Silently fail - subscription check is not critical for login
          console.debug('Subscription check failed:', err);
        }
      } catch (err) {
        // Token invalid or expired, clear session
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        setUser(null);
        setHasFacebookToken(false);
      } finally {
        setIsHydrated(true);
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []); // Run only once on mount

  const checkFacebookTokenStatus = useCallback(async (): Promise<boolean> => {
    try {
      // Use cached API call instead of direct fetch - will return from localStorage if available
      const res = await fetchFacebookToken();
      const hasFbToken = res.success === true && res.data && Object.keys(res.data).length > 0;
      setHasFacebookToken(hasFbToken);
      return hasFbToken;
    } catch {
      return false;
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      await loginRequest(payload);
      
      // Fetch updated user info
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);

      // Check Facebook token status
      const hasFbToken = await checkFacebookTokenStatus();
      setHasFacebookToken(hasFbToken);

      // Silently check subscription status
      try {
        const usageResponse = await getUserUsage('facebook');
        if (usageResponse.success && usageResponse.usage) {
          const usage = usageResponse.usage;
          const isPaid = usage.current_tier_name !== 'free';
          const subscriptionInfo = {
            platform: 'facebook',
            tier_name: usage.current_tier_name,
            is_paid: isPaid,
            is_unlimited: usage.is_unlimited,
            credits_expire_at: usage.credits_expire_at,
            is_expired: usage.is_expired,
            usage,
          };
          localStorage.setItem('postsiva_subscription', JSON.stringify(subscriptionInfo));
        }
      } catch (err) {
        // Silently fail - subscription check is not critical for login
        console.debug('Subscription check failed:', err);
      }

      // Redirect based on Facebook token status
      if (!hasFbToken) {
        router.push('/facebook-connect');
      } else {
        router.push('/profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [checkFacebookTokenStatus, router]);

  const logout = useCallback(() => {
    setUser(null);
    setHasFacebookToken(false);
    setError(null);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    router.push('/login');
  }, [router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isHydrated,
    error,
    hasFacebookToken,
    login,
    logout,
    checkFacebookToken: checkFacebookTokenStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
