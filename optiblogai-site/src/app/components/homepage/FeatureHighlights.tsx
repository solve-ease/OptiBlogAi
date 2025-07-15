"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  points: string[];
  color: string;
}

const FeatureHighlights: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const features: Feature[] = [
    {
      id: "ai-generation",
      title: "AI-Powered Content Generation",
      description:
        "Generate high-quality, SEO-optimized blog posts in seconds using advanced AI algorithms",
      image: "/api/placeholder/600/400",
      points: [
        "Multiple writing styles and tones",
        "Custom templates and formats",
        "Real-time content suggestions",
        "Plagiarism detection",
      ],
      color: "bg-gradient-to-br from-[var(--color-primary)] to-blue-600",
    },
    {
      id: "seo-optimization",
      title: "Advanced SEO Optimization",
      description:
        "Optimize your content for search engines with built-in SEO analysis and recommendations",
      image: "/api/placeholder/600/400",
      points: [
        "Keyword density analysis",
        "Meta tag optimization",
        "Readability scoring",
        "SERP preview",
      ],
      color: "bg-gradient-to-br from-[var(--color-secondary)] to-green-600",
    },
    {
      id: "analytics",
      title: "Performance Analytics",
      description:
        "Track your content performance and optimize your strategy with detailed analytics",
      image: "/api/placeholder/600/400",
      points: [
        "Real-time performance metrics",
        "A/B testing capabilities",
        "Content scoring system",
        "Growth insights",
      ],
      color: "bg-gradient-to-br from-[var(--color-accent)] to-orange-600",
    },
    {
      id: "collaboration",
      title: "Team Collaboration",
      description:
        "Work together with your team to create and optimize content efficiently",
      image: "/api/placeholder/600/400",
      points: [
        "Real-time collaboration",
        "Version control system",
        "Comment and review system",
        "Role-based permissions",
      ],
      color: "bg-gradient-to-br from-purple-600 to-pink-600",
    },
  ];

  const nextFeature = () => {
    setActiveFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setActiveFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Auto-advance features
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      nextFeature();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                display: "inline-block",
              }}
            >
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the comprehensive suite of tools designed to elevate your
            content creation process
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-8">
              <div
                className={cn(
                  "inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4",
                  features[activeFeature].color
                )}
              >
                Feature {activeFeature + 1} of {features.length}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {features[activeFeature].title}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {features[activeFeature].description}
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {features[activeFeature].points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={prevFeature}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={togglePlayPause}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-gray-600" />
                ) : (
                  <Play className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={nextFeature}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Feature Image */}
          <div className="order-1 lg:order-2">
            <Card className="shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={features[activeFeature].image}
                  alt={features[activeFeature].title}
                  className="w-full h-auto object-cover"
                />
              
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
