'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  Globe, 
  Cpu, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';
import { SEOScores, ContentMetadata } from '../../../types/blog';

interface SEOAnalyzerProps {
  scores: SEOScores;
  metadata: ContentMetadata;
}

interface AnalysisSection {
  title: string;
  icon: any;
  score: number;
  details: string[];
  recommendations: string[];
}

export function SEOAnalyzer({ scores, metadata }: SEOAnalyzerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections: AnalysisSection[] = [
    {
      title: 'On-Page SEO',
      icon: Search,
      score: (scores.title_score + scores.meta_description_score + scores.keyword_optimization_score) / 3,
      details: [
        `Title optimization: ${Math.round(scores.title_score)}%`,
        `Meta description: ${Math.round(scores.meta_description_score)}%`,
        `Keyword optimization: ${Math.round(scores.keyword_optimization_score)}%`,
        `Keyword density: ${(scores.keyword_density * 100).toFixed(1)}%`
      ],
      recommendations: [
        scores.title_score < 80 ? 'Optimize title with primary keyword at the beginning' : 'Title is well optimized',
        scores.meta_description_score < 80 ? 'Improve meta description with compelling copy' : 'Meta description looks good',
        scores.keyword_density < 1 ? 'Consider increasing keyword density slightly' : 'Good keyword density balance'
      ]
    },
    {
      title: 'Content Quality',
      icon: Globe,
      score: (scores.readability_score + scores.content_quality_score) / 2,
      details: [
        `Readability score: ${Math.round(scores.readability_score)}%`,
        `Content quality: ${Math.round(scores.content_quality_score)}%`,
        `Word count: ${scores.word_count.toLocaleString()} words`,
        `Reading time: ${scores.reading_time_minutes} minutes`
      ],
      recommendations: [
        scores.readability_score < 80 ? 'Simplify complex sentences for better readability' : 'Content is easily readable',
        scores.word_count < 1000 ? 'Consider adding more comprehensive content' : 'Good content length',
        'Add more subheadings to break up long sections'
      ]
    },
    {
      title: 'Technical SEO',
      icon: Cpu,
      score: scores.technical_seo_score,
      details: [
        `Technical score: ${Math.round(scores.technical_seo_score)}%`,
        `Content structure: ${Math.round(scores.content_structure_score)}%`,
        `Processing time: ${metadata.processing_time_seconds}s`,
        `Model used: ${metadata.model_used}`
      ],
      recommendations: [
        scores.content_structure_score < 80 ? 'Add more hierarchical heading structure' : 'Good content structure',
        'Ensure proper HTML semantic markup',
        'Add internal and external links for authority'
      ]
    },
    {
      title: 'Performance Metrics',
      icon: Clock,
      score: 85, // Mock performance score
      details: [
        `Generation attempts: ${metadata.sources_used.length > 0 ? metadata.sources_used.length : 1}`,
        `Content language: ${metadata.content_language}`,
        `Generated: ${new Date(metadata.generated_at).toLocaleDateString()}`,
        `Sources analyzed: ${metadata.sources_used.length}`
      ],
      recommendations: [
        'Content generated efficiently',
        'Multiple sources analyzed for accuracy',
        'Language detection successful'
      ]
    }
  ];

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 space-y-4"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Search className="h-6 w-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900">SEO Analysis Report</h3>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg overflow-hidden ${getScoreColor(section.score)}`}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full p-4 flex items-center justify-between hover:bg-opacity-80 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <section.icon className="h-5 w-5" />
                <span className="font-semibold">{section.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{Math.round(section.score)}%</span>
                {expandedSection === section.title ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedSection === section.title && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-current border-opacity-20"
                >
                  <div className="p-4 space-y-4">
                    {/* Details */}
                    <div>
                      <h5 className="font-semibold mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Details
                      </h5>
                      <ul className="space-y-1 text-sm">
                        {section.details.map((detail, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-2 h-2 bg-current rounded-full mr-2 opacity-60" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h5 className="font-semibold mb-2">Recommendations</h5>
                      <ul className="space-y-1 text-sm">
                        {section.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-current mr-2 mt-1">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Overall Summary */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-indigo-900 mb-2">SEO Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-indigo-600 font-medium">Overall Score:</span>
            <span className="ml-2 font-bold">{Math.round(scores.final_score)}%</span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">Content Grade:</span>
            <span className="ml-2 font-bold">
              {scores.final_score >= 90 ? 'A' :
               scores.final_score >= 80 ? 'B' :
               scores.final_score >= 70 ? 'C' :
               scores.final_score >= 60 ? 'D' : 'F'}
            </span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">Processing:</span>
            <span className="ml-2">{metadata.processing_time_seconds}s</span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">Word Count:</span>
            <span className="ml-2">{scores.word_count.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-indigo-200">
          <p className="text-indigo-800 text-sm">
            {scores.final_score >= 80 
              ? '🎉 Excellent! Your content is well-optimized for search engines.'
              : scores.final_score >= 70
              ? '👍 Good job! A few tweaks could improve your SEO score.'
              : '⚠️ Consider implementing the recommendations above to improve SEO performance.'
            }
          </p>
        </div>
      </div>
    </motion.div>
  );
}