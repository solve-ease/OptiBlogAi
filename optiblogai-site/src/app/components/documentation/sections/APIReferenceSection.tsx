"use client";

import React, { useState } from "react";
import { Server, Code, Copy, CheckCircle, AlertCircle, Info } from "lucide-react";

const APIReferenceSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string>("");

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CopyButton: React.FC<{ text: string; id: string }> = ({ text, id }) => (
    <button
      onClick={() => copyToClipboard(text, id)}
      className="absolute top-3 right-3 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
      title="Copy to clipboard"
    >
      {copiedCode === id ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4 text-gray-600" />
      )}
    </button>
  );

  const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
    const getStatusColor = (status: number) => {
      if (status >= 200 && status < 300) return "bg-green-100 text-green-800";
      if (status >= 400 && status < 500) return "bg-red-100 text-red-800";
      if (status >= 500) return "bg-gray-100 text-gray-800";
      return "bg-blue-100 text-blue-800";
    };

    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">API Reference</h1>
      
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center mb-4">
          <Server className="h-8 w-8 mr-3" />
          <h2 className="text-2xl font-bold text-white">OptiBlogAi REST API</h2>
        </div>
        <p className="text-lg text-blue-100 mb-4">
          Comprehensive API documentation for integrating OptiBlogAi's AI-powered content generation 
          into your applications, tools, and workflows.
        </p>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="text-sm text-gray-900">
            <strong>Base URL:</strong> <code className="text-gray-900">https://api.optiblogai.com/v1</code>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication</h2>
        
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
          <div className="flex">
            <Info className="h-6 w-6 text-amber-400 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">API Key Required</h3>
              <p className="text-amber-700">
                All API requests require authentication using an API key. Include your API key 
                in the Authorization header of all requests.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Headers</h3>
          <div className="relative">
            <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
Accept: application/json`}
            </pre>
            <CopyButton 
              text={`Authorization: Bearer YOUR_API_KEY\nContent-Type: application/json\nAccept: application/json`}
              id="auth-headers"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="font-medium text-green-900 mb-2">✅ Valid Request</h4>
            <div className="relative">
              <pre className="bg-white rounded border p-3 text-sm text-gray-800 overflow-x-auto">
{`curl -X POST https://api.optiblogai.com/v1/generate-blog \\
  -H "Authorization: Bearer sk-..." \\
  -H "Content-Type: application/json"`}
              </pre>
              <CopyButton 
                text={`curl -X POST https://api.optiblogai.com/v1/generate-blog \\\n  -H "Authorization: Bearer sk-..." \\\n  -H "Content-Type: application/json"`}
                id="valid-request"
              />
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-6">
            <h4 className="font-medium text-red-900 mb-2">❌ Invalid Request</h4>
            <div className="relative">
              <pre className="bg-white rounded border p-3 text-sm text-gray-800 overflow-x-auto">
{`{
  "error": "unauthorized",
  "message": "Invalid or missing API key",
  "code": 401
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Generation Endpoint */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Blog Generation</h2>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mr-3">POST</span>
              <code className="text-lg font-mono text-gray-900">/generate-blog</code>
            </div>
            <StatusBadge status={200} />
          </div>
          <p className="text-gray-700 mb-6">
            Generate an SEO-optimized blog post based on a target keyword. The system will research 
            top-ranking content, analyze it, and generate original, high-quality content.
          </p>

          {/* Request Parameters */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Body</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">keyword</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓ Yes</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Target keyword for content generation</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">max_attempts</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">integer</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Maximum generation attempts (default: 3, max: 5)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">seo_threshold</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">float</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Minimum SEO score to accept (default: 75.0, range: 60-95)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">target_length</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">integer</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Target word count (default: 1500, range: 800-3000)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">language</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Output language (default: "en", supports: en, es, fr, de)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Request Example */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Example</h3>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto">
{`{
  "keyword": "how to build REST APIs with FastAPI",
  "max_attempts": 3,
  "seo_threshold": 80.0,
  "target_length": 2000,
  "language": "en"
}`}
              </pre>
              <CopyButton 
                text={`{\n  "keyword": "how to build REST APIs with FastAPI",\n  "max_attempts": 3,\n  "seo_threshold": 80.0,\n  "target_length": 2000,\n  "language": "en"\n}`}
                id="request-example"
              />
            </div>
          </div>

          {/* Response Format */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Format</h3>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto">
{`{
  "run_id": "550e8400-e29b-41d4-a716-446655440000",
  "final_blog": {
    "title": "How to Build REST APIs with FastAPI: A Complete Guide",
    "meta_description": "Learn how to build powerful REST APIs...",
    "content": "<h1>How to Build REST APIs with FastAPI</h1>\\n<p>FastAPI is...",
    "word_count": 1987,
    "reading_time": 8
  },
  "seo_scores": {
    "title_score": 92.0,
    "content_structure": 88.5,
    "keyword_density": 85.0,
    "readability_score": 89.2,
    "meta_description": 91.0,
    "final_score": 89.1
  },
  "generation_metadata": {
    "attempts": 2,
    "execution_time": 47.3,
    "sources_analyzed": 10,
    "model_used": "llama-3.1-70b-versatile"
  },
  "created_at": "2024-01-15T10:30:45Z"
}`}
              </pre>
              <CopyButton 
                text={`{\n  "run_id": "550e8400-e29b-41d4-a716-446655440000",\n  "final_blog": {...},\n  "seo_scores": {...},\n  "generation_metadata": {...},\n  "created_at": "2024-01-15T10:30:45Z"\n}`}
                id="response-example"
              />
            </div>
          </div>

          {/* cURL Example */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">cURL Example</h3>
            <div className="relative">
              <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto">
{`curl -X POST https://api.optiblogai.com/v1/generate-blog \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "keyword": "how to build REST APIs with FastAPI",
    "max_attempts": 3,
    "seo_threshold": 80.0,
    "target_length": 2000
  }'`}
              </pre>
              <CopyButton 
                text={`curl -X POST https://api.optiblogai.com/v1/generate-blog \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "keyword": "how to build REST APIs with FastAPI",\n    "max_attempts": 3,\n    "seo_threshold": 80.0,\n    "target_length": 2000\n  }'`}
                id="curl-example"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Health Check Endpoint */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Health Check</h2>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono text-gray-900">/health</code>
            </div>
            <StatusBadge status={200} />
          </div>
          <p className="text-gray-700 mb-6">
            Check the operational status of the OptiBlogAi API and its dependencies.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Healthy Response</h4>
              <div className="relative">
                <pre className="bg-green-50 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto">
{`{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:45Z",
  "version": "1.0.0",
  "services": {
    "groq_api": "operational",
    "gemini_api": "operational",
    "google_search": "operational",
    "langgraph": "operational"
  },
  "uptime": 3600.5
}`}
                </pre>
                <CopyButton 
                  text={`{\n  "status": "healthy",\n  "timestamp": "2024-01-15T10:30:45Z",\n  "version": "1.0.0",\n  "services": {...},\n  "uptime": 3600.5\n}`}
                  id="health-success"
                />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Degraded Response</h4>
              <div className="relative">
                <pre className="bg-yellow-50 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto">
{`{
  "status": "degraded",
  "timestamp": "2024-01-15T10:30:45Z",
  "version": "1.0.0",
  "services": {
    "groq_api": "operational",
    "gemini_api": "degraded",
    "google_search": "operational",
    "langgraph": "operational"
  },
  "issues": ["Gemini API high latency"]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Responses */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Responses</h2>
        
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-900">400 Bad Request</h3>
            </div>
            <p className="text-red-800 text-sm mb-4">Invalid request parameters or malformed JSON.</p>
            <div className="relative">
              <pre className="bg-white rounded border border-red-200 p-3 text-sm text-gray-800 overflow-x-auto">
{`{
  "error": "validation_error",
  "message": "Keyword must be between 2 and 100 characters",
  "details": {
    "field": "keyword",
    "value": "a",
    "constraint": "min_length: 2"
  },
  "code": 400
}`}
              </pre>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-orange-900">401 Unauthorized</h3>
            </div>
            <p className="text-orange-800 text-sm mb-4">Invalid or missing API key.</p>
            <div className="relative">
              <pre className="bg-white rounded border border-orange-200 p-3 text-sm text-gray-800 overflow-x-auto">
{`{
  "error": "unauthorized",
  "message": "Invalid API key provided",
  "code": 401
}`}
              </pre>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <AlertCircle className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-purple-900">429 Rate Limit Exceeded</h3>
            </div>
            <p className="text-purple-800 text-sm mb-4">API rate limit exceeded. Please wait before making more requests.</p>
            <div className="relative">
              <pre className="bg-white rounded border border-purple-200 p-3 text-sm text-gray-800 overflow-x-auto">
{`{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded. Try again in 60 seconds",
  "retry_after": 60,
  "code": 429
}`}
              </pre>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">500 Internal Server Error</h3>
            </div>
            <p className="text-gray-800 text-sm mb-4">Server error during content generation.</p>
            <div className="relative">
              <pre className="bg-white rounded border border-gray-200 p-3 text-sm text-gray-800 overflow-x-auto">
{`{
  "error": "internal_server_error",
  "message": "Content generation failed after maximum attempts",
  "run_id": "550e8400-e29b-41d4-a716-446655440000",
  "code": 500
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rate Limits</h2>
        
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
          <div className="flex">
            <Info className="h-6 w-6 text-amber-400 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Fair Usage Policy</h3>
              <p className="text-amber-700">
                Rate limits are enforced to ensure fair access and optimal performance for all users. 
                Limits vary by subscription plan and endpoint.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Plan</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
            <p className="text-sm text-gray-600">requests per hour</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Plan</h3>
            <div className="text-3xl font-bold text-indigo-600 mb-2">100</div>
            <p className="text-sm text-gray-600">requests per hour</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
            <p className="text-sm text-gray-600">custom limits</p>
          </div>
        </div>

        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limit Headers</h3>
          <p className="text-gray-700 mb-4">
            All API responses include rate limit information in the headers:
          </p>
          <div className="relative">
            <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto">
{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642261200
Retry-After: 3600`}
            </pre>
            <CopyButton 
              text={`X-RateLimit-Limit: 100\nX-RateLimit-Remaining: 99\nX-RateLimit-Reset: 1642261200\nRetry-After: 3600`}
              id="rate-limit-headers"
            />
          </div>
        </div>
      </section>

      {/* SDK Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">SDK Examples</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Code className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Python</h3>
            </div>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto">
{`import requests

def generate_blog(keyword, api_key):
    url = "https://api.optiblogai.com/v1/generate-blog"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "keyword": keyword,
        "max_attempts": 3,
        "seo_threshold": 80.0
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
result = generate_blog("FastAPI tutorial", "your-api-key")
print(result["final_blog"]["content"])`}
              </pre>
              <CopyButton 
                text={`import requests\n\ndef generate_blog(keyword, api_key):\n    url = "https://api.optiblogai.com/v1/generate-blog"\n    headers = {\n        "Authorization": f"Bearer {api_key}",\n        "Content-Type": "application/json"\n    }\n    data = {\n        "keyword": keyword,\n        "max_attempts": 3,\n        "seo_threshold": 80.0\n    }\n    \n    response = requests.post(url, headers=headers, json=data)\n    return response.json()\n\n# Usage\nresult = generate_blog("FastAPI tutorial", "your-api-key")\nprint(result["final_blog"]["content"])`}
                id="python-example"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Code className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">JavaScript</h3>
            </div>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto">
{`async function generateBlog(keyword, apiKey) {
  const response = await fetch(
    'https://api.optiblogai.com/v1/generate-blog',
    {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        keyword: keyword,
        max_attempts: 3,
        seo_threshold: 80.0
      })
    }
  );
  
  return await response.json();
}

// Usage
generateBlog('FastAPI tutorial', 'your-api-key')
  .then(result => {
    console.log(result.final_blog.content);
  })
  .catch(error => {
    console.error('Error:', error);
  });`}
              </pre>
              <CopyButton 
                text={`async function generateBlog(keyword, apiKey) {\n  const response = await fetch(\n    'https://api.optiblogai.com/v1/generate-blog',\n    {\n      method: 'POST',\n      headers: {\n        'Authorization': \`Bearer \${apiKey}\`,\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify({\n        keyword: keyword,\n        max_attempts: 3,\n        seo_threshold: 80.0\n      })\n    }\n  );\n  \n  return await response.json();\n}\n\n// Usage\ngenerateBlog('FastAPI tutorial', 'your-api-key')\n  .then(result => {\n    console.log(result.final_blog.content);\n  })\n  .catch(error => {\n    console.error('Error:', error);\n  });`}
                id="javascript-example"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Webhooks */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Webhooks (Coming Soon)</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
          <div className="flex">
            <Info className="h-6 w-6 text-blue-400 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Async Processing</h3>
              <p className="text-blue-700">
                Webhook support is in development to enable asynchronous content generation 
                for long-running requests and batch processing.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Planned Webhook Events</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700"><code>blog.generation.completed</code> - Content generation finished successfully</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700"><code>blog.generation.failed</code> - Content generation failed after max attempts</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700"><code>blog.generation.progress</code> - Progress updates during generation</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default APIReferenceSection;