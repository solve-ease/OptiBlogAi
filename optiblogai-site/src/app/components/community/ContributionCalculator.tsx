"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Star,
  GitCommit,
  Bug,
  Code,
  FileText,
  Trophy,
  Award,
  Target,
  Zap,
} from "lucide-react";

interface ContributionType {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  category: "code" | "docs" | "community" | "design";
  difficulty: "easy" | "medium" | "hard" | "expert";
}

const CONTRIBUTION_TYPES: ContributionType[] = [
  {
    id: "bug-fix",
    name: "Bug Fix",
    description: "Fix a reported bug or issue",
    points: 10,
    icon: <Bug className="w-5 h-5" />,
    category: "code",
    difficulty: "easy",
  },
  {
    id: "feature-small",
    name: "Small Feature",
    description: "Implement a small feature or enhancement",
    points: 25,
    icon: <Zap className="w-5 h-5" />,
    category: "code",
    difficulty: "medium",
  },
  {
    id: "feature-major",
    name: "Major Feature",
    description: "Implement a significant new feature",
    points: 50,
    icon: <Star className="w-5 h-5" />,
    category: "code",
    difficulty: "hard",
  },
  {
    id: "architecture",
    name: "Architecture Improvement",
    description: "Improve code architecture or performance",
    points: 75,
    icon: <Code className="w-5 h-5" />,
    category: "code",
    difficulty: "expert",
  },
  {
    id: "documentation",
    name: "Documentation",
    description: "Write or improve documentation",
    points: 15,
    icon: <FileText className="w-5 h-5" />,
    category: "docs",
    difficulty: "easy",
  },
  {
    id: "tutorial",
    name: "Tutorial/Guide",
    description: "Create tutorials or user guides",
    points: 30,
    icon: <Target className="w-5 h-5" />,
    category: "docs",
    difficulty: "medium",
  },
  {
    id: "code-review",
    name: "Code Review",
    description: "Review and provide feedback on PRs",
    points: 5,
    icon: <GitCommit className="w-5 h-5" />,
    category: "community",
    difficulty: "easy",
  },
  {
    id: "mentoring",
    name: "Mentoring",
    description: "Help new contributors get started",
    points: 20,
    icon: <Trophy className="w-5 h-5" />,
    category: "community",
    difficulty: "medium",
  },
];

interface UserContribution {
  typeId: string;
  quantity: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  pointsRequired: number;
  color: string;
}

const BADGES: Badge[] = [
  {
    id: "newcomer",
    name: "Newcomer",
    description: "Made your first contribution",
    icon: <Star className="w-6 h-6" />,
    pointsRequired: 5,
    color: "bg-green-500",
  },
  {
    id: "contributor",
    name: "Contributor",
    description: "Earned 50 contribution points",
    icon: <GitCommit className="w-6 h-6" />,
    pointsRequired: 50,
    color: "bg-blue-500",
  },
  {
    id: "champion",
    name: "Champion",
    description: "Earned 150 contribution points",
    icon: <Trophy className="w-6 h-6" />,
    pointsRequired: 150,
    color: "bg-purple-500",
  },
  {
    id: "legend",
    name: "Legend",
    description: "Earned 300 contribution points",
    icon: <Award className="w-6 h-6" />,
    pointsRequired: 300,
    color: "bg-yellow-500",
  },
];

const ContributionItem: React.FC<{
  type: ContributionType;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}> = ({ type, quantity, onQuantityChange }) => {
  const getDifficultyColor = () => {
    switch (type.difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-orange-100 text-orange-800";
      case "expert":
        return "bg-red-100 text-red-800";
    }
  };

  const getCategoryColor = () => {
    switch (type.category) {
      case "code":
        return "bg-blue-100 text-blue-800";
      case "docs":
        return "bg-purple-100 text-purple-800";
      case "community":
        return "bg-green-100 text-green-800";
      case "design":
        return "bg-pink-100 text-pink-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {type.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{type.name}</h3>
            <p className="text-sm text-gray-600">{type.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">
            {type.points} pts
          </div>
          <div className="text-xs text-gray-500">each</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor()}`}
          >
            {type.difficulty}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${getCategoryColor()}`}
          >
            {type.category}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            disabled={quantity === 0}
          >
            -
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>
        {quantity > 0 && (
          <div className="ml-auto text-sm font-semibold text-secondary">
            = {quantity * type.points} pts
          </div>
        )}
      </div>
    </motion.div>
  );
};

const BadgeCard: React.FC<{
  badge: Badge;
  earned: boolean;
  progress: number;
}> = ({ badge, earned, progress }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        earned
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="text-center">
        <div
          className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center mx-auto mb-3 ${
            earned ? "text-white" : "text-gray-400"
          }`}
        >
          {badge.icon}
        </div>
        <h3
          className={`font-bold mb-1 ${earned ? "text-primary" : "text-gray-500"}`}
        >
          {badge.name}
        </h3>
        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
        <div className="text-xs text-gray-500">
          {badge.pointsRequired} points required
        </div>

        {!earned && progress > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(progress)}% complete
            </div>
          </div>
        )}

        {earned && (
          <div className="absolute -top-2 -right-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white fill-current" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ContributionCalculator: React.FC = () => {
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const total = contributions.reduce((sum, contrib) => {
      const type = CONTRIBUTION_TYPES.find((t) => t.id === contrib.typeId);
      return sum + (type ? type.points * contrib.quantity : 0);
    }, 0);
    setTotalPoints(total);
  }, [contributions]);

  const updateContribution = (typeId: string, quantity: number) => {
    setContributions((prev) => {
      const existing = prev.find((c) => c.typeId === typeId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter((c) => c.typeId !== typeId);
        }
        return prev.map((c) => (c.typeId === typeId ? { ...c, quantity } : c));
      } else if (quantity > 0) {
        return [...prev, { typeId, quantity }];
      }
      return prev;
    });
  };

  const getContributionQuantity = (typeId: string) => {
    return contributions.find((c) => c.typeId === typeId)?.quantity || 0;
  };

  const resetCalculator = () => {
    setContributions([]);
  };

  const earnedBadges = BADGES.filter(
    (badge) => totalPoints >= badge.pointsRequired,
  );
  const nextBadge = BADGES.find((badge) => totalPoints < badge.pointsRequired);
  const progressToNext = nextBadge
    ? (totalPoints / nextBadge.pointsRequired) * 100
    : 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-6">
          <Calculator className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">
            Contribution Calculator
          </span>
        </div>
      </motion.div>

      {/* Current Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-2">{totalPoints}</h2>
        <p className="text-xl opacity-90">Contribution Points</p>

        {nextBadge && (
          <div className="mt-6 bg-white/20 rounded-xl p-4">
            <p className="text-sm opacity-90 mb-2">
              Progress to {nextBadge.name}: {totalPoints} /{" "}
              {nextBadge.pointsRequired}
            </p>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                className="bg-white h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Contribution Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Plan Your Contributions
          </h3>
          {contributions.length > 0 && (
            <button
              onClick={resetCalculator}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONTRIBUTION_TYPES.map((type) => (
            <ContributionItem
              key={type.id}
              type={type}
              quantity={getContributionQuantity(type.id)}
              onQuantityChange={(quantity) =>
                updateContribution(type.id, quantity)
              }
            />
          ))}
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Achievement Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const earned = totalPoints >= badge.pointsRequired;
            const progress = (totalPoints / badge.pointsRequired) * 100;

            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={earned}
                progress={progress}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Summary and CTA */}
      {totalPoints > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gray-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Contributing?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your planned contributions could earn you {totalPoints} points and{" "}
            {earnedBadges.length} badges. Let&apos;s turn this plan into action!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/solve-ease/OptiBlogAi/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              <Star className="w-5 h-5" />
              Find Good First Issues
            </a>
            <a
              href="https://github.com/solve-ease/OptiBlogAi/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              Contribution Guide
            </a>
          </div>
        </motion.div>
      )}

      {/* How it Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="border-t border-gray-200 pt-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          How Points Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bug className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Bug Fixes</h4>
            <p className="text-sm text-gray-600">
              Quick wins, immediate impact
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Features</h4>
            <p className="text-sm text-gray-600">
              New functionality and improvements
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Documentation</h4>
            <p className="text-sm text-gray-600">
              Help others understand and use
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Community</h4>
            <p className="text-sm text-gray-600">Support and mentor others</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContributionCalculator;
