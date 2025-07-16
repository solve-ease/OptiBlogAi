"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, TrendingUp, Users, Eye, Clock, Target } from "lucide-react";

const PerformanceAnalyticsPreview: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState(0);
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const metrics = [
    {
      id: "views",
      label: "Page Views",
      value: "24.3K",
      change: "+12.5%",
      icon: Eye,
      color: "text-amber-600",
    },
    {
      id: "engagement",
      label: "Engagement",
      value: "68%",
      change: "+8.2%",
      icon: Users,
      color: "text-orange-600",
    },
    {
      id: "time",
      label: "Avg. Time",
      value: "3:42",
      change: "+15.3%",
      icon: Clock,
      color: "text-amber-700",
    },
    {
      id: "conversion",
      label: "Conversion",
      value: "4.8%",
      change: "+22.1%",
      icon: Target,
      color: "text-orange-700",
    },
  ];

  const testResults = [
    { variant: "Headline A", performance: 76, color: "bg-amber-500" },
    { variant: "Headline B", performance: 92, color: "bg-orange-500" },
    { variant: "Headline C", performance: 68, color: "bg-yellow-500" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData([45, 78, 52, 89, 67, 94, 73]);
      setIsAnimating(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const contentScores = [
    { title: "Blog Post: AI Trends 2024", score: 94, trend: "up" },
    { title: "Guide: Content Marketing", score: 87, trend: "up" },
    { title: "Article: SEO Best Practices", score: 92, trend: "stable" },
    { title: "Tutorial: Writing Tips", score: 78, trend: "down" },
  ];

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-amber-50 to-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-xl"
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
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-xl"
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
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <span>Analytics Dashboard</span>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              className={`bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md ${
                activeMetric === index ? "ring-2 ring-amber-500/50" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveMetric(index)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600 mb-1">
                    {metric.label}
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {metric.value}
                  </div>
                </div>
                <div className="text-right">
                  <metric.icon className={`w-5 h-5 ${metric.color} mb-1`} />
                  <div className="text-xs text-green-600 font-medium">
                    {metric.change}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Visualization */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Performance Trend
            </h3>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600 font-medium">+18.7%</span>
            </div>
          </div>

          <div className="flex items-end space-x-2 h-16">
            {chartData.map((value, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-sm flex-1 min-w-0"
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              />
            ))}
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* A/B Testing Results */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            A/B Test Results
          </h3>
          <div className="space-y-2">
            {testResults.map((test, index) => (
              <motion.div
                key={test.variant}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${test.color}`} />
                  <span className="text-xs text-gray-700">{test.variant}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${test.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${test.performance}%` }}
                      transition={{ delay: 1.7 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-800">
                    {test.performance}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Success Indicator */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 2, type: "spring" }}
          >
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerformanceAnalyticsPreview;
