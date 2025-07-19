"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, PenTool, Brain, CheckCircle } from "lucide-react";

const fullText =
  "AI-Powered Content Generation transforms your ideas into engaging, SEO-optimized blog posts.";

const typingSpeed = 25;

const LiveEditorPreview: React.FC = () => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        setTimeout(() => setShowFeatures(true), 500);
      }
    }, typingSpeed);

    // Return cleanup function
    return () => {
      clearInterval(interval);
    };
  }, []);

  const features = [
    { icon: Brain, text: "AI Analysis", delay: 0.1 },
    { icon: PenTool, text: "Content Optimization", delay: 0.2 },
    { icon: Zap, text: "SEO Enhancement", delay: 0.3 },
    { icon: CheckCircle, text: "Quality Check", delay: 0.4 },
  ];

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
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
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"
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
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>OptiBlogAi is writing</span>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 min-h-[200px] relative">
          {/* Status Indicator */}
          <motion.div
            className="flex items-center space-x-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs text-gray-500 font-medium">
              {isComplete ? "Content Generated" : "AI is writing..."}
            </span>
          </motion.div>

          {/* Typing Content */}
          <div className="relative">
            <motion.div
              className="text-sm text-gray-800 leading-relaxed font-inter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {displayText}
              {!isComplete && (
                <motion.span
                  className="inline-block w-0.5 h-4 bg-blue-500 ml-1"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Completion Effect */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Pills */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, staggerChildren: 0.1 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200/50 shadow-sm"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: feature.delay,
                    type: "spring",
                    stiffness: 300,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <feature.icon className="w-3 h-3" />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: "0%" }}
          animate={{
            width: isComplete
              ? "100%"
              : `${(displayText.length / fullText.length) * 100}%`,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Floating Action Hints */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 1, type: "spring" }}
          >
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveEditorPreview;
