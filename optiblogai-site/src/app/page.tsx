'use client';

import React from 'react';

import HeroSection from './components/homepage/HeroSection';
import ValuePropositionGrid from './components/homepage/ValuePropositionGrid';
import LiveStatsPanel from './components/homepage/LiveStatsPanel';
import FeatureHighlights from './components/homepage/FeatureHighlights';
import GettingStartedCTA from './components/homepage/GettingStartedCTA';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      

      {/* Main Content */}
      <main>
        {/* Hero Section with animated background and CTA */}
        <HeroSection />

        {/* Value Proposition Grid - Core benefits with icons */}
        <ValuePropositionGrid />

        {/* Live Stats Panel - Real-time GitHub metrics */}
        <LiveStatsPanel />

        {/* Feature Highlights - Interactive feature carousel */}
        <FeatureHighlights />

        {/* Getting Started CTA - Step-by-step guide */}
        <GettingStartedCTA />
      </main>

    </div>
  );
};

export default HomePage;