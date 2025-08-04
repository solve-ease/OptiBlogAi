"use client";

import React from "react";
import { Zap, Code, Database, Globe, Users, ArrowRight, ExternalLink } from "lucide-react";

const OverviewSection: React.FC = () => {
  return (
    <div className="prose prose-indigo max-w-none">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Welcome to OptiBlogAi Documentation
        </h1>
        <p className="text-xl text-indigo-100 mb-6">
          Your comprehensive guide to building, deploying, and extending OptiBlogAi - 
          the AI-powered SEO content generation platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/demo"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Try Live Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
          <a
            href="https://github.com/solve-ease/OptiBlogAi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
          >
            View on GitHub
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>

      {/* What is OptiBlogAi */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What is OptiBlogAi?</h2>
        <p className="text-lg text-gray-700 mb-6">
          OptiBlogAi is an open-source AI system that generates high-quality, SEO-optimized blog content 
          through a multi-phase content production pipeline. By scraping top-ranking content, generating 
          original articles with LLMs, and implementing a rigorous quality assessment loop, OptiBlogAi 
          produces content engineered for search engine visibility and reader engagement.
        </p>
        
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
          <div className="flex">
            <Zap className="h-6 w-6 text-amber-400 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Core Innovation</h3>
              <p className="text-amber-700">
                OptiBlogAi&apos;s unique breakeven assessment loop ensures content meets quality thresholds 
                before publication, combining AI generation with SEO science to create content that ranks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Automated Content Research</h3>
            </div>
            <p className="text-gray-600">
              Scrapes and analyzes top-ranking content for target keywords using advanced web scraping 
              with Playwright and content extraction.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-emerald-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">LLM-Powered Generation</h3>
            </div>
            <p className="text-gray-600">
              Creates original blog posts using advanced prompt engineering with Groq and Gemini AI models 
              orchestrated through LangGraph workflows.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-amber-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Quality Assurance Loop</h3>
            </div>
            <p className="text-gray-600">
              Multi-phase assessment system with iterative improvements ensuring content meets 
              SEO and quality standards before publication.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Code className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Extensible Architecture</h3>
            </div>
            <p className="text-gray-600">
              Modular design supporting multiple LLM providers, custom SEO scoring algorithms, 
              and flexible deployment options.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology Stack</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Frontend */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
              <Globe className="h-6 w-6 mr-2" />
              Frontend
            </h3>
            <ul className="space-y-2 text-indigo-800">
              <li>• <strong>Next.js 15</strong> - React framework with app router</li>
              <li>• <strong>TypeScript</strong> - Type-safe development</li>
              <li>• <strong>Tailwind CSS</strong> - Utility-first styling</li>
              <li>• <strong>Framer Motion</strong> - Smooth animations</li>
              <li>• <strong>Lucide Icons</strong> - Modern icon library</li>
            </ul>
          </div>

          {/* Backend */}
          <div className="bg-emerald-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center">
              <Database className="h-6 w-6 mr-2" />
              Backend & AI
            </h3>
            <ul className="space-y-2 text-emerald-800">
              <li>• <strong>FastAPI</strong> - Modern Python web framework</li>
              <li>• <strong>LangGraph</strong> - Workflow orchestration</li>
              <li>• <strong>Groq & Gemini</strong> - LLM providers</li>
              <li>• <strong>Playwright</strong> - Web scraping</li>
              <li>• <strong>LangSmith</strong> - AI observability</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
        
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clone & Setup</h3>
              <p className="text-gray-600 text-sm">
                Clone the repository and set up both frontend and backend environments
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure APIs</h3>
              <p className="text-gray-600 text-sm">
                Set up your API keys for Groq, Gemini, and other required services
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Creating</h3>
              <p className="text-gray-600 text-sm">
                Use the demo interface or API endpoints to generate your first blog post
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="#installation"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View Installation Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Community</h2>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 mr-3" />
            <h3 className="text-2xl font-semibold">Open Source & Community Driven</h3>
          </div>
          <p className="text-lg mb-6 text-purple-100">
            OptiBlogAi is built by developers, for developers. Join our growing community 
            of contributors and help shape the future of AI-powered content creation.
          </p>
          <div className="flex flex-wrap gap-4 text-gray-700 font-semibold">
            <a
              href="https://github.com/solve-ease/OptiBlogAi/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              Report Issues
            </a>
            <a
              href="https://github.com/solve-ease/OptiBlogAi/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              Join Discussions
            </a>
            <a
              href="/community"
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              Community Page
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverviewSection;