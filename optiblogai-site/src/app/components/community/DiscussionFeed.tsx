"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Reply, ExternalLink, User, Clock, Tag, Sparkles } from "lucide-react";
import { useDiscussions } from "@/hooks/useGitHubStats";
import { Discussion } from "@/types/github";

const DiscussionCard: React.FC<{ discussion: Discussion; index: number }> = ({ 
  discussion, 
  index 
}) => {
  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHrs > 0) {
      return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getCategoryColor = () => {
    switch (discussion.category.name) {
      case "Q&A":
        return "bg-blue-100 text-blue-800";
      case "Ideas":
        return "bg-purple-100 text-purple-800";
      case "Show and tell":
        return "bg-green-100 text-green-800";
      case "General":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 ${
        discussion.featured ? "ring-2 ring-primary/20" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={discussion.author.avatar_url}
            alt={discussion.author.login}
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <a
                href={discussion.author.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-900 hover:text-primary transition-colors"
              >
                @{discussion.author.login}
              </a>
              {discussion.featured && (
                <span className="bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{timeAgo(discussion.createdAt)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}>
                {discussion.category.emoji} {discussion.category.name}
              </span>
            </div>
          </div>
        </div>

        {discussion.answered && (
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
            ✓ Answered
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
        {discussion.title}
      </h3>

      {/* Body Preview */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {discussion.body}
      </p>

      {/* Tags */}
      {discussion.tags && discussion.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {discussion.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{discussion.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{discussion.reactions.total}</span>
          </div>
        </div>

        <a
          href={discussion.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          <span>View Discussion</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

const CategoryButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      active
        ? "bg-primary text-white shadow-lg"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

const DiscussionFeed: React.FC = () => {
  const { discussions, loading, error } = useDiscussions();
  const [filter, setFilter] = useState<string>("all");

  const filteredDiscussions = discussions.filter(discussion => {
    if (filter === "all") return true;
    if (filter === "featured") return discussion.featured;
    if (filter === "answered") return discussion.answered;
    if (filter === "unanswered") return !discussion.answered;
    return discussion.category.name.toLowerCase() === filter;
  });

  const stats = {
    total: discussions.length,
    answered: discussions.filter(d => d.answered).length,
    featured: discussions.filter(d => d.featured).length,
    totalComments: discussions.reduce((sum, d) => sum + d.comments, 0)
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load discussions</p>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-primary">{stats.total}</h3>
          <p className="text-primary text-sm">Discussions</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-green-700">{stats.answered}</h3>
          <p className="text-green-600 text-sm">Answered</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-yellow-700">{stats.featured}</h3>
          <p className="text-yellow-600 text-sm">Featured</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-blue-700">{stats.totalComments}</h3>
          <p className="text-blue-600 text-sm">Comments</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter Discussions</h3>
        <div className="flex flex-wrap gap-2">
          <CategoryButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </CategoryButton>
          <CategoryButton
            active={filter === "featured"}
            onClick={() => setFilter("featured")}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Featured
          </CategoryButton>
          <CategoryButton
            active={filter === "q&a"}
            onClick={() => setFilter("q&a")}
          >
            ❓ Q&A
          </CategoryButton>
          <CategoryButton
            active={filter === "ideas"}
            onClick={() => setFilter("ideas")}
          >
            💡 Ideas
          </CategoryButton>
          <CategoryButton
            active={filter === "show and tell"}
            onClick={() => setFilter("show and tell")}
          >
            🎉 Show & Tell
          </CategoryButton>
          <CategoryButton
            active={filter === "answered"}
            onClick={() => setFilter("answered")}
          >
            Answered
          </CategoryButton>
          <CategoryButton
            active={filter === "unanswered"}
            onClick={() => setFilter("unanswered")}
          >
            Unanswered
          </CategoryButton>
        </div>
      </motion.div>

      {/* Discussions */}
      <motion.div
        layout
        className="space-y-6"
      >
        {filteredDiscussions.map((discussion, index) => (
          <DiscussionCard 
            key={discussion.id} 
            discussion={discussion} 
            index={index} 
          />
        ))}
      </motion.div>

      {filteredDiscussions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No discussions match the current filter</p>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center pt-8 border-t border-gray-200"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Join the Conversation
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Have a question, idea, or want to share your success story? 
          Start a new discussion and connect with our amazing community!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/solve-ease/OptiBlogAi/discussions/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            Start a Discussion
          </a>
          <a
            href="https://github.com/solve-ease/OptiBlogAi/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            <ExternalLink className="w-5 h-5" />
            View All Discussions
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default DiscussionFeed;