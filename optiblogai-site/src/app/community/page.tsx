"use client";

import React from "react";
import { motion } from "framer-motion";
import ContributorLeaderboard from "../components/community/ContributorLeaderboard";
import RoadmapVisualization from "../components/community/RoadmapVisualization";
import ContributionCalculator from "../components/community/ContributionCalculator";
import EventCalendar from "../components/community/EventCalendar";
import DiscussionFeed from "../components/community/DiscussionFeed";
import { Users, Target, Calendar, MessageSquare, Star } from "lucide-react";

const CommunityPage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"></div>
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Open Source Community</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6">
              Join Our Community
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect with developers, contribute to the future of AI-powered content optimization, and be part of the open-source revolution.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="https://github.com/solve-ease/OptiBlogAi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Star className="w-5 h-5" />
              Star on GitHub
            </a>
            <a
              href="https://github.com/solve-ease/OptiBlogAi/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <MessageSquare className="w-5 h-5" />
              Join Discussions
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto px-4 py-16 space-y-20"
      >
        {/* Contributor Leaderboard */}
        <motion.section variants={fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Community Champions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the amazing contributors who make OptiBlogAi possible
            </p>
          </div>
          <ContributorLeaderboard />
        </motion.section>

        {/* Roadmap Visualization */}
        <motion.section variants={fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Development Roadmap
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our journey and see what&apos;s coming next
            </p>
          </div>
          <RoadmapVisualization />
        </motion.section>

        {/* Contribution Calculator */}
        <motion.section variants={fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contribution Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Calculate your potential impact and earn community points
            </p>
          </div>
          <ContributionCalculator />
        </motion.section>

        {/* Community Events & Discussions Grid */}
        <motion.div variants={fadeInUp} className="grid lg:grid-cols-2 gap-12">
          {/* Event Calendar */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Upcoming Events
              </h2>
              <p className="text-xl text-gray-600">
                Join our community events and hackathons
              </p>
            </div>
            <EventCalendar />
          </div>

          {/* Discussion Feed */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Latest Discussions
              </h2>
              <p className="text-xl text-gray-600">
                Stay updated with community conversations
              </p>
            </div>
            <DiscussionFeed />
          </div>
        </motion.div>
      </motion.div>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-20 px-4 bg-gradient-to-r from-primary via-secondary to-accent"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Contribute?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Help us build the future of AI-powered content optimization. Every contribution matters!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/solve-ease/OptiBlogAi/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              <Target className="w-5 h-5" />
              Contribution Guide
            </a>
            <a
              href="https://github.com/solve-ease/OptiBlogAi/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              Good First Issues
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CommunityPage;