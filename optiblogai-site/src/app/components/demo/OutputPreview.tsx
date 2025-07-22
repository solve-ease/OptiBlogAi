'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Code, 
  FileText, 
  Copy, 
  Check,
  ExternalLink,
  Maximize2
} from 'lucide-react';
import { BlogGenerationResponse } from '../../../types/blog';

interface OutputPreviewProps {
  content: BlogGenerationResponse;
}

type ViewMode = 'preview' | 'html' | 'raw';

export function OutputPreview({ content }: OutputPreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = async () => {
    const textToCopy = viewMode === 'html' ? content.final_blog :
                      viewMode === 'raw' ? JSON.stringify(content, null, 2) :
                      content.final_blog.replace(/<[^>]*>/g, ''); // Strip HTML for preview mode

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'preview':
        return (
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content.final_blog }}
          />
        );
      
      case 'html':
        return (
          <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
            <code>{content.final_blog}</code>
          </pre>
        );
      
      case 'raw':
        return (
          <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
            <code>{JSON.stringify(content, null, 2)}</code>
          </pre>
        );
      
      default:
        return null;
    }
  };

  const viewModes = [
    { key: 'preview' as ViewMode, label: 'Preview', icon: Eye },
    { key: 'html' as ViewMode, label: 'HTML', icon: Code },
    { key: 'raw' as ViewMode, label: 'Raw JSON', icon: FileText }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-bold text-gray-900">Generated Content</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Grade: {content.content_quality_grade}
              </span>
              <span className="text-gray-400">•</span>
              <span>{content.seo_scores.word_count.toLocaleString()} words</span>
              <span className="text-gray-400">•</span>
              <span>{content.estimated_reading_time}min read</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="flex items-center space-x-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Maximize2 className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex space-x-1 mt-4">
          {viewModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === mode.key
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <mode.icon className="h-4 w-4" />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Display */}
      <div className={`p-6 overflow-auto ${isFullscreen ? 'max-h-[calc(100vh-200px)]' : 'max-h-96'}`}>
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>Run ID: {content.run_id.substring(0, 8)}...</span>
            <span>Status: {content.status}</span>
            <span>Attempts: {content.attempts}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Model: {content.metadata.model_used}</span>
            <span>Processing: {content.metadata.processing_time_seconds}s</span>
          </div>
        </div>
      </div>

      {/* Fullscreen overlay background */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </motion.div>
  );
}