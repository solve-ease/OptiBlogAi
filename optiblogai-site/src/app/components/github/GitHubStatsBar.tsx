/**
 * GitHub Stats Bar Component
 * Displays key repository statistics in a horizontal bar
 */

'use client';

import React from 'react';
import { Star, GitFork, Eye, AlertCircle, Users, FileText } from 'lucide-react';
import { useRepositoryStats } from '@/hooks/useGitHubStats';
import { formatNumber } from '@/app/lib/utils';

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const GitHubStatsBar: React.FC = () => {
  const { stats, loading, error, refetch } = useRepositoryStats();

  // Create stat items from GitHub data
  const statItems: StatItem[] = React.useMemo(() => {
    if (!stats) return [];

    return [
      {
        icon: <Star className="w-4 h-4" />,
        label: 'Stars',
        value: stats.stars,
        color: 'text-yellow-600',
      },
      {
        icon: <GitFork className="w-4 h-4" />,
        label: 'Forks',
        value: stats.forks,
        color: 'text-blue-600',
      },
      {
        icon: <Eye className="w-4 h-4" />,
        label: 'Watchers',
        value: stats.watchers,
        color: 'text-green-600',
      },
      {
        icon: <FileText className="w-4 h-4" />,
        label: 'Issues',
        value: stats.openIssues,
        color: 'text-red-600',
      },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-6 py-4">
        <div className="animate-pulse flex space-x-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center space-x-2 py-4 text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Failed to load GitHub stats</span>
        <button 
          onClick={refetch}
          className="text-xs underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-8 py-4">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className="flex items-center space-x-2 group hover:scale-105 transition-transform duration-200"
        >
          <span className={`${item.color} group-hover:scale-110 transition-transform duration-200`}>
            {item.icon}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1">
            <span className="font-semibold text-gray-900">
              {formatNumber(item.value)}
            </span>
            <span className="text-sm text-gray-600">
              {item.label}
            </span>
          </div>
        </div>
      ))}
      
      {/* GitHub Link */}
      <a
        href="https://github.com/solve-ease/OptiBlogAi"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <Users className="w-4 h-4" />
        <span className="text-sm">View on GitHub</span>
      </a>
    </div>
  );
};

export default GitHubStatsBar;