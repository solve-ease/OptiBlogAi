/**
 * GitHub API Response Types
 * Following GitHub REST API v3 specifications
 */

// Basic repository information
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  size: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  topics: string[];
}

// Repository statistics response
export interface RepositoryStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  size: number;
  language: string | null;
  license: string | null;
  topics: string[];
  lastUpdated: string;
  createdAt: string;
}

// Contributor information
export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: 'User' | 'Bot';
  name?: string;
  bio?: string;
  company?: string;
  location?: string;
  email?: string;
  blog?: string;
  twitter_username?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
}

// Detailed contributor stats
export interface ContributorStats {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  additions: number;
  deletions: number;
  commits: number;
  name?: string;
  bio?: string;
  company?: string;
  location?: string;
}

// Issue information
export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string;
  html_url: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  assignees: Contributor[];
  labels: {
    id: number;
    name: string;
    color: string;
    description: string | null;
  }[];
  user: Contributor;
  comments: number;
  milestone: {
    id: number;
    title: string;
    description: string | null;
    state: 'open' | 'closed';
    due_on: string | null;
  } | null;
}

// Issue statistics
export interface IssueStats {
  total: number;
  open: number;
  closed: number;
  labels: {
    name: string;
    count: number;
    color: string;
  }[];
}

// Commit information
export interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: Contributor | null;
  committer: Contributor | null;
  html_url: string;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

// Commit activity data
export interface CommitActivity {
  week: number; // Unix timestamp
  total: number;
  days: number[]; // Array of 7 numbers representing each day of the week
}

// Repository activity statistics
export interface ActivityStats {
  commitActivity: CommitActivity[];
  totalCommits: number;
  weeklyCommits: number;
  monthlyCommits: number;
  topContributors: {
    login: string;
    contributions: number;
    avatar_url: string;
  }[];
  languageStats: {
    [language: string]: number;
  };
  lastCommit: {
    sha: string;
    message: string;
    author: string;
    date: string;
  };
}

// Release information
export interface Release {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  created_at: string;
  published_at: string;
  author: Contributor;
  assets: {
    id: number;
    name: string;
    download_count: number;
    browser_download_url: string;
  }[];
  prerelease: boolean;
  draft: boolean;
}

// API rate limit information
export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

// API Error response
export interface GitHubApiError {
  message: string;
  documentation_url?: string;
  errors?: {
    field: string;
    code: string;
    message: string;
  }[];
}

// Combined repository data for dashboard
export interface RepositoryData {
  repository: RepositoryStats;
  contributors: ContributorStats[];
  issues: IssueStats;
  activity: ActivityStats;
  releases: Release[];
  rateLimit: RateLimit;
  lastFetched: string;
}

// Hook return types
export interface GitHubStatsHookReturn {
  data: RepositoryData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  rateLimit?: RateLimit;
}

// Search results
export interface SearchResults<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

// Repository search result
export interface RepositorySearchResult {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}