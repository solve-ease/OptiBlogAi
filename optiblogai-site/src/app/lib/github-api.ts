/**
 * GitHub API Integration Library
 * Handles all GitHub API interactions with proper error handling and rate limiting
 */

import { SITE_CONFIG } from './constants';
import type {
  Repository,
  RepositoryStats,
  Contributor,
  ContributorStats,
  Issue,
  IssueStats,
  Commit,
  CommitActivity,
  ActivityStats,
  Release,
  RateLimit,
  GitHubApiError,
  ApiResponse,
} from '@/types/github';

// Configuration
const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'solve-ease';
const REPO_NAME = 'OptiBlogAi';
const REPO_FULL_NAME = `${REPO_OWNER}/${REPO_NAME}`;

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * Generic fetch function with error handling and rate limiting
 */
async function githubFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${GITHUB_API_BASE}${endpoint}`;
    
    // Check cache first
    const cacheKey = `${endpoint}${JSON.stringify(options)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return {
        data: cached.data,
        success: true,
      };
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OptiBlogAi-Website/1.0.0',
        ...options.headers,
      },
      ...options,
    });

    // Extract rate limit info
    const rateLimit: RateLimit = {
      limit: parseInt(response.headers.get('x-ratelimit-limit') || '60'),
      remaining: parseInt(response.headers.get('x-ratelimit-remaining') || '60'),
      reset: parseInt(response.headers.get('x-ratelimit-reset') || '0'),
      used: parseInt(response.headers.get('x-ratelimit-used') || '0'),
    };

    if (!response.ok) {
      const errorData: GitHubApiError = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));

      return {
        data: null as unknown as T,
        success: false,
        error: errorData.message,
        rateLimit,
      };
    }

    const data: T = await response.json();
    
    // Cache the successful response
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return {
      data,
      success: true,
      rateLimit,
    };
  } catch (error) {
    console.error('GitHub API fetch error:', error);
    return {
      data: null as unknown as T,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Fetch repository basic information
 */
export async function fetchRepository(): Promise<ApiResponse<Repository>> {
  return githubFetch<Repository>(`/repos/${REPO_FULL_NAME}`);
}

/**
 * Fetch repository statistics
 */
export async function fetchRepositoryStats(): Promise<ApiResponse<RepositoryStats>> {
  const repoResponse = await fetchRepository();
  
  if (!repoResponse.success || !repoResponse.data) {
    return {
      data: null as unknown as RepositoryStats,
      success: false,
      error: repoResponse.error || 'Failed to fetch repository data',
      rateLimit: repoResponse.rateLimit,
    };
  }

  const repo = repoResponse.data;
  const stats: RepositoryStats = {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    openIssues: repo.open_issues_count,
    size: repo.size,
    language: repo.language,
    license: repo.license?.name || null,
    topics: repo.topics,
    lastUpdated: repo.updated_at,
    createdAt: repo.created_at,
  };

  return {
    data: stats,
    success: true,
    rateLimit: repoResponse.rateLimit,
  };
}

/**
 * Fetch repository contributors
 */
export async function fetchContributors(): Promise<ApiResponse<Contributor[]>> {
  return githubFetch<Contributor[]>(`/repos/${REPO_FULL_NAME}/contributors`);
}

/**
 * Fetch detailed contributor statistics
 */
export async function fetchContributorStats(): Promise<ApiResponse<ContributorStats[]>> {
  const contributorsResponse = await fetchContributors();
  
  if (!contributorsResponse.success || !contributorsResponse.data) {
    return {
      data: [],
      success: false,
      error: contributorsResponse.error || 'Failed to fetch contributors',
      rateLimit: contributorsResponse.rateLimit,
    };
  }

  const contributors = contributorsResponse.data;
  const detailedStats: ContributorStats[] = [];

  // Get detailed stats for top contributors (limit to first 10 to avoid rate limits)
  const topContributors = contributors.slice(0, 10);
  
  for (const contributor of topContributors) {
    try {
      const userResponse = await githubFetch<Contributor>(`/users/${contributor.login}`);
      
      if (userResponse.success && userResponse.data) {
        detailedStats.push({
          login: contributor.login,
          avatar_url: contributor.avatar_url,
          html_url: contributor.html_url,
          contributions: contributor.contributions,
          additions: 0, // Would need to fetch commit stats for this
          deletions: 0, // Would need to fetch commit stats for this
          commits: contributor.contributions, // Approximation
          name: userResponse.data.name,
          bio: userResponse.data.bio,
          company: userResponse.data.company,
          location: userResponse.data.location,
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch details for contributor ${contributor.login}:`, error);
      // Add basic info if detailed fetch fails
      detailedStats.push({
        login: contributor.login,
        avatar_url: contributor.avatar_url,
        html_url: contributor.html_url,
        contributions: contributor.contributions,
        additions: 0,
        deletions: 0,
        commits: contributor.contributions,
      });
    }
  }

  return {
    data: detailedStats,
    success: true,
    rateLimit: contributorsResponse.rateLimit,
  };
}

/**
 * Fetch repository issues
 */
export async function fetchIssues(): Promise<ApiResponse<Issue[]>> {
  return githubFetch<Issue[]>(`/repos/${REPO_FULL_NAME}/issues?state=all&per_page=100`);
}

/**
 * Fetch issue statistics
 */
export async function fetchIssueStats(): Promise<ApiResponse<IssueStats>> {
  const issuesResponse = await fetchIssues();
  
  if (!issuesResponse.success || !issuesResponse.data) {
    return {
      data: null as unknown as IssueStats,
      success: false,
      error: issuesResponse.error || 'Failed to fetch issues',
      rateLimit: issuesResponse.rateLimit,
    };
  }

  const issues = issuesResponse.data;
  const openIssues = issues.filter(issue => issue.state === 'open');
  const closedIssues = issues.filter(issue => issue.state === 'closed');
  
  // Count labels
  const labelCounts = new Map<string, { count: number; color: string }>();
  issues.forEach(issue => {
    issue.labels.forEach(label => {
      const existing = labelCounts.get(label.name);
      labelCounts.set(label.name, {
        count: (existing?.count || 0) + 1,
        color: label.color,
      });
    });
  });

  const labels = Array.from(labelCounts.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    color: data.color,
  })).sort((a, b) => b.count - a.count);

  const stats: IssueStats = {
    total: issues.length,
    open: openIssues.length,
    closed: closedIssues.length,
    labels,
  };

  return {
    data: stats,
    success: true,
    rateLimit: issuesResponse.rateLimit,
  };
}

/**
 * Fetch repository commits
 */
export async function fetchCommits(): Promise<ApiResponse<Commit[]>> {
  return githubFetch<Commit[]>(`/repos/${REPO_FULL_NAME}/commits?per_page=100`);
}

/**
 * Fetch commit activity
 */
export async function fetchCommitActivity(): Promise<ApiResponse<CommitActivity[]>> {
  return githubFetch<CommitActivity[]>(`/repos/${REPO_FULL_NAME}/stats/commit_activity`);
}

/**
 * Fetch repository languages
 */
export async function fetchLanguages(): Promise<ApiResponse<{ [key: string]: number }>> {
  return githubFetch<{ [key: string]: number }>(`/repos/${REPO_FULL_NAME}/languages`);
}

/**
 * Fetch activity statistics
 */
export async function fetchActivityStats(): Promise<ApiResponse<ActivityStats>> {
  try {
    const [
      commitActivityResponse,
      commitsResponse,
      contributorsResponse,
      languagesResponse,
    ] = await Promise.all([
      fetchCommitActivity(),
      fetchCommits(),
      fetchContributors(),
      fetchLanguages(),
    ]);

    const commitActivity = commitActivityResponse.data || [];
    const commits = commitsResponse.data || [];
    const contributors = contributorsResponse.data || [];
    const languages = languagesResponse.data || {};

    // Calculate statistics
    const totalCommits = commits.length;
    const weeklyCommits = commitActivity[commitActivity.length - 1]?.total || 0;
    const monthlyCommits = commitActivity.slice(-4).reduce((sum, week) => sum + week.total, 0);

    const topContributors = contributors.slice(0, 5).map(contributor => ({
      login: contributor.login,
      contributions: contributor.contributions,
      avatar_url: contributor.avatar_url,
    }));

    const lastCommit = commits[0] ? {
      sha: commits[0].sha,
      message: commits[0].commit.message,
      author: commits[0].commit.author.name,
      date: commits[0].commit.author.date,
    } : {
      sha: '',
      message: '',
      author: '',
      date: '',
    };

    const stats: ActivityStats = {
      commitActivity,
      totalCommits,
      weeklyCommits,
      monthlyCommits,
      topContributors,
      languageStats: languages,
      lastCommit,
    };

    return {
      data: stats,
      success: true,
      rateLimit: commitActivityResponse.rateLimit,
    };
  } catch (error) {
    return {
      data: null as unknown as ActivityStats,
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activity stats',
    };
  }
}

/**
 * Fetch repository releases
 */
export async function fetchReleases(): Promise<ApiResponse<Release[]>> {
  return githubFetch<Release[]>(`/repos/${REPO_FULL_NAME}/releases?per_page=10`);
}

/**
 * Clear cache (useful for manual refresh)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

/**
 * Validate GitHub repository URL
 */
export function isValidGitHubRepo(url: string): boolean {
  const githubRepoRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/;
  return githubRepoRegex.test(url);
}

/**
 * Extract owner and repo from GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([\w-]+)\/([\w-]+)/);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
    };
  }
  return null;
}