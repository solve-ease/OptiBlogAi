"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Target, CheckCircle, AlertCircle, Eye } from "lucide-react";

const SEOOptimizationPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [seoScore, setSeoScore] = useState(0);
  const [keywordDensity, setKeywordDensity] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);

  const tabs = [
    { id: "keywords", label: "Keywords", icon: Target },
    { id: "meta", label: "Meta Tags", icon: Search },
    { id: "readability", label: "Readability", icon: Eye },
    { id: "serp", label: "SERP Preview", icon: TrendingUp },
  ];

  const keywords = [
    { word: "AI content", density: 2.3, status: "optimal" },
    { word: "SEO optimization", density: 1.8, status: "good" },
    { word: "blog writing", density: 3.2, status: "high" },
    { word: "content marketing", density: 1.5, status: "good" },
  ];

  const metaTags = [
    { tag: "Title", value: "AI-Powered Content Generation Tool", status: "optimal", length: 34 },
    { tag: "Description", value: "Create SEO-optimized content with AI assistance", status: "good", length: 47 },
    { tag: "Keywords", value: "ai, content, seo, writing", status: "optimal", length: 25 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSeoScore(87);
      setKeywordDensity(78);
      setReadabilityScore(92);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "text-green-600 bg-green-50 border-green-200";
      case "good": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "optimal" || status === "good" ? CheckCircle : AlertCircle;
  };

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-emerald-50 to-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <motion.div
            className="flex items-center space-x-2 text-xs font-medium text-gray-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Search className="w-4 h-4 text-emerald-500" />
            <span>SEO Analyzer</span>
          </motion.div>
        </div>

        {/* SEO Score Dashboard */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">SEO Score</h3>
            <motion.div
              className="text-2xl font-bold text-emerald-600"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
            >
              {seoScore}%
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Keyword Density</span>
              <span className="text-emerald-600 font-medium">{keywordDensity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${keywordDensity}%` }}
                transition={{ delay: 1.2, duration: 1 }}
              />
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Readability</span>
              <span className="text-emerald-600 font-medium">{readabilityScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${readabilityScore}%` }}
                transition={{ delay: 1.4, duration: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(index)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                activeTab === index
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 min-h-[120px]">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="keywords"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                {keywords.map((keyword, index) => {
                  const StatusIcon = getStatusIcon(keyword.status);
                  return (
                    <motion.div
                      key={keyword.word}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-800">{keyword.word}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">{keyword.density}%</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(keyword.status)}`}>
                          {keyword.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="meta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {metaTags.map((meta, index) => (
                  <motion.div
                    key={meta.tag}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-700">{meta.tag}</span>
                      <span className="text-xs text-gray-500">{meta.length} chars</span>
                    </div>
                    <div className="text-sm text-gray-800 truncate">{meta.value}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="readability"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <div className="text-lg font-bold text-emerald-600">8.2</div>
                    <div className="text-xs text-emerald-700">Reading Level</div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                    <div className="text-lg font-bold text-green-600">156</div>
                    <div className="text-xs text-green-700">Avg Words/Sentence</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="text-sm text-gray-700">
                    <strong>Flesch Score:</strong> 68 (Standard)
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Easy to read for 13-15 year old students
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div
                key="serp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
                    AI-Powered Content Generation Tool - Best SEO Writer
                  </div>
                  <div className="text-green-600 text-xs mt-1">
                    https://yoursite.com/ai-content-generator
                  </div>
                  <div className="text-gray-600 text-xs mt-1">
                    Create SEO-optimized content with AI assistance. Generate high-quality blog posts, articles, and marketing copy in seconds...
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SEOOptimizationPreview;