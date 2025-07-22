"use client";

import React from "react";
import { Database, Server, Code, Settings, Zap, Shield } from "lucide-react";
import MermaidDiagram from "../MermaidDiagram";

const BackendSection: React.FC = () => {
  const backendArchitecture = `
    graph TB
        subgraph "Client Layer"
            Web[Web Frontend]
            API[API Clients]
            CLI[CLI Tools]
        end
        
        subgraph "API Gateway"
            FastAPI[FastAPI Server]
            Auth[Authentication]
            Validation[Request Validation]
            CORS[CORS Middleware]
        end
        
        subgraph "Core Services"
            BlogGen[Blog Generation Service]
            AgentOrch[Agent Orchestrator]
            StateManager[State Manager]
        end
        
        subgraph "Agent System"
            LangGraph[LangGraph Workflow]
            Nodes[Agent Nodes]
            Memory[Memory Storage]
        end
        
        subgraph "External APIs"
            GroqAPI[Groq Cloud API]
            GeminiAPI[Gemini API]
            GoogleSearch[Google Search API]
            LangSmithAPI[LangSmith API]
        end
        
        Web --> FastAPI
        API --> FastAPI
        CLI --> FastAPI
        
        FastAPI --> Auth
        FastAPI --> Validation
        FastAPI --> CORS
        
        FastAPI --> BlogGen
        BlogGen --> AgentOrch
        AgentOrch --> LangGraph
        
        LangGraph --> Nodes
        Nodes --> Memory
        
        Nodes --> GroqAPI
        Nodes --> GeminiAPI  
        Nodes --> GoogleSearch
        LangGraph --> LangSmithAPI
        
        style FastAPI fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style LangGraph fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
        style GroqAPI fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
        style GeminiAPI fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#ffffff
  `;

  const apiWorkflow = `
    graph LR
        Start([API Request]) --> Validate[Request Validation]
        Validate --> Auth[Authentication Check]
        Auth --> Parse[Parse Parameters]
        Parse --> InitAgent[Initialize Agent]
        InitAgent --> Execute[Execute Workflow]
        Execute --> Response[Format Response]
        Response --> End([API Response])
        
        Execute --> Error{Error?}
        Error -->|Yes| ErrorHandler[Error Handler]
        Error -->|No| Success[Success Handler]
        ErrorHandler --> Response
        Success --> Response
        
        style Start fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style Execute fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
        style End fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
        style Error fill:#ef4444,stroke:#dc2626,stroke-width:2px
  `;

  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Backend Guide</h1>
      
      <p className="text-lg text-gray-700 mb-8">
        The OptiBlogAi backend is built with FastAPI and Python, providing a robust, scalable, 
        and high-performance API for AI-powered content generation. The backend orchestrates 
        the entire agent workflow using LangGraph and integrates with multiple AI services.
      </p>

      {/* Technology Stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Server className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-indigo-900">Web Framework</h3>
            </div>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li>• <strong>FastAPI</strong> - Modern Python web framework</li>
              <li>• <strong>Uvicorn</strong> - ASGI server for production</li>
              <li>• <strong>Pydantic v2</strong> - Data validation and serialization</li>
            </ul>
          </div>

          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Zap className="h-6 w-6 text-emerald-600 mr-2" />
              <h3 className="text-lg font-semibold text-emerald-900">AI & Orchestration</h3>
            </div>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li>• <strong>LangGraph</strong> - Agent workflow orchestration</li>
              <li>• <strong>LangChain</strong> - LLM integration utilities</li>
              <li>• <strong>LangSmith</strong> - Observability and tracing</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Database className="h-6 w-6 text-amber-600 mr-2" />
              <h3 className="text-lg font-semibold text-amber-900">Data & Processing</h3>
            </div>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• <strong>Playwright</strong> - Web scraping and automation</li>
              <li>• <strong>BeautifulSoup</strong> - HTML parsing</li>
              <li>• <strong>Aiohttp</strong> - Async HTTP client</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Backend Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Backend Architecture</h2>
        <p className="text-gray-700 mb-6">
          The backend follows a layered architecture with clear separation between API handling, 
          business logic, and agent orchestration. This design ensures scalability, maintainability, and testability.
        </p>
        
        <MermaidDiagram 
          chart={backendArchitecture}
          id="backend-architecture"
          className="mb-8"
        />

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Server className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">API Layer</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              FastAPI handles HTTP requests, authentication, validation, and response formatting.
            </p>
            <div className="space-y-2 text-xs text-gray-700">
              <div>• Request/Response validation with Pydantic</div>
              <div>• Automatic OpenAPI documentation</div>
              <div>• CORS and security middleware</div>
              <div>• Async request handling</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Zap className="h-6 w-6 text-emerald-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Service Layer</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Business logic services orchestrate agent workflows and manage application state.
            </p>
            <div className="space-y-2 text-xs text-gray-700">
              <div>• Blog generation orchestration</div>
              <div>• Agent lifecycle management</div>
              <div>• State persistence and recovery</div>
              <div>• Error handling and retry logic</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Database className="h-6 w-6 text-amber-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Agent System</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              LangGraph-powered agents handle the entire content generation pipeline.
            </p>
            <div className="space-y-2 text-xs text-gray-700">
              <div>• Multi-node workflow execution</div>
              <div>• State management between nodes</div>
              <div>• External API integrations</div>
              <div>• Observability and monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Workflow */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Request Workflow</h2>
        <p className="text-gray-700 mb-6">
          Every API request follows a standardized workflow with validation, authentication, 
          processing, and response formatting. Error handling is built into every step.
        </p>

        <MermaidDiagram 
          chart={apiWorkflow}
          id="api-workflow"
          className="mb-8"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Request Processing</h3>
            <div className="space-y-3 text-sm text-indigo-800">
              <div>
                <h4 className="font-medium">1. Request Validation</h4>
                <p className="text-indigo-700">Pydantic models validate input data structure and types</p>
              </div>
              <div>
                <h4 className="font-medium">2. Authentication</h4>
                <p className="text-indigo-700">API key validation and rate limiting checks</p>
              </div>
              <div>
                <h4 className="font-medium">3. Parameter Parsing</h4>
                <p className="text-indigo-700">Extract and normalize request parameters</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Response Handling</h3>
            <div className="space-y-3 text-sm text-emerald-800">
              <div>
                <h4 className="font-medium">1. Success Response</h4>
                <p className="text-emerald-700">Structured JSON response with generated content</p>
              </div>
              <div>
                <h4 className="font-medium">2. Error Response</h4>
                <p className="text-emerald-700">Standardized error format with details</p>
              </div>
              <div>
                <h4 className="font-medium">3. Logging</h4>
                <p className="text-emerald-700">Comprehensive logging for debugging and monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Backend Components</h2>
        
        <div className="space-y-6">
          {/* FastAPI Application */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Server className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">FastAPI Application</h3>
            </div>
            <p className="text-gray-700 mb-4">
              The main FastAPI application handles HTTP requests, provides automatic documentation, 
              and manages middleware for CORS, authentication, and logging.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">
{`# src/api/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .routes import blog

def create_app() -> FastAPI:
    app = FastAPI(
        title="OptiBlogAi API",
        description="AI-Powered Blog Generation API",
        version="1.0.0"
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"]
    )
    
    # Include routers
    app.include_router(blog.router, prefix="/api/v1")
    
    return app`}
              </pre>
            </div>
          </div>

          {/* Blog Generation Service */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Code className="h-6 w-6 text-emerald-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Blog Generation Service</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Core service that orchestrates the agent workflow, manages state, and handles 
              the entire blog generation process from keyword to final content.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">
{`# src/services/blog_generator.py
class BlogGenerationService:
    def __init__(self):
        self.graph = create_workflow()
        self.memory = InMemorySaver()
        
    async def generate_blog(
        self, 
        request: BlogGenerationRequest
    ) -> BlogGenerationResponse:
        try:
            # Initialize state
            initial_state = GraphState(
                keyword=request.keyword,
                max_attempts=request.max_attempts,
                seo_threshold=request.seo_threshold
            )
            
            # Execute workflow
            result = await self.graph.ainvoke(
                initial_state,
                config={"configurable": {"thread_id": str(uuid4())}}
            )
            
            return BlogGenerationResponse(
                run_id=str(uuid4()),
                final_blog=result["final_blog"],
                seo_scores=result["seo_scores"],
                attempts=result["attempts"]
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))`}
              </pre>
            </div>
          </div>

          {/* Agent Orchestrator */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-amber-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Agent Orchestrator</h3>
            </div>
            <p className="text-gray-700 mb-4">
              LangGraph workflow that manages the multi-step agent process with state persistence, 
              error handling, and observability through LangSmith.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">
{`# src/agents/graph.py
from langgraph.graph import StateGraph, END
from .nodes import *

def create_workflow() -> StateGraph:
    workflow = StateGraph(GraphState)
    
    # Add nodes
    workflow.add_node("search", search_top_posts)
    workflow.add_node("scrape", scrape_posts)  
    workflow.add_node("clean", clean_validate)
    workflow.add_node("generate", generate_blog)
    workflow.add_node("evaluate", evaluate_seo)
    workflow.add_node("react", react_agent)
    
    # Define edges
    workflow.set_entry_point("search")
    workflow.add_edge("search", "scrape")
    workflow.add_edge("scrape", "clean")
    workflow.add_edge("clean", "generate")
    workflow.add_edge("generate", "evaluate")
    workflow.add_conditional_edges(
        "evaluate", 
        react_agent,
        {
            "continue": "generate",
            "finish": END,
            "fail": END
        }
    )
    
    return workflow.compile(checkpointer=InMemorySaver())`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Endpoints</h2>
        
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-indigo-900">POST /api/v1/generate-blog</h3>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">Primary</span>
            </div>
            <p className="text-indigo-800 text-sm mb-4">
              Generate an SEO-optimized blog post based on a target keyword.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-indigo-900 mb-2">Request Body</h4>
                <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
{`{
  "keyword": "how to use fastapi",
  "max_attempts": 3,
  "seo_threshold": 75,
  "target_length": 1500
}`}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-indigo-900 mb-2">Response</h4>
                <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
{`{
  "run_id": "uuid",
  "final_blog": "HTML content",
  "seo_scores": {...},
  "attempts": 2,
  "execution_time": 45.2
}`}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-emerald-900">GET /api/v1/health</h3>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Health Check</span>
            </div>
            <p className="text-emerald-800 text-sm mb-4">
              Health check endpoint for monitoring service availability.
            </p>
            
            <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
{`{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "groq": "operational",
    "gemini": "operational",
    "langgraph": "operational"
  }
}`}
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-amber-900">GET /api/v1/docs</h3>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">Documentation</span>
            </div>
            <p className="text-amber-800 text-sm">
              Interactive API documentation powered by FastAPI and OpenAPI.
            </p>
          </div>
        </div>
      </section>

      {/* Setup and Configuration */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Setup and Configuration</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Setup</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Clone and Navigate</h4>
              <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                git clone https://github.com/solve-ease/OptiBlogAi.git<br/>
                cd OptiBlogAi/agent_system
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Create Virtual Environment</h4>
              <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                python -m venv venv<br/>
                source venv/bin/activate  # Linux/Mac<br/>
                venv\Scripts\activate     # Windows
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Install Dependencies</h4>
              <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                pip install -r requirements.txt
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. Configure Environment Variables</h4>
              <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                cp .env.example .env<br/>
                # Edit .env with your API keys
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">5. Start the Server</h4>
              <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                uvicorn src.api.app:create_app --reload --factory
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Settings className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Required Environment Variables</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-indigo-600">GROQ_API_KEY</code>
                <p className="text-gray-600 mt-1">Groq Cloud API key for LLM access</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-emerald-600">GOOGLE_API_KEY</code>
                <p className="text-gray-600 mt-1">Google AI API key for Gemini models</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-amber-600">LANGSMITH_API_KEY</code>
                <p className="text-gray-600 mt-1">LangSmith API key for observability</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">GOOGLE_SEARCH_API_KEY</code>
                <p className="text-gray-600 mt-1">Google Custom Search API key</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Shield className="h-6 w-6 text-emerald-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Production Configuration</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-gray-900">Security</h4>
                <p className="text-gray-600">Enable API key authentication and rate limiting</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Logging</h4>
                <p className="text-gray-600">Configure structured logging with appropriate levels</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Monitoring</h4>
                <p className="text-gray-600">Set up health checks and performance monitoring</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Scalability</h4>
                <p className="text-gray-600">Configure worker processes and connection pooling</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BackendSection;