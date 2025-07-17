'use client'; // If you want to make it client-side, remove this if rendering server-side

import React, { useEffect, useState } from 'react';

type Contributor = {
  username: string;
  avatar: string;
  profile: string;
  commits: number;
  bio?: string;
  followers?: number;
  publicRepos?: number;
};

const GITHUB_REPO = 'solve-ease/OptiBlogAi';

const fetchContributors = async (): Promise<Contributor[]> => {
  const baseURL = 'https://api.github.com';
  const contributorsRes = await fetch(`${baseURL}/repos/${GITHUB_REPO}/contributors`);
  const contributorsData = await contributorsRes.json();

  // Fetch extended details for each contributor
  const enrichedData = await Promise.all(
    contributorsData.map(async (contributor: any) => {
      const userRes = await fetch(`${baseURL}/users/${contributor.login}`);
      const userData = await userRes.json();

      return {
        username: contributor.login,
        avatar: contributor.avatar_url,
        profile: contributor.html_url,
        commits: contributor.contributions,
        bio: userData.bio,
        followers: userData.followers,
        publicRepos: userData.public_repos,
      };
    })
  );

  return enrichedData;
};

const TeamShowcase = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContributors()
      .then((data) => {
        setContributors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch contributors:', error);
        setLoading(false);
      });
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
