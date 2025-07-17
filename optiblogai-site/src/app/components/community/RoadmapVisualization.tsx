"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, Calendar, Users, Target, Zap, Code, Sparkles } from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
  category: "features" | "infrastructure" | "community" | "docs";
  startDate: string;
  endDate: string;
  progress: number;
  contributors: number;
  priority: "high" | "medium" | "low";
  tags: string[];
}

const ROADMAP_DATA: RoadmapItem[] = [
  {
    id: "ai-core",
    title: "Core AI Engine",
    description: "Advanced natural language processing and content generation algorithms",
    status: "completed",
    category: "features",
    startDate: "2024-01-15",
    endDate: "2024-03-20",
    progress: 100,
    contributors: 5,
    priority: "high",
    tags: ["AI", "NLP", "Core"]
  },
  {
    id: "seo-optimization",
    title: "SEO Optimization Suite",
    description: "Comprehensive SEO analysis and optimization tools",
    status: "completed",
    category: "features",
    startDate: "2024-02-01",
    endDate: "2024-04-15",
    progress: 100,
    contributors: 3,
    priority: "high",
    tags: ["SEO", "Analytics", "Tools"]
  },
  {
    id: "web-interface",
    title: "Web Interface & Dashboard",
    description: "Modern, responsive web interface for content management",
    status: "in-progress",
    category: "features",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    progress: 75,
    contributors: 4,
    priority: "high",
    tags: ["Frontend", "UI/UX", "React"]
  },
  {
    id: "api-v2",
    title: "API v2.0 Development",
    description: "RESTful API with enhanced performance and new endpoints",
    status: "in-progress",
    category: "infrastructure",
    startDate: "2024-04-01",
    endDate: "2024-07-15",
    progress: 60,
    contributors: 3,
    priority: "high",
    tags: ["API", "Backend", "Performance"]
  },
  {
    id: "plugins",
    title: "Plugin Architecture",
    description: "Extensible plugin system for custom integrations",
    status: "planned",
    category: "features",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    progress: 0,
    contributors: 0,
    priority: "medium",
    tags: ["Plugins", "Extensions", "Architecture"]
  },
  {
    id: "mobile-app",
    title: "Mobile Application",
    description: "Native mobile apps for iOS and Android",
    status: "planned",
    category: "features",
    startDate: "2024-08-01",
    endDate: "2024-12-15",
    progress: 0,
    contributors: 0,
    priority: "medium",
    tags: ["Mobile", "iOS", "Android"]
  },
  {
    id: "community-platform",
    title: "Community Platform",
    description: "Enhanced community features and collaboration tools",
    status: "in-progress",
    category: "community",
    startDate: "2024-05-01",
    endDate: "2024-08-30",
    progress: 40,
    contributors: 6,
    priority: "medium",
    tags: ["Community", "Collaboration", "Social"]
  },
  {
    id: "documentation",
    title: "Comprehensive Documentation",
    description: "Complete API docs, tutorials, and user guides",
    status: "in-progress",
    category: "docs",
    startDate: "2024-04-15",
    endDate: "2024-07-30",
    progress: 70,
    contributors: 2,
    priority: "high",
    tags: ["Docs", "Tutorials", "API"]
  }
];

const RoadmapCard: React.FC<{ item: RoadmapItem; index: number }> = ({ item, index }) => {
  const getStatusIcon = () => {
    switch (item.status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500 fill-current" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-blue-500" />;
      case "planned":
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "in-progress":
        return "border-blue-200 bg-blue-50";
      case "planned":
        return "border-gray-200 bg-gray-50";
    }
  };

  const getCategoryIcon = () => {
    switch (item.category) {
      case "features":
        return <Sparkles className="w-4 h-4" />;
      case "infrastructure":
        return <Code className="w-4 h-4" />;
      case "community":
        return <Users className="w-4 h-4" />;
      case "docs":
        return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = () => {
    switch (item.priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-6 rounded-xl border-2 ${getStatusColor()} hover:shadow-lg transition-all duration-300`}
    >
      {/* Status Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex items-center gap-2">
            {getCategoryIcon()}
            <span className="text-sm font-medium text-gray-600 capitalize">
              {item.category}
            </span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor()}`}>
          {item.priority}
        </span>
      </div>

      {/* Title and Description */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
      <p className="text-gray-600 mb-4">{item.description}</p>

      {/* Progress Bar */}
      {item.status !== "planned" && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-gray-900">{item.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${item.progress}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(item.startDate).toLocaleDateString()}</span>
        </div>
        <span>→</span>
        <span>{new Date(item.endDate).toLocaleDateString()}</span>
      </div>

      {/* Contributors */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          {item.contributors} {item.contributors === 1 ? "contributor" : "contributors"}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const FilterButton: React.FC<{
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

const RoadmapVisualization: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredItems = ROADMAP_DATA.filter((item) => {
    const categoryMatch = filter === "all" || item.category === filter;
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  const stats = {
    completed: ROADMAP_DATA.filter(item => item.status === "completed").length,
    inProgress: ROADMAP_DATA.filter(item => item.status === "in-progress").length,
    planned: ROADMAP_DATA.filter(item => item.status === "planned").length,
    totalContributors: ROADMAP_DATA.reduce((sum, item) => sum + item.contributors, 0)
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2 fill-current" />
          <h3 className="text-2xl font-bold text-green-700">{stats.completed}</h3>
          <p className="text-green-600 text-sm">Completed</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-blue-700">{stats.inProgress}</h3>
          <p className="text-blue-600 text-sm">In Progress</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <Circle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-700">{stats.planned}</h3>
          <p className="text-gray-600 text-sm">Planned</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
          <Users className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-primary">{stats.totalContributors}</h3>
          <p className="text-primary text-sm">Contributors</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </FilterButton>
            <FilterButton
              active={filter === "features"}
              onClick={() => setFilter("features")}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Features
            </FilterButton>
            <FilterButton
              active={filter === "infrastructure"}
              onClick={() => setFilter("infrastructure")}
            >
              <Code className="w-4 h-4 mr-1" />
              Infrastructure
            </FilterButton>
            <FilterButton
              active={filter === "community"}
              onClick={() => setFilter("community")}
            >
              <Users className="w-4 h-4 mr-1" />
              Community
            </FilterButton>
            <FilterButton
              active={filter === "docs"}
              onClick={() => setFilter("docs")}
            >
              <Target className="w-4 h-4 mr-1" />
              Documentation
            </FilterButton>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter by Status</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            >
              All Status
            </FilterButton>
            <FilterButton
              active={statusFilter === "completed"}
              onClick={() => setStatusFilter("completed")}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </FilterButton>
            <FilterButton
              active={statusFilter === "in-progress"}
              onClick={() => setStatusFilter("in-progress")}
            >
              <Clock className="w-4 h-4 mr-1" />
              In Progress
            </FilterButton>
            <FilterButton
              active={statusFilter === "planned"}
              onClick={() => setStatusFilter("planned")}
            >
              <Circle className="w-4 h-4 mr-1" />
              Planned
            </FilterButton>
          </div>
        </div>
      </motion.div>

      {/* Roadmap Items */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredItems.map((item, index) => (
          <RoadmapCard key={item.id} item={item} index={index} />
        ))}
      </motion.div>

      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No items match the current filters</p>
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
          Want to contribute to our roadmap?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our community and help shape the future of OptiBlogAi. Every contribution matters!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/solve-ease/OptiBlogAi/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            View Issues
          </a>
          <a
            href="https://github.com/solve-ease/OptiBlogAi/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            <Users className="w-5 h-5" />
            Join Discussion
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default RoadmapVisualization;