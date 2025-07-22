'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { SEOScores } from '../../../types/blog';

interface QualityAssessmentPanelProps {
  scores: SEOScores;
}

interface ScoreMetric {
  label: string;
  value: number;
  icon: any;
  color: string;
  description: string;
}

export function QualityAssessmentPanel({ scores }: QualityAssessmentPanelProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return XCircle;
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const metrics: ScoreMetric[] = [
    {
      label: 'Title Optimization',
      value: scores.title_score,
      icon: Target,
      color: getScoreColor(scores.title_score),
      description: 'SEO-friendly title structure and keyword placement'
    },
    {
      label: 'Meta Description',
      value: scores.meta_description_score,
      icon: FileText,
      color: getScoreColor(scores.meta_description_score),
      description: 'Meta description quality and length optimization'
    },
    {
      label: 'Keyword Optimization',
      value: scores.keyword_optimization_score,
      icon: TrendingUp,
      color: getScoreColor(scores.keyword_optimization_score),
      description: 'Strategic keyword usage and density'
    },
    {
      label: 'Content Structure',
      value: scores.content_structure_score,
      icon: BarChart3,
      color: getScoreColor(scores.content_structure_score),
      description: 'Heading hierarchy and content organization'
    },
    {
      label: 'Readability',
      value: scores.readability_score,
      icon: CheckCircle,
      color: getScoreColor(scores.readability_score),
      description: 'Content readability and user experience'
    },
    {
      label: 'Technical SEO',
      value: scores.technical_seo_score,
      icon: Clock,
      color: getScoreColor(scores.technical_seo_score),
      description: 'Technical optimization factors'
    }
  ];

  const overallGrade = scores.final_score >= 90 ? 'A' :
                      scores.final_score >= 80 ? 'B' :
                      scores.final_score >= 70 ? 'C' :
                      scores.final_score >= 60 ? 'D' : 'F';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Content Quality Assessment</h3>
        
        {/* Overall Score */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`text-3xl font-bold px-4 py-2 rounded-full ${getGradeColor(overallGrade)}`}>
            {overallGrade}
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(scores.final_score)}%
            </div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">
              {scores.word_count.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Words</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">
              {scores.reading_time_minutes}min
            </div>
            <div className="text-xs text-gray-600">Read Time</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">
              {(scores.keyword_density * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Keyword Density</div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Detailed Analysis</h4>
        
        {metrics.map((metric, index) => {
          const IconComponent = getScoreIcon(metric.value);
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${metric.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <metric.icon className="h-5 w-5" />
                  <span className="font-semibold">{metric.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{Math.round(metric.value)}%</span>
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className="h-2 rounded-full bg-current opacity-60"
                />
              </div>
              
              <p className="text-sm opacity-80">{metric.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="font-semibold text-indigo-900 mb-2">Quick Recommendations</h4>
        <ul className="space-y-1 text-sm text-indigo-800">
          {scores.title_score < 80 && (
            <li>• Consider optimizing your title for better keyword placement</li>
          )}
          {scores.meta_description_score < 80 && (
            <li>• Improve meta description length and keyword usage</li>
          )}
          {scores.readability_score < 80 && (
            <li>• Break up long paragraphs for better readability</li>
          )}
          {scores.content_structure_score < 80 && (
            <li>• Add more subheadings to improve content structure</li>
          )}
          {scores.final_score >= 80 && (
            <li>• Great work! Your content is well-optimized for SEO</li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}