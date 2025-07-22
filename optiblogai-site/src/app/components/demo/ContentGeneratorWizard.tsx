'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Settings, 
  Target, 
  FileText, 
  BarChart3,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';

import { BlogGenerationRequest, BlogGenerationResponse, BlogCustomization } from '../../../types/blog';
import { LoadingStateDisplay } from './LoadingStateDisplay';
import { QualityAssessmentPanel } from './QualityAssessmentPanel';
import { SEOAnalyzer } from './SEOAnalyzer';
import { OutputPreview } from './OutputPreview';
import { ExportPanel } from './ExportPanel';

interface GenerationStep {
  id: number;
  title: string;
  icon: any;
  completed: boolean;
  active: boolean;
}

export function ContentGeneratorWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<BlogGenerationResponse | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<BlogGenerationRequest>({
    keyword: '',
    max_attempts: 3,
    seo_threshold: 75,
    customization: {
      tone: 'professional',
      target_audience: 'general',
      content_type: 'guide',
      word_count_target: 1500,
      include_faq: true,
      include_conclusion: true,
      include_table_of_contents: true,
      focus_keywords: [],
      exclude_domains: []
    },
    priority: 'normal'
  });

  const steps: GenerationStep[] = [
    { id: 0, title: 'Topic & Keywords', icon: Target, completed: false, active: true },
    { id: 1, title: 'Customization', icon: Settings, completed: false, active: false },
    { id: 2, title: 'Generate Content', icon: Wand2, completed: false, active: false },
    { id: 3, title: 'Review & Export', icon: Download, completed: false, active: false }
  ];

  const [stepsState, setStepsState] = useState(steps);

  const updateStep = (stepId: number, updates: Partial<GenerationStep>) => {
    setStepsState(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const handleNext = () => {
    if (currentStep < stepsState.length - 1) {
      updateStep(currentStep, { completed: true, active: false });
      updateStep(currentStep + 1, { active: true });
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      updateStep(currentStep, { active: false });
      updateStep(currentStep - 1, { active: true, completed: false });
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!formData.keyword.trim()) {
      setError('Please enter a keyword or topic');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const result: BlogGenerationResponse = await response.json();
      setGeneratedContent(result);
      handleNext(); // Move to review step
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="keyword" className="block text-sm font-semibold text-gray-700 mb-2">
                Main Topic or Keyword *
              </label>
              <input
                type="text"
                id="keyword"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                placeholder="e.g., Machine Learning for Beginners"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="max_attempts" className="block text-sm font-semibold text-gray-700 mb-2">
                  Generation Attempts
                </label>
                <select
                  id="max_attempts"
                  value={formData.max_attempts}
                  onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={1}>1 attempt</option>
                  <option value={2}>2 attempts</option>
                  <option value={3}>3 attempts</option>
                  <option value={5}>5 attempts</option>
                </select>
              </div>

              <div>
                <label htmlFor="seo_threshold" className="block text-sm font-semibold text-gray-700 mb-2">
                  SEO Score Threshold
                </label>
                <select
                  id="seo_threshold"
                  value={formData.seo_threshold}
                  onChange={(e) => setFormData({ ...formData, seo_threshold: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={60}>60% (Basic)</option>
                  <option value={70}>70% (Good)</option>
                  <option value={75}>75% (Very Good)</option>
                  <option value={80}>80% (Excellent)</option>
                  <option value={90}>90% (Perfect)</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="tone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Writing Tone
                </label>
                <select
                  id="tone"
                  value={formData.customization?.tone}
                  onChange={(e) => setFormData({
                    ...formData,
                    customization: { ...formData.customization!, tone: e.target.value as any }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="technical">Technical</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                </select>
              </div>

              <div>
                <label htmlFor="target_audience" className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  id="target_audience"
                  value={formData.customization?.target_audience}
                  onChange={(e) => setFormData({
                    ...formData,
                    customization: { ...formData.customization!, target_audience: e.target.value as any }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="beginners">Beginners</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label htmlFor="content_type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  id="content_type"
                  value={formData.customization?.content_type}
                  onChange={(e) => setFormData({
                    ...formData,
                    customization: { ...formData.customization!, content_type: e.target.value as any }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="guide">Guide</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="review">Review</option>
                  <option value="comparison">Comparison</option>
                  <option value="news">News</option>
                  <option value="opinion">Opinion</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="word_count" className="block text-sm font-semibold text-gray-700 mb-2">
                Target Word Count: {formData.customization?.word_count_target}
              </label>
              <input
                type="range"
                id="word_count"
                min="800"
                max="5000"
                step="100"
                value={formData.customization?.word_count_target}
                onChange={(e) => setFormData({
                  ...formData,
                  customization: { ...formData.customization!, word_count_target: parseInt(e.target.value) }
                })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>800 words</span>
                <span>5000 words</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Content Sections</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.customization?.include_table_of_contents}
                    onChange={(e) => setFormData({
                      ...formData,
                      customization: { ...formData.customization!, include_table_of_contents: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Table of Contents</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.customization?.include_faq}
                    onChange={(e) => setFormData({
                      ...formData,
                      customization: { ...formData.customization!, include_faq: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">FAQ Section</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.customization?.include_conclusion}
                    onChange={(e) => setFormData({
                      ...formData,
                      customization: { ...formData.customization!, include_conclusion: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Conclusion</span>
                </label>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-6"
          >
            {isGenerating ? (
              <LoadingStateDisplay />
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
                  <Wand2 className="mx-auto h-16 w-16 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Ready to Generate!</h3>
                  <p className="text-indigo-100 mb-6">
                    Click below to create your SEO-optimized blog post about &quot;{formData.keyword}&quot;
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerate}
                    className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Generate Blog Content
                  </motion.button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 text-red-700">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );

      case 3:
        return generatedContent ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <OutputPreview content={generatedContent} />
              </div>
              <div className="space-y-6">
                <QualityAssessmentPanel scores={generatedContent.seo_scores} />
                <SEOAnalyzer 
                  scores={generatedContent.seo_scores} 
                  metadata={generatedContent.metadata}
                />
                <ExportPanel content={generatedContent} />
              </div>
            </div>
          </motion.div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Step Progress */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {stepsState.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                ${step.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : step.active 
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }
              `}>
                <step.icon className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-semibold ${
                  step.active ? 'text-indigo-600' : step.completed ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < stepsState.length - 1 && (
                <div className="ml-6 w-16 border-t-2 border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </motion.button>

        {currentStep < 2 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Next
          </motion.button>
        )}

        {currentStep === 3 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentStep(0);
              setGeneratedContent(null);
              setStepsState(steps);
              setFormData({
                ...formData,
                keyword: '',
              });
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start New Generation
          </motion.button>
        )}
      </div>
    </div>
  );
}