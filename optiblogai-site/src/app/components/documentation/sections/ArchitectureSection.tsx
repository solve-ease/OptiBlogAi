"use client";

import React from "react";
import { Database, Globe, Zap, Code, Settings, ArrowRight } from "lucide-react";
import MermaidDiagram from "../MermaidDiagram";

const ArchitectureSection: React.FC = () => {
  const systemArchitecture = `
    graph TB
        subgraph "Frontend Layer"
            UI[Next.js UI]
            Demo[Demo Interface]
        end
        
        subgraph "API Gateway"
            FastAPI[FastAPI Server]
        end
        
        subgraph "Agent System Core"
            LG[LangGraph Orchestrator]
            Search[Search Agent]
            Scraper[Web Scraper]
            Generator[Content Generator]
            Evaluator[SEO Evaluator]
        end
        
        subgraph "AI Services"
            Groq[Groq LLM]
            Gemini[Gemini AI]
            LangSmith[LangSmith Tracing]
        end
        
        subgraph "External Services"
            Google[Google Search API]
            Web[Target Websites]
        end
        
        UI --> FastAPI
        Demo --> FastAPI
        FastAPI --> LG
        
        LG --> Search
        LG --> Scraper  
        LG --> Generator
        LG --> Evaluator
        
        Search --> Groq
        Search --> Google
        Generator --> Gemini
        Evaluator --> Groq
        
        Scraper --> Web
        
        LG --> LangSmith
        
        style UI fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style FastAPI fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
        style LG fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
        style Groq fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#ffffff
        style Gemini fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#ffffff
  `;

  const workflowDiagram = `
    graph LR
        Start([User Input: Keyword]) --> A[Search Top Posts]
        A --> B[Scrape Content]
        B --> C[Clean & Validate]
        C --> D[Generate Blog]
        D --> E[Evaluate SEO]
        E --> F{Score >= 75?}
        F -->|Yes| G[✅ Final Blog]
        F -->|No| H{Attempts < Max?}
        H -->|Yes| D
        H -->|No| I[❌ Failed]
        
        style Start fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style G fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
        style I fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#ffffff
        style F fill:#f59e0b,stroke:#d97706,stroke-width:2px
        style H fill:#f59e0b,stroke:#d97706,stroke-width:2px
  `;

  const agentSystemFlow = `
    graph TD
        subgraph "Agent Workflow"
            A[search_top_posts] --> B[scrape_posts]
            B --> C[clean_validate]
            C --> D[generate_blog]
            D --> E[evaluate_seo]
            E --> F[react_agent]
            F -->|Score >= 75| G[END]
            F -->|Retry| D
            F -->|Max attempts| H[FAIL]
        end
        
        subgraph "LangGraph Features"
            Memory[InMemorySaver]
            Trace[LangSmith Tracing]
            State[GraphState Management]
        end
        
        A -.-> Memory
        B -.-> Memory
        C -.-> Memory
        D -.-> Memory
        E -.-> Memory
        
        Memory -.-> Trace
        State -.-> Trace
        
        style A fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style D fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
        style E fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
        style G fill:#22c55e,stroke:#16a34a,stroke-width:2px,color:#ffffff
        style H fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#ffffff
  `;

  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">System Architecture</h1>
      
      <p className="text-lg text-gray-700 mb-8">
        OptiBlogAi follows a modular, microservices-inspired architecture with clear separation 
        between frontend presentation, API orchestration, and AI agent processing layers.
      </p>

      {/* High-Level System Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">High-Level System Overview</h2>
        <p className="text-gray-700 mb-6">
          The system consists of three main layers: the Next.js frontend for user interaction, 
          a FastAPI backend for request handling, and the LangGraph agent system for AI processing.
        </p>
        
        <MermaidDiagram 
          chart={systemArchitecture}
          id="system-architecture"
          className="mb-8"
        />

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Globe className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-indigo-900">Frontend Layer</h3>
            </div>
            <p className="text-indigo-800 text-sm">
              Next.js application with TypeScript, providing the user interface, 
              demo capabilities, and real-time interaction with the backend services.
            </p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Database className="h-6 w-6 text-emerald-600 mr-2" />
              <h3 className="text-lg font-semibold text-emerald-900">API Gateway</h3>
            </div>
            <p className="text-emerald-800 text-sm">
              FastAPI server handling HTTP requests, input validation, 
              authentication, and orchestrating calls to the agent system.
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Zap className="h-6 w-6 text-amber-600 mr-2" />
              <h3 className="text-lg font-semibold text-amber-900">Agent System</h3>
            </div>
            <p className="text-amber-800 text-sm">
              LangGraph-powered agent workflow managing the entire content generation 
              pipeline with state management and observability.
            </p>
          </div>
        </div>
      </section>

      {/* Content Generation Workflow */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Generation Workflow</h2>
        <p className="text-gray-700 mb-6">
          The core workflow follows a systematic approach: research, content extraction, 
          AI generation, quality assessment, and iterative refinement until standards are met.
        </p>

        <MermaidDiagram 
          chart={workflowDiagram}
          id="workflow-diagram"
          className="mb-8"
        />

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Breakdown</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-indigo-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Search & Discovery</h4>
                  <p className="text-sm text-gray-600">Find top-ranking content for target keywords</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-emerald-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-emerald-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Content Extraction</h4>
                  <p className="text-sm text-gray-600">Scrape and clean source content</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-amber-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">AI Generation</h4>
                  <p className="text-sm text-gray-600">Generate original content using LLMs</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Quality Assessment</h4>
                  <p className="text-sm text-gray-600">Evaluate SEO metrics and content quality</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-pink-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-pink-600">5</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Iterative Refinement</h4>
                  <p className="text-sm text-gray-600">Refine content until quality threshold is met</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-green-600">6</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Final Output</h4>
                  <p className="text-sm text-gray-600">Deliver optimized, ready-to-publish content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent System Deep Dive */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">LangGraph Agent System</h2>
        <p className="text-gray-700 mb-6">
          The heart of OptiBlogAi is the LangGraph-powered agent system that orchestrates 
          the entire content generation pipeline with state management, observability, and fault tolerance.
        </p>

        <MermaidDiagram 
          chart={agentSystemFlow}
          id="agent-system-flow"
          className="mb-8"
        />

        {/* Agent Nodes Details */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-indigo-600" />
              Agent Nodes
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-indigo-900">search_top_posts</h4>
                <p className="text-gray-600">Uses Gemini with Google Search to find top-ranking content</p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-900">scrape_posts</h4>
                <p className="text-gray-600">Playwright-based concurrent scraping with error handling</p>
              </div>
              <div>
                <h4 className="font-medium text-amber-900">clean_validate</h4>
                <p className="text-gray-600">Content cleaning, normalization, and Pydantic validation</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-900">generate_blog</h4>
                <p className="text-gray-600">LLM-powered content generation with prompt engineering</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2 text-emerald-600" />
              System Features
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-indigo-900">State Management</h4>
                <p className="text-gray-600">Persistent state across agent nodes with InMemorySaver</p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-900">Observability</h4>
                <p className="text-gray-600">Complete tracing and monitoring via LangSmith</p>
              </div>
              <div>
                <h4 className="font-medium text-amber-900">Quality Control</h4>
                <p className="text-gray-600">Configurable thresholds and retry mechanisms</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-900">Scalability</h4>
                <p className="text-gray-600">Async processing with concurrent request handling</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Integration */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Technology Integrations</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-indigo-900 mb-2">LangGraph</h4>
                <p className="text-xs text-gray-600">Workflow orchestration and state management</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-emerald-900 mb-2">Groq Cloud</h4>
                <p className="text-xs text-gray-600">High-speed LLM inference for content generation</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-amber-900 mb-2">Gemini AI</h4>
                <p className="text-xs text-gray-600">Advanced AI with grounding and search capabilities</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-purple-900 mb-2">Playwright</h4>
                <p className="text-xs text-gray-600">Reliable web scraping and content extraction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Flow & State Management</h2>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">GraphState Schema</h3>
          <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-800">
{`class GraphState(BaseModel):
    keyword: str
    top_posts: list[dict] = []
    cleaned_posts: list[dict] = []
    draft_blog: str = ""
    seo_scores: dict = {}
    final_score: float = 0.0
    attempts: int = 0
    max_attempts: int = 3
    final_blog: str = ""`}
            </pre>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 mb-2">Input Processing</h4>
            <p className="text-sm text-indigo-800">
              User keywords are validated and enriched with search metadata before processing.
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <h4 className="font-medium text-emerald-900 mb-2">Intermediate Storage</h4>
            <p className="text-sm text-emerald-800">
              Scraped content and generated drafts are maintained in persistent state.
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">Output Generation</h4>
            <p className="text-sm text-amber-800">
              Final content includes SEO scores, metadata, and quality metrics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchitectureSection;