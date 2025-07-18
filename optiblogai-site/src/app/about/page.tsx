"use client";

import React from "react";
import { motion } from "framer-motion";
import EthicalPrinciples from "../components/about/EthicalPrinciples";
import TeamShowcase from "../components/about/TeamShowcase";
import AdoptionMap from "../components/about/AdoptionMap";
import PressKit from "../components/about/PressKit";

/**
 * About Page - Modern minimalist design showcasing OptiBlogAi's values, team, and impact
 * Features dynamic animated shapes and real-time data integration
 */
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with animated background */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-secondary/15 rounded-full blur-lg"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/2 w-40 h-40 bg-accent/8 rounded-full blur-2xl"
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -20, 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                OptiBlogAi
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Empowering content creators with ethical AI technology that transforms how we think about 
              blog optimization, SEO, and digital storytelling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="relative">
        {/* Ethical Principles Section */}
        <EthicalPrinciples />

        {/* Team Showcase Section */}
        <TeamShowcase />

        {/* Adoption Map Section */}
        <AdoptionMap />

        {/* Press Kit Section */}
        <PressKit />
      </main>
    </div>
  );
};

export default AboutPage;