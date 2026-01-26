import { useState, useEffect, useCallback } from 'react';
import {
  fetchDashboardOverview,
  fetchDashboardVideos,
  type DashboardStats,
  type DashboardOverviewResponse,
  type DashboardVideosResponse,
} from './api';

export interface UseDashboardStatsState {
  stats: DashboardStats | null;
  overview: DashboardOverviewResponse | null;
  videos: DashboardVideosResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useDashboardStats() {
  const [state, setState] = useState<UseDashboardStatsState>({
    stats: null,
    overview: null,
    videos: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchStats = useCallback(async (options?: { forceRefresh?: boolean }) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [overviewData, videosData] = await Promise.all([
        fetchDashboardOverview({ forceRefresh: options?.forceRefresh }),
        fetchDashboardVideos({ forceRefresh: options?.forceRefresh }),
      ]);

      // Log the response for debugging
      console.log('Dashboard Overview Response:', JSON.stringify(overviewData, null, 2));
      console.log('Dashboard Videos Response:', JSON.stringify(videosData, null, 2));

      if (!overviewData.success) {
        const errorMsg = overviewData.error || overviewData.message || 'Failed to fetch dashboard overview';
        console.error('Dashboard overview error:', errorMsg);
        throw new Error(errorMsg);
      }

      // Handle case where data might be null or undefined
      if (!overviewData.data) {
        console.warn('Dashboard overview data is null/undefined');
        // Set default stats if no data
        const defaultStats: DashboardStats = {
          totalPosts: 0,
          publishedPosts: 0,
          scheduledPosts: 0,
          draftPosts: 0,
          totalEngagement: 0,
          totalReach: 0,
          averageEngagementRate: 0,
          platformsConnected: [],
        };
        setState((prev) => ({
          ...prev,
          stats: defaultStats,
          overview: overviewData,
          videos: videosData,
          lastUpdated: new Date(),
        }));
        return { overview: overviewData, videos: videosData };
      }

      // Check if the response is YouTube data instead of Facebook data
      // YouTube responses have total_videos, total_views, subscriber_count
      // Facebook responses should have total_posts, published_posts, etc.
      const data = overviewData.data as any;
      if (data.total_videos !== undefined || data.total_views !== undefined) {
        console.warn('Received YouTube data instead of Facebook data. Dashboard expects Facebook metrics.');
        // Set default stats for Facebook (since we got YouTube data)
        const defaultStats: DashboardStats = {
          totalPosts: 0,
          publishedPosts: 0,
          scheduledPosts: 0,
          draftPosts: 0,
          totalEngagement: 0,
          totalReach: 0,
          averageEngagementRate: 0,
          platformsConnected: ['youtube'], // At least YouTube is connected
        };
        setState((prev) => ({
          ...prev,
          stats: defaultStats,
          overview: overviewData,
          videos: videosData,
          lastUpdated: new Date(),
        }));
        return { overview: overviewData, videos: videosData };
      }

      const stats: DashboardStats = {
        totalPosts: overviewData.data?.total_posts || 0,
        publishedPosts: overviewData.data?.published_posts || 0,
        scheduledPosts: overviewData.data?.scheduled_posts || 0,
        draftPosts: overviewData.data?.draft_posts || 0,
        totalEngagement: overviewData.data?.total_engagement || 0,
        totalReach: overviewData.data?.total_reach || 0,
        averageEngagementRate:
          overviewData.data?.average_engagement_rate || 0,
        platformsConnected: overviewData.data?.platforms_connected || [],
      };

      setState((prev) => ({
        ...prev,
        stats,
        overview: overviewData,
        videos: videosData,
        lastUpdated: new Date(),
      }));

      return { overview: overviewData, videos: videosData };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
      console.error('Dashboard stats fetch error:', err);
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      // Don't throw - let the component handle the error state
      return null;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchOverview = useCallback(async (options?: { forceRefresh?: boolean }) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const overviewData = await fetchDashboardOverview({ forceRefresh: options?.forceRefresh });

      if (!overviewData.success) {
        throw new Error(overviewData.error || overviewData.message);
      }

      const stats: DashboardStats = {
        totalPosts: overviewData.data?.total_posts || 0,
        publishedPosts: overviewData.data?.published_posts || 0,
        scheduledPosts: overviewData.data?.scheduled_posts || 0,
        draftPosts: overviewData.data?.draft_posts || 0,
        totalEngagement: overviewData.data?.total_engagement || 0,
        totalReach: overviewData.data?.total_reach || 0,
        averageEngagementRate:
          overviewData.data?.average_engagement_rate || 0,
        platformsConnected: overviewData.data?.platforms_connected || [],
      };

      setState((prev) => ({
        ...prev,
        stats,
        overview: overviewData,
        lastUpdated: new Date(),
      }));

      return overviewData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch overview';
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw err;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchVideos = useCallback(async (options?: { forceRefresh?: boolean }) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const videosData = await fetchDashboardVideos({ forceRefresh: options?.forceRefresh });

      if (!videosData.success) {
        throw new Error(videosData.error || videosData.message);
      }

      setState((prev) => ({
        ...prev,
        videos: videosData,
        lastUpdated: new Date(),
      }));

      return videosData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch videos';
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw err;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    stats: state.stats,
    overview: state.overview,
    videos: state.videos,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetchStats,
    fetchOverview,
    fetchVideos,
    clearError,
  };
}
