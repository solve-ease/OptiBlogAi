"use client";

import React from "react";
import { motion } from "framer-motion";
import { useContributors } from "@/hooks/useGitHubStats";
import { Star, GitCommit, Award, ExternalLink, MapPin, Building2, Github } from "lucide-react";
import { ContributorStats } from "@/types/github";

interface ContributorCardProps {
  contributor: ContributorStats;
  rank: number;
  isTopContributor: boolean;
}

const ContributorCard: React.FC<ContributorCardProps> = ({ 
  contributor, 
  rank, 
  isTopContributor 
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: rank * 0.1,
        ease: "easeOut" as const
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const
      }
    }
  };

  const getBadgeColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-amber-600 to-amber-800";
    return "from-primary to-secondary";
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Award className="w-5 h-5" />;
    return <Star className="w-5 h-5" />;
  };

  const getContributionLevel = (contributions: number) => {
    if (contributions >= 100) return { level: "Champion", color: "text-yellow-600" };
    if (contributions >= 50) return { level: "Expert", color: "text-purple-600" };
    if (contributions >= 20) return { level: "Advanced", color: "text-blue-600" };
    if (contributions >= 10) return { level: "Intermediate", color: "text-green-600" };
    return { level: "Beginner", color: "text-gray-600" };
  };

  const { level, color } = getContributionLevel(contributor.contributions);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${
        isTopContributor ? "ring-2 ring-primary/20" : ""
      }`}
    >
      {/* Rank Badge */}
      <div className="absolute -top-3 -left-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getBadgeColor(rank)} flex items-center justify-center text-white font-bold shadow-lg`}>
          {rank <= 3 ? getRankIcon(rank) : rank}
        </div>
      </div>

      {/* Top Contributor Badge */}
      {isTopContributor && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Top Contributor
          </div>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <motion.img
            src={contributor.avatar_url}
            alt={contributor.login}
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Name and Username */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {contributor.name || contributor.login}
          </h3>
          <p className="text-gray-500 text-sm">@{contributor.login}</p>
          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 mt-2 ${color}`}>
            {level}
          </span>
        </div>

        {/* Bio */}
        {contributor.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {contributor.bio}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-4">
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <GitCommit className="w-4 h-4 text-primary mr-1" />
              <span className="text-xs text-gray-500">Contributions</span>
            </div>
            <p className="text-lg font-bold text-primary">{contributor.contributions}</p>
          </div>
          <div className="bg-secondary/5 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-secondary mr-1" />
              <span className="text-xs text-gray-500">Commits</span>
            </div>
            <p className="text-lg font-bold text-secondary">{contributor.commits}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="w-full space-y-2 mb-4">
          {contributor.company && (
            <div className="flex items-center justify-center text-xs text-gray-500">
              <Building2 className="w-3 h-3 mr-1" />
              {contributor.company}
            </div>
          )}
          {contributor.location && (
            <div className="flex items-center justify-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {contributor.location}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full">
          <a
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            <Github className="w-4 h-4" />
            Profile
          </a>
          <button className="px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-200">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ContributorLeaderboard: React.FC = () => {
  const { contributors, loading, error } = useContributors();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Loading our amazing contributors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load contributors</p>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  const sortedContributors = contributors
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 12); // Show top 12 contributors

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-6 text-center">
          <h3 className="text-3xl font-bold mb-2">{contributors.length}</h3>
          <p className="text-primary-100">Total Contributors</p>
        </div>
        <div className="bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-2xl p-6 text-center">
          <h3 className="text-3xl font-bold mb-2">
            {contributors.reduce((sum, c) => sum + c.contributions, 0)}
          </h3>
          <p className="text-secondary-100">Total Contributions</p>
        </div>
        <div className="bg-gradient-to-r from-accent to-accent/80 text-white rounded-2xl p-6 text-center">
          <h3 className="text-3xl font-bold mb-2">
            {contributors.reduce((sum, c) => sum + c.commits, 0)}
          </h3>
          <p className="text-accent-100">Total Commits</p>
        </div>
      </motion.div>

      {/* Contributors Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {sortedContributors.map((contributor, index) => (
          <ContributorCard
            key={contributor.login}
            contributor={contributor}
            rank={index + 1}
            isTopContributor={index < 3}
          />
        ))}
      </motion.div>

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center pt-8"
      >
        <a
          href="https://github.com/solve-ease/OptiBlogAi/graphs/contributors"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
        >
          <ExternalLink className="w-5 h-5" />
          View All Contributors on GitHub
        </a>
      </motion.div>
    </div>
  );
};

export default ContributorLeaderboard;