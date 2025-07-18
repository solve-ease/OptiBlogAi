'use client';

import React, { useEffect, useState } from 'react';
import { fetchContributorStats } from '@/app/lib/github-api';
import type { ContributorStats } from '@/types/github';

// Updated type to match the ContributorStats interface
type Contributor = {
  username: string;
  avatar: string;
  profile: string;
  commits: number;
  bio?: string;
  followers?: number;
  publicRepos?: number;
  company?: string;
  location?: string;
};

const TeamShowcase = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContributors = async () => {
      try {
        const response = await fetchContributorStats();
        
        if (response.success && response.data) {
          // Transform ContributorStats to match our Contributor type
          const transformedData: Contributor[] = response.data.map((contributor: ContributorStats) => ({
            username: contributor.login,
            avatar: contributor.avatar_url,
            profile: contributor.html_url,
            commits: contributor.contributions,
            bio: contributor.bio,
            followers: 0, // Not available in ContributorStats, would need separate API call
            publicRepos: 0, // Not available in ContributorStats, would need separate API call
            company: contributor.company,
            location: contributor.location,
          }));
          
          setContributors(transformedData);
        } else {
          console.error('Failed to fetch contributors:', response.error);
          // You could set fallback data here if needed
        }
      } catch (error) {
        console.error('Error loading contributors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContributors();
  }, []);

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">🌟 Contributors</h2>
        {loading ? (
          <p className="text-gray-500">Loading contributors...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contributors.map((user, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-14 h-14 rounded-full border"
                  />
                  <div>
                    <a
                      href={user.profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-600 hover:underline"
                    >
                      @{user.username}
                    </a>
                    <p className="text-sm text-gray-500">{user.bio || 'No bio available'}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-700">
                  <p>🛠 Commits: <span className="font-medium">{user.commits}</span></p>
                  <p>📦 Public Repos: <span className="font-medium">{user.publicRepos}</span></p>
                  <p>👥 Followers: <span className="font-medium">{user.followers}</span></p>
                </div>
                {index === 0 && (
                  <div className="mt-3 inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    🌟 Top Contributor
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamShowcase;
