'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { LOADING_QUOTES, LoadingQuote } from '../../../types/blog';

export function LoadingStateDisplay() {
  const [currentQuote, setCurrentQuote] = useState<LoadingQuote>(LOADING_QUOTES[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let quoteIndex = 0;
    let progressValue = 0;

    const quoteInterval = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % LOADING_QUOTES.length;
      setCurrentQuote(LOADING_QUOTES[quoteIndex]);
    }, 3000); // Change quote every 3 seconds

    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 3 + 1; // Random increment between 1-4
      if (progressValue >= 95) {
        progressValue = 95; // Don't reach 100% until actual completion
        clearInterval(progressInterval);
      }
      setProgress(Math.min(progressValue, 95));
    }, 200); // Update every 200ms

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[currentQuote.icon] || LucideIcons.Loader2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] space-y-8"
    >
      {/* Animated icon */}
      <motion.div
        key={currentQuote.icon}
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.5 }
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-30 scale-150" />
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-full">
          <IconComponent className="h-12 w-12 text-white" />
        </div>
      </motion.div>

      {/* Dynamic quote text */}
      <motion.div
        key={currentQuote.text}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h3 className="text-2xl font-bold text-gray-900">
          Generating Your Blog Post
        </h3>
        <p className="text-lg text-gray-600 max-w-md">
          {currentQuote.text}
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-md space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
          </motion.div>
        </div>
      </div>

      {/* Fun facts or tips while waiting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 max-w-md text-center"
      >
        <p className="text-sm text-indigo-800">
          <span className="font-semibold">💡 Tip:</span> Our AI analyzes thousands of high-ranking articles 
          to ensure your content meets the latest SEO best practices!
        </p>
      </motion.div>

      {/* Floating particles for visual appeal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0
            }}
            animate={{ 
              y: -50,
              opacity: [0, 0.6, 0],
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute w-2 h-2 bg-indigo-400 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}