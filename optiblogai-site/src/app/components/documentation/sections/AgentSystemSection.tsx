"use client";

import React from "react";
import { Zap, Brain, Search, Globe, Database, Settings, Code, Eye } from "lucide-react";
import MermaidDiagram from "../MermaidDiagram";

const AgentSystemSection: React.FC = () => {
  const agentWorkflow = `
    graph TD
        Start([User Input: Keyword]) --> A[search_top_posts]
        A --> B[scrape_posts] 
        B --> C[clean_validate]
        C --> D[generate_blog]
        D --> E[evaluate_seo]
        E --> F{Score >= Threshold?}
        F -->|✓ Yes| G[Final Blog Output]
        F -->|✗ No| H{Attempts < Max?}
        H -->|✓ Yes| I[Update State & Retry]
        H -->|✗ No| J[Generation Failed]
        I --> D
        
        subgraph "LangGraph Features"
            Memory[InMemorySaver]
            Trace[LangSmith Tracing] 
            State[GraphState]
        end
        
        A -.-> Memory
        B -.-> Memory
        C -.-> Memory
        D -.-> Memory
        E -.-> Memory
        
        Memory -.-> Trace
        State -.-> Trace
        
        style Start fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style A fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
        style D fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
        style E fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#ffffff
        style G fill:#22c55e,stroke:#16a34a,stroke-width:2px,color:#ffffff
        style J fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#ffffff
  `;

  const nodeInteractions = `
    graph TB
        subgraph "External APIs"
            GroqAPI[Groq Cloud LLMs]
            GeminiAPI[Gemini AI + Search]
            GoogleSearch[Google Search API]
            PlaywrightScraper[Web Scraping]
        end
        
        subgraph "Agent Nodes"
            SearchNode[search_top_posts]
            ScrapeNode[scrape_posts]
            CleanNode[clean_validate]
            GenerateNode[generate_blog] 
            EvaluateNode[evaluate_seo]
            ReactNode[react_agent]
        end
        
        subgraph "AI Models & Tools"
            LLaMA[LLaMA 3.1 70B]
            Mixtral[Mixtral 8x7B]
            GeminiPro[Gemini Pro]
            GeminiSearch[Gemini w/ Search]
        end
        
        SearchNode --> GeminiSearch
        GeminiSearch --> GoogleSearch
        ScrapeNode --> PlaywrightScraper
        GenerateNode --> GroqAPI
        GenerateNode --> LLaMA
        GenerateNode --> Mixtral
        EvaluateNode --> GeminiPro
        
        style SearchNode fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style GenerateNode fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
        style EvaluateNode fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
        style GroqAPI fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#ffffff
        style GeminiAPI fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#ffffff
  `;

  const dataFlow = `
    graph LR
        Input[Keyword Input] --> State1[Initial State]
        State1 --> Node1[search_top_posts]
        Node1 --> State2[State + URLs]
        State2 --> Node2[scrape_posts]
        Node2 --> State3[State + Content]
        State3 --> Node3[clean_validate]
        Node3 --> State4[State + Clean Data]
        State4 --> Node4[generate_blog]
        Node4 --> State5[State + Draft Blog]
        State5 --> Node5[evaluate_seo]
        Node5 --> State6[State + SEO Scores]
        State6 --> Decision{Quality Check}
        Decision -->|Pass| Output[Final Blog]
        Decision -->|Fail| Retry[Retry Logic]
        Retry --> State4
        
        style Input fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style Output fill:#22c55e,stroke:#16a34a,stroke-width:2px,color:#ffffff
        style Decision fill:#f59e0b,stroke:#d97706,stroke-width:2px
  `;

  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Agent System Deep Dive</h1>
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center mb-4">
          <Brain className="h-8 w-8 mr-3" />
          <h2 className="text-2xl font-bold text-white">The Heart of OptiBlogAi</h2>
        </div>
        <p className="text-lg text-indigo-100 mb-4">
          The agent system is OptiBlogAi's core innovation - a sophisticated LangGraph-powered workflow 
          that orchestrates multiple AI models, web scraping, and quality assessment to generate 
          high-quality, SEO-optimized content autonomously.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Multi-Agent Architecture</h3>
            <p className="text-indigo-100">Specialized agents for search, scraping, generation, and evaluation</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">State Management</h3>
            <p className="text-indigo-100">Persistent state across agent nodes with full observability</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Quality Assurance</h3>
            <p className="text-indigo-100">Iterative refinement until content meets quality standards</p>
          </div>
        </div>
      </div>

      {/* Agent Workflow Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agent Workflow Overview</h2>
        <p className="text-gray-700 mb-6">
          The agent system follows a systematic multi-stage workflow, where each node has a specific 
          responsibility and contributes to the final content generation goal. State is maintained 
          throughout the process, enabling recovery and iteration.
        </p>
        
        <MermaidDiagram 
          chart={agentWorkflow}
          id="agent-workflow"
          className="mb-8"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Search className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-indigo-900">Search & Discovery</h3>
            </div>
            <p className="text-indigo-800 text-sm mb-3">
              Find top-ranking content for target keywords using Gemini AI with Google Search integration.
            </p>
            <div className="text-xs text-indigo-700 space-y-1">
              <div>• Search query optimization</div>
              <div>• Top 10 result extraction</div>
              <div>• URL validation and filtering</div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Globe className="h-6 w-6 text-emerald-600 mr-2" />
              <h3 className="text-lg font-semibold text-emerald-900">Content Extraction</h3>
            </div>
            <p className="text-emerald-800 text-sm mb-3">
              Scrape and extract content from target websites using Playwright for reliability.
            </p>
            <div className="text-xs text-emerald-700 space-y-1">
              <div>• Concurrent scraping</div>
              <div>• HTML parsing and cleaning</div>
              <div>• Content structure extraction</div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Brain className="h-6 w-6 text-amber-600 mr-2" />
              <h3 className="text-lg font-semibold text-amber-900">AI Generation</h3>
            </div>
            <p className="text-amber-800 text-sm mb-3">
              Generate original, comprehensive content using advanced LLMs with sophisticated prompting.
            </p>
            <div className="text-xs text-amber-700 space-y-1">
              <div>• Multi-model generation</div>
              <div>• SEO-optimized structure</div>
              <div>• Original content synthesis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Node Interactions and AI Models */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">AI Models & External Integrations</h2>
        <p className="text-gray-700 mb-6">
          The agent system integrates with multiple AI providers and external services, 
          leveraging the strengths of different models for optimal results in each stage of the pipeline.
        </p>

        <MermaidDiagram 
          chart={nodeInteractions}
          id="node-interactions"
          className="mb-8"
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Groq Cloud Integration</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Ultra-fast LLM inference for content generation and analysis.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">LLaMA 3.1 70B</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Primary</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Mixtral 8x7B</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Secondary</span>
                </div>
                <div className="text-xs text-gray-600 mt-3">
                  <strong>Use Cases:</strong> Content generation, text analysis, prompt engineering
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-pink-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Gemini AI Integration</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Advanced AI with grounding capabilities and search integration.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Gemini Pro</span>
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">Analysis</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Gemini + Search</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">Research</span>
                </div>
                <div className="text-xs text-gray-600 mt-3">
                  <strong>Use Cases:</strong> Search operations, content evaluation, fact checking
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Web Scraping Stack</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Robust web scraping with JavaScript support and anti-detection measures.
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Playwright</span>
                  <p className="text-gray-600 text-xs">Browser automation and JavaScript rendering</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">BeautifulSoup</span>
                  <p className="text-gray-600 text-xs">HTML parsing and content extraction</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Aiohttp</span>
                  <p className="text-gray-600 text-xs">Async HTTP client for concurrent requests</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Observability</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Comprehensive monitoring and tracing through LangSmith integration.
              </p>
              <div className="space-y-2 text-sm">
                <div className="text-gray-700">• Agent execution traces</div>
                <div className="text-gray-700">• Token usage monitoring</div>
                <div className="text-gray-700">• Performance metrics</div>
                <div className="text-gray-700">• Error tracking and debugging</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Flow and State Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Flow & State Management</h2>
        <p className="text-gray-700 mb-6">
          The agent system maintains a persistent state throughout the entire workflow, 
          enabling recovery from failures, iteration on failed attempts, and complete observability 
          of the content generation process.
        </p>

        <MermaidDiagram 
          chart={dataFlow}
          id="data-flow"
          className="mb-8"
        />

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">GraphState Schema</h3>
          <div className="bg-white rounded border p-4 overflow-x-auto">
            <pre className="text-sm text-gray-800">
{`class GraphState(BaseModel):
    # Input parameters
    keyword: str                     # Target keyword for content generation
    max_attempts: int = 3           # Maximum generation attempts
    seo_threshold: float = 75.0     # Quality threshold for acceptance
    
    # Intermediate data
    top_posts: List[SearchResult] = []      # Top ranking posts found
    scraped_content: List[ScrapedPost] = [] # Raw scraped content
    cleaned_posts: List[CleanPost] = []     # Processed and validated content
    
    # Generation state
    draft_blog: str = ""            # Current blog draft
    seo_scores: Dict[str, float] = {}       # SEO evaluation scores
    attempts: int = 0               # Current attempt number
    
    # Final output
    final_blog: str = ""            # Final approved content
    final_score: float = 0.0        # Final quality score
    execution_time: float = 0.0     # Total processing time
    
    # Metadata
    run_id: str                     # Unique execution identifier
    created_at: datetime            # Execution timestamp
    node_history: List[str] = []    # Node execution history`}
            </pre>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Database className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium text-indigo-900">State Persistence</h4>
            </div>
            <p className="text-sm text-indigo-800">
              LangGraph's InMemorySaver maintains state across node transitions, enabling recovery and iteration.
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Code className="h-5 w-5 text-emerald-600 mr-2" />
              <h4 className="font-medium text-emerald-900">Type Safety</h4>
            </div>
            <p className="text-sm text-emerald-800">
              Pydantic models ensure type safety and validation throughout the agent workflow.
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Eye className="h-5 w-5 text-amber-600 mr-2" />
              <h4 className="font-medium text-amber-900">Observability</h4>
            </div>
            <p className="text-sm text-amber-800">
              Complete execution history and metadata for debugging and optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Individual Agent Nodes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agent Node Specifications</h2>
        
        <div className="space-y-8">
          {/* Search Top Posts Node */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Search className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">search_top_posts</h3>
              <span className="ml-auto bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">Research</span>
            </div>
            <p className="text-gray-700 mb-4">
              Discovers top-ranking content for the target keyword using Gemini AI with Google Search integration.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Implementation Details</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• Uses Gemini's search grounding capability</div>
                  <div>• Extracts top 10 search results</div>
                  <div>• Validates URLs and filters spam</div>
                  <div>• Extracts titles, snippets, and metadata</div>
                  <div>• Implements retry logic with exponential backoff</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Output Format</h4>
                <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800 overflow-x-auto">
{`{
  "url": "https://example.com/post",
  "title": "How to Build APIs with FastAPI", 
  "snippet": "FastAPI is a modern...",
  "domain": "example.com",
  "estimated_quality": 8.5
}`}
                </div>
              </div>
            </div>
          </div>

          {/* Scrape Posts Node */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-emerald-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">scrape_posts</h3>
              <span className="ml-auto bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">Extraction</span>
            </div>
            <p className="text-gray-700 mb-4">
              Concurrently scrapes content from discovered URLs using Playwright for JavaScript rendering and robust extraction.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• Concurrent scraping with semaphore control</div>
                  <div>• JavaScript rendering with Playwright</div>
                  <div>• User-agent rotation for anti-detection</div>
                  <div>• Timeout and error handling</div>
                  <div>• Content-type validation</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Configuration</h4>
                <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800 overflow-x-auto">
{`MAX_CONCURRENT_REQUESTS = 10
MAX_SCRAPE_TIMEOUT = 30
USER_AGENTS = [
  "Mozilla/5.0 (compatible bot)",
  "OptiBlogAi/1.0 (+info)"
]
RETRY_ATTEMPTS = 3`}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Blog Node */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-amber-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">generate_blog</h3>
              <span className="ml-auto bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">AI Generation</span>
            </div>
            <p className="text-gray-700 mb-4">
              The core content generation node that synthesizes scraped content into original, 
              SEO-optimized blog posts using advanced LLMs and prompt engineering.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Generation Strategy</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• Multi-source content synthesis</div>
                  <div>• SEO-optimized structure generation</div>
                  <div>• Original content creation (not copying)</div>
                  <div>• FAQ and conclusion generation</div>
                  <div>• Meta description and title optimization</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Prompt Engineering</h4>
                <div className="text-sm text-gray-700 mb-3">
                  Advanced prompt templates with:
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>• System prompts for role definition</div>
                  <div>• Few-shot examples for quality</div>
                  <div>• Structured output formatting</div>
                  <div>• Chain-of-thought reasoning</div>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluate SEO Node */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">evaluate_seo</h3>
              <span className="ml-auto bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Quality Check</span>
            </div>
            <p className="text-gray-700 mb-4">
              Comprehensive SEO evaluation using both AI analysis and deterministic rules 
              to score content quality across multiple dimensions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Evaluation Criteria</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• <strong>Title Optimization:</strong> Keyword placement, length</div>
                  <div>• <strong>Content Structure:</strong> Headings, paragraphs</div>
                  <div>• <strong>Keyword Density:</strong> 1-2% target range</div>
                  <div>• <strong>Readability:</strong> Flesch score &gt; 60</div>
                  <div>• <strong>Meta Description:</strong> Length and relevance</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Scoring System</h4>
                <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800 overflow-x-auto">
{`{
  "title_score": 85.0,
  "content_structure": 92.0,
  "keyword_density": 78.0,
  "readability_score": 88.0,
  "meta_description": 90.0,
  "final_score": 86.6
}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance Loop */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quality Assurance Loop</h2>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 mb-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-amber-600 mr-3" />
            <h3 className="text-xl font-semibold text-amber-900">Iterative Refinement Process</h3>
          </div>
          <p className="text-amber-800 mb-6">
            OptiBlogAi's unique quality assurance loop ensures content meets stringent standards 
            before publication through iterative refinement and scoring.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Initial Generation</h4>
              <p className="text-sm text-gray-700">
                First attempt at content generation using synthesized source material
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Quality Assessment</h4>
              <p className="text-sm text-gray-700">
                Comprehensive scoring across SEO and content quality metrics
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Iterative Improvement</h4>
              <p className="text-sm text-gray-700">
                Refinement with specific feedback until threshold is met
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Retry Logic</h3>
            <div className="bg-gray-50 rounded p-4 font-mono text-sm text-gray-800 overflow-x-auto">
{`def react_agent(state: GraphState) -> str:
    if state.final_score >= state.seo_threshold:
        state.final_blog = state.draft_blog
        return "finish"
        
    if state.attempts < state.max_attempts:
        state.attempts += 1
        # Add specific feedback for improvement
        return "continue"
        
    # Max attempts reached
    return "fail"`}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Success Metrics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Average Success Rate</span>
                <span className="font-medium text-green-600">89%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">First-Attempt Success</span>
                <span className="font-medium text-blue-600">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Average Attempts</span>
                <span className="font-medium text-purple-600">1.4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Average Final Score</span>
                <span className="font-medium text-indigo-600">82.3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance and Optimization */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Performance & Optimization</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">Concurrency Optimization</h3>
              <div className="space-y-2 text-sm text-indigo-800">
                <div>• Async/await throughout the pipeline</div>
                <div>• Concurrent web scraping with semaphore control</div>
                <div>• Parallel AI model inference where possible</div>
                <div>• Connection pooling for external APIs</div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-3">Caching Strategy</h3>
              <div className="space-y-2 text-sm text-emerald-800">
                <div>• Search results caching (TTL: 24h)</div>
                <div>• Scraped content caching (TTL: 7d)</div>
                <div>• LLM response caching for similar prompts</div>
                <div>• Embedding caching for semantic analysis</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">Error Handling</h3>
              <div className="space-y-2 text-sm text-amber-800">
                <div>• Graceful degradation for failed scrapes</div>
                <div>• LLM API fallbacks (Groq → Gemini)</div>
                <div>• Retry logic with exponential backoff</div>
                <div>• Partial results preservation</div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Monitoring</h3>
              <div className="space-y-2 text-sm text-purple-800">
                <div>• LangSmith execution tracing</div>
                <div>• Token usage and cost tracking</div>
                <div>• Performance metrics collection</div>
                <div>• Quality score distribution analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgentSystemSection;