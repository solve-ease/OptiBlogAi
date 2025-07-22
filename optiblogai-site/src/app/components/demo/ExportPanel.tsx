'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Code, 
  Share2, 
  Mail, 
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { BlogGenerationResponse } from '../../../types/blog';

interface ExportPanelProps {
  content: BlogGenerationResponse;
}

type ExportFormat = 'markdown' | 'html' | 'json' | 'text';

export function ExportPanel({ content }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');
  const [copied, setCopied] = useState<string | null>(null);

  const formats = [
    { 
      key: 'markdown' as ExportFormat, 
      label: 'Markdown', 
      icon: FileText, 
      extension: 'md',
      description: 'Clean markdown format for blogs'
    },
    { 
      key: 'html' as ExportFormat, 
      label: 'HTML', 
      icon: Code, 
      extension: 'html',
      description: 'Ready-to-use HTML code'
    },
    { 
      key: 'json' as ExportFormat, 
      label: 'JSON', 
      icon: Code, 
      extension: 'json',
      description: 'Complete API response data'
    },
    { 
      key: 'text' as ExportFormat, 
      label: 'Plain Text', 
      icon: FileText, 
      extension: 'txt',
      description: 'Clean text without formatting'
    }
  ];

  const getContentByFormat = (format: ExportFormat): string => {
    switch (format) {
      case 'markdown':
        // Convert HTML to Markdown (safe conversion)
        if (typeof window !== 'undefined') {
          // Use DOM parsing for safer HTML processing in browser environment
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = content.final_blog;
          
          // Process each element safely
          const markdown = tempDiv.innerHTML
            .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (_, level, content) => '#'.repeat(parseInt(level)) + ' ' + content + '\n\n')
            .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
            .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
            .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
            .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
            .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '') // Remove any remaining tags
            .replace(/&[a-zA-Z0-9#]+;/g, (match) => {
              const entityMap: { [key: string]: string } = {
                '&nbsp;': ' ',
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#039;': "'",
                '&apos;': "'"
              };
              return entityMap[match] || match;
            })
            .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
            .trim();
            
          return markdown;
        }
        // Server-side fallback with safer regex patterns
        return content.final_blog
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
          .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (_, level, content) => '#'.repeat(parseInt(level)) + ' ' + content + '\n\n')
          .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
          .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
          .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
          .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
          .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
          .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '') // Remove remaining tags
          .replace(/&[a-zA-Z0-9#]+;/g, (match) => {
            const entityMap: { [key: string]: string } = {
              '&nbsp;': ' ',
              '&amp;': '&',
              '&lt;': '<',
              '&gt;': '>',
              '&quot;': '"',
              '&#039;': "'",
              '&apos;': "'"
            };
            return entityMap[match] || match;
          })
          .replace(/\n{3,}/g, '\n\n')
          .trim();
      
      case 'html':
        return content.final_blog;
      
      case 'json':
        return JSON.stringify(content, null, 2);
      
      case 'text':
        // Use DOM parsing for safe HTML tag removal in browser environment
        if (typeof window !== 'undefined') {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = content.final_blog;
          return tempDiv.textContent || tempDiv.innerText || '';
        }
        // Fallback for server-side rendering - more comprehensive regex cleanup
        return content.final_blog
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags entirely
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style tags entirely  
          .replace(/<[^>]+>/g, '') // Remove remaining HTML tags
          .replace(/&[a-zA-Z0-9#]+;/g, (match) => {
            // Decode common HTML entities
            const entityMap: { [key: string]: string } = {
              '&nbsp;': ' ',
              '&amp;': '&',
              '&lt;': '<',
              '&gt;': '>',
              '&quot;': '"',
              '&#039;': "'",
              '&apos;': "'"
            };
            return entityMap[match] || match;
          })
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      
      default:
        return content.final_blog;
    }
  };

  const handleCopy = async (format: ExportFormat) => {
    const contentToCopy = getContentByFormat(format);
    
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (format: ExportFormat) => {
    const contentToDownload = getContentByFormat(format);
    const formatData = formats.find(f => f.key === format)!;
    const filename = `${content.run_id.substring(0, 8)}_blog_content.${formatData.extension}`;
    
    const blob = new Blob([contentToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Generated Blog Content',
          text: `Check out this AI-generated blog content about ${content.customization_applied.content_type}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      setCopied('url');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('AI-Generated Blog Content');
    const body = encodeURIComponent(
      `I've generated a blog post using OptiBlogAI!\n\n` +
      `Topic: ${content.customization_applied.content_type}\n` +
      `Word Count: ${content.seo_scores.word_count.toLocaleString()}\n` +
      `SEO Score: ${Math.round(content.seo_scores.final_score)}%\n` +
      `Grade: ${content.content_quality_grade}\n\n` +
      `Generated content:\n\n${getContentByFormat('text').substring(0, 500)}...`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      <div className="flex items-center space-x-3">
        <Download className="h-6 w-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900">Export & Share</h3>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Choose Export Format</h4>
        <div className="grid grid-cols-2 gap-3">
          {formats.map((format) => (
            <motion.button
              key={format.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedFormat(format.key)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedFormat === format.key
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <format.icon className={`h-5 w-5 ${
                  selectedFormat === format.key ? 'text-indigo-600' : 'text-gray-600'
                }`} />
                <span className={`font-semibold ${
                  selectedFormat === format.key ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  {format.label}
                </span>
              </div>
              <p className={`text-sm ${
                selectedFormat === format.key ? 'text-indigo-700' : 'text-gray-600'
              }`}>
                {format.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCopy(selectedFormat)}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {copied === selectedFormat ? (
              <>
                <Check className="h-5 w-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span>Copy</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDownload(selectedFormat)}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </motion.button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEmailShare}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </motion.button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">Preview ({selectedFormat})</h4>
        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-auto">
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
            {getContentByFormat(selectedFormat).substring(0, 300)}
            {getContentByFormat(selectedFormat).length > 300 && '...'}
          </pre>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="font-semibold text-indigo-900 mb-2">Content Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-indigo-600">File size:</span>
            <span className="ml-2 font-medium">
              {(new Blob([getContentByFormat(selectedFormat)]).size / 1024).toFixed(1)} KB
            </span>
          </div>
          <div>
            <span className="text-indigo-600">Characters:</span>
            <span className="ml-2 font-medium">
              {getContentByFormat(selectedFormat).length.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-indigo-600">Lines:</span>
            <span className="ml-2 font-medium">
              {getContentByFormat(selectedFormat).split('\n').length}
            </span>
          </div>
          <div>
            <span className="text-indigo-600">Words:</span>
            <span className="ml-2 font-medium">
              {content.seo_scores.word_count.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {copied === 'url' && (
        <div className="text-center text-sm text-green-600 font-medium">
          URL copied to clipboard!
        </div>
      )}
    </motion.div>
  );
}