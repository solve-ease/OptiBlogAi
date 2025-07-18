/**
 * GitHub Statistics React Hook
 * Fetches and manages GitHub repository data with caching and error handling
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { 
  RepositoryStats,
  ContributorStats,
  IssueStats,
  ActivityStats,
  Discussion,
  CommunityEvent,
  GitHubStatsHookReturn,
  ApiResponse 
} from '@/types/github';

interface GitHubStatsData {
  repository: RepositoryStats | null;
  contributors: ContributorStats[];
  issues: IssueStats | null;
  activity: ActivityStats | null;
  lastFetched: string | null;
}

/**
 * Custom hook for fetching and managing GitHub repository statistics
 */
export function useGitHubStats(autoFetch: boolean = true): GitHubStatsHookReturn {
  const [data, setData] = useState<GitHubStatsData>({
    repository: null,
    contributors: [],
    issues: null,
    activity: null,
    lastFetched: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch repository statistics from API
   */
  const fetchRepositoryStats = useCallback(async (): Promise<RepositoryStats | null> => {
    try {
      const response = await fetch('/api/github/stats');
      const result: ApiResponse<RepositoryStats> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch repository stats');
      }
      
      return result.data;
    } catch (err) {
      console.error('Failed to fetch repository stats:', err);
      return null;
    }
  }, []);

  /**
   * Fetch contributors statistics from API
   */
  const fetchContributorStats = useCallback(async (): Promise<ContributorStats[]> => {
    try {
      const response = await fetch('/api/github/contributors');
      const result: ApiResponse<ContributorStats[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch contributors');
      }
      
      return result.data || [];
    } catch (err) {
      console.error('Failed to fetch contributors:', err);
      return [];
    }
  }, []);

  /**
   * Fetch issues statistics from API
   */
  const fetchIssueStats = useCallback(async (): Promise<IssueStats | null> => {
    try {
      const response = await fetch('/api/github/issues');
      const result: ApiResponse<IssueStats> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch issues');
      }
      
      return result.data;
    } catch (err) {
      console.error('Failed to fetch issues:', err);
      return null;
    }
  }, []);

  /**
   * Fetch activity statistics from API
   */
  const fetchActivityStats = useCallback(async (): Promise<ActivityStats | null> => {
    try {
      const response = await fetch('/api/github/activity');
      const result: ApiResponse<ActivityStats> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch activity');
      }
      
      return result.data;
    } catch (err) {
      console.error('Failed to fetch activity:', err);
      return null;
    }
  }, []);

  /**
   * Fetch all GitHub data
   */
  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [repository, contributors, issues, activity] = await Promise.allSettled([
        fetchRepositoryStats(),
        fetchContributorStats(),
        fetchIssueStats(),
        fetchActivityStats(),
      ]);

      // Process results
      const newData: GitHubStatsData = {
        repository: repository.status === 'fulfilled' ? repository.value : null,
        contributors: contributors.status === 'fulfilled' ? contributors.value : [],
        issues: issues.status === 'fulfilled' ? issues.value : null,
        activity: activity.status === 'fulfilled' ? activity.value : null,
        lastFetched: new Date().toISOString(),
      };

      // Check if any critical data failed
      const errors: string[] = [];
      if (repository.status === 'rejected') {
        errors.push(`Repository: ${repository.reason}`);
      }
      if (contributors.status === 'rejected') {
        errors.push(`Contributors: ${contributors.reason}`);
      }
      if (issues.status === 'rejected') {
        errors.push(`Issues: ${issues.reason}`);
      }
      if (activity.status === 'rejected') {
        errors.push(`Activity: ${activity.reason}`);
      }

      // Only set error if all data failed to load
      if (errors.length > 0 && errors.length === 4) {
        console.warn('All GitHub data failed to load:', errors);
        setError(`Failed to load GitHub data: ${errors.join(', ')}`);
      } else if (errors.length > 0) {
        console.warn('Some GitHub data failed to load, using fallback:', errors);
        // Don't set error state if we have fallback data
      }

      setData(newData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch GitHub data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchRepositoryStats, fetchContributorStats, fetchIssueStats, fetchActivityStats]);

  /**
   * Auto-fetch data on mount
   */
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  /**
   * Transform data for backward compatibility with existing components
   */
  const transformedData = {
    repository: data.repository,
    contributors: data.contributors,
    issues: data.issues,
    activity: data.activity,
    releases: [], // Add empty releases array for compatibility
    rateLimit: { limit: 60, remaining: 60, reset: 0, used: 0 }, // Default rate limit
    lastFetched: data.lastFetched || new Date().toISOString(),
  };

  return {
    data: data.repository ? transformedData as any : null,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching basic repository stats only
 */
export function useRepositoryStats() {
  const [stats, setStats] = useState<RepositoryStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/github/stats');
      const result: ApiResponse<RepositoryStats> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch repository stats');
      }
      
      setStats(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch repository stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

/**
 * Hook for fetching contributors only
 */
export function useContributors() {
  const [contributors, setContributors] = useState<ContributorStats[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContributors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/github/contributors');
      const result: ApiResponse<ContributorStats[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch contributors');
      }
      
      setContributors(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch contributors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

  return {
    contributors,
    loading,
    error,
    refetch: fetchContributors,
  };
}

/**
 * Hook for fetching GitHub discussions
 */
export function useDiscussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscussions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/github/discussions');
      const result: ApiResponse<Discussion[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch discussions');
      }
      
      setDiscussions(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch discussions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  return {
    discussions,
    loading,
    error,
    refetch: fetchDiscussions,
  };
}

/**
 * Hook for fetching community events
 */
export function useEvents() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/github/events');
      const result: ApiResponse<CommunityEvent[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch events');
      }
      
      setEvents(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
}