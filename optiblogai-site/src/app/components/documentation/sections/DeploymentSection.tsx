"use client";

import React from "react";
import {
  Settings,
  Server,
  Cloud,
  Container,
  Shield,
  Monitor,
} from "lucide-react";

const DeploymentSection: React.FC = () => {
  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Deployment Guide
      </h1>

      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center mb-4">
          <Cloud className="h-8 w-8 mr-3" />
          <h2 className="text-2xl font-bold text-white">
            Production Deployment
          </h2>
        </div>
        <p className="text-lg text-green-100 mb-4">
          Deploy OptiBlogAi to production with confidence using our
          comprehensive deployment guide covering Docker, cloud platforms,
          security best practices, and monitoring.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <h3 className="font-semibold mb-2">Docker Ready</h3>
            <p className="text-gray-700 text-sm mb-2">
              Containerized deployment with multi-stage builds
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <h3 className="font-semibold mb-2">Cloud Native</h3>
            <p className="text-gray-700 text-sm mb-2">
              Optimized for AWS, GCP, Azure, and Vercel
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <h3 className="font-semibold mb-2">Production Ready</h3>
            <p className="text-gray-700 text-sm mb-2">
              Security, monitoring, and scalability built-in
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Prerequisites
        </h2>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">
            Before You Begin
          </h3>
          <p className="text-amber-700 mb-4">
            Ensure you have the following requirements and accounts set up
            before deploying OptiBlogAi to production.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Requirements
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Docker 20.10+ and Docker Compose
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                <span className="text-gray-700">Node.js 18+ for frontend</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                <span className="text-gray-700">Python 3.10+ for backend</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span className="text-gray-700">2GB+ RAM, 10GB+ storage</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Required API Keys
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                <span className="text-gray-700">Groq Cloud API key</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Google AI (Gemini) API key
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Google Custom Search API key
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  LangSmith API key (optional)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Docker Deployment */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Docker Deployment
        </h2>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Container className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-blue-900">
              Containerized Deployment
            </h3>
          </div>
          <p className="text-blue-800 mb-4">
            OptiBlogAi includes Docker configurations for both development and
            production environments with multi-stage builds and optimized
            images.
          </p>
        </div>

        <div className="space-y-8">
          {/* Docker Compose Setup */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Start with Docker Compose
            </h3>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                1. Clone and Configure
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                {`# Clone the repository
git clone https://github.com/solve-ease/OptiBlogAi.git
cd OptiBlogAi

# Copy environment file
cp .env.example .env

# Edit .env with your API keys
nano .env`}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                2. Start Services
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                {`# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps`}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                3. Verify Deployment
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                {`# Frontend: http://localhost:3000
curl http://localhost:3000

# Backend API: http://localhost:8000
curl http://localhost:8000/health

# API Documentation: http://localhost:8000/docs`}
              </div>
            </div>
          </div>

          {/* Production Docker Setup */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Production Docker Configuration
            </h3>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                docker-compose.prod.yml
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                {`version: '3.8'

services:
  frontend:
    build:
      context: ./optiblogai-site
      dockerfile: Dockerfile.prod
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  backend:
    build:
      context: ./agent_system
      dockerfile: Dockerfile.prod
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - WORKERS=4
    env_file:
      - .env
    restart: unless-stopped
    depends_on:
      - redis
      
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  redis_data:`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Platform Deployments */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Cloud Platform Deployments
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Vercel Deployment */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Cloud className="h-6 w-6 text-black mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Vercel (Frontend)
              </h3>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              Deploy the Next.js frontend to Vercel for optimal performance and
              global CDN.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Automatic Deployment
                </h4>
                <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                  {`# Connect GitHub repository to Vercel
# Push to main branch triggers deployment

git push origin main`}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Manual Deployment
                </h4>
                <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                  {`cd optiblogai-site
npm install -g vercel
vercel --prod`}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Environment Variables
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Set NEXT_PUBLIC_API_URL in Vercel dashboard</div>
                  <div>• Configure build command: npm run build</div>
                  <div>• Set output directory: .next</div>
                </div>
              </div>
            </div>
          </div>

          {/* Railway Deployment */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Server className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Railway (Backend)
              </h3>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              Deploy the FastAPI backend to Railway for simple Python app
              hosting.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Railway Setup
                </h4>
                <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                  {`# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up`}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Configuration
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Root directory: agent_system</div>
                  <div>
                    • Start command: uvicorn src.api.app:create_app --host
                    0.0.0.0 --port $PORT --factory
                  </div>
                  <div>
                    • Add all environment variables in Railway dashboard
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AWS Deployment */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Cloud className="h-6 w-6 text-orange-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                AWS (Complete Stack)
              </h3>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              Full AWS deployment with ECS, RDS, ElastiCache, and Application
              Load Balancer.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Infrastructure Components
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• ECS Fargate for container orchestration</div>
                  <div>• RDS PostgreSQL for persistent data</div>
                  <div>• ElastiCache Redis for caching</div>
                  <div>• ALB for load balancing</div>
                  <div>• CloudFront for CDN</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Deployment Script
                </h4>
                <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                  {`# Using AWS CLI and CloudFormation
aws cloudformation deploy \\
  --template-file infrastructure/aws-stack.yaml \\
  --stack-name optiblogai-prod \\
  --capabilities CAPABILITY_IAM \\
  --parameter-overrides Environment=production`}
                </div>
              </div>
            </div>
          </div>

          {/* Google Cloud Deployment */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Cloud className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Google Cloud (GKE)
              </h3>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              Kubernetes deployment on Google Kubernetes Engine with
              auto-scaling.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">GKE Setup</h4>
                <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                  {`# Create GKE cluster
gcloud container clusters create optiblogai-cluster \\
  --zone=us-central1-a \\
  --num-nodes=3 \\
  --enable-autoscaling \\
  --max-nodes=10

# Deploy application
kubectl apply -f k8s/`}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Auto-scaling Configuration
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• HPA for CPU/memory based scaling</div>
                  <div>• VPA for optimal resource allocation</div>
                  <div>• Cluster autoscaler for node scaling</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environment Configuration */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Environment Configuration
        </h2>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Production Environment Variables
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Backend (.env)</h4>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                {`# Core Configuration
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# API Keys
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_API_KEY=your_google_ai_key_here
GOOGLE_SEARCH_API_KEY=your_google_search_key_here
LANGSMITH_API_KEY=your_langsmith_key_here

# Database & Cache
DATABASE_URL=postgresql://user:pass@host:5432/optiblogai
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-super-secret-key-here
JWT_SECRET=your-jwt-secret-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Performance
WORKERS=4
MAX_CONCURRENT_REQUESTS=10
REQUEST_TIMEOUT=60

# Monitoring
LANGSMITH_PROJECT=optiblogai-production
SENTRY_DSN=your_sentry_dsn_here`}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Frontend Environment
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                {`# Next.js Environment (.env.local)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_ENVIRONMENT=production

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTAG_ID=GT-XXXXXXXXX

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Security Best Practices
        </h2>

        <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
          <div className="flex">
            <Shield className="h-6 w-6 text-red-400 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Security Checklist
              </h3>
              <p className="text-red-700">
                Follow these security best practices to ensure your OptiBlogAi
                deployment is secure and protected against common
                vulnerabilities.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  API Security
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>API Key Management:</strong> Use environment
                    variables, never commit keys to version control
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Rate Limiting:</strong> Implement per-IP and
                    per-user rate limits
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Input Validation:</strong> Validate all inputs with
                    Pydantic models
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>CORS Configuration:</strong> Configure CORS properly
                    for production domains
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-emerald-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Infrastructure Security
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>HTTPS/TLS:</strong> Use SSL certificates for all
                    traffic
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Firewall Rules:</strong> Restrict access to
                    necessary ports only
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Regular Updates:</strong> Keep dependencies and
                    system packages updated
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Secret Management:</strong> Use cloud secret
                    management services
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security Headers Configuration
              </h3>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                {`# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                API Rate Limiting
              </h3>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm text-gray-800 overflow-x-auto">
                {`# FastAPI rate limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/generate-blog")
@limiter.limit("10/hour")
async def generate_blog(request: Request):
    # Your endpoint logic here
    pass`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monitoring and Observability */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Monitoring & Observability
        </h2>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Monitor className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Comprehensive Monitoring Stack
            </h3>
          </div>
          <p className="text-gray-700 mb-6">
            Monitor your OptiBlogAi deployment with comprehensive observability
            tools covering application performance, infrastructure health, and
            business metrics.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="font-medium text-indigo-900 mb-2">
                Application Monitoring
              </h4>
              <div className="text-sm text-indigo-800 space-y-1">
                <div>• LangSmith for agent tracing</div>
                <div>• Sentry for error tracking</div>
                <div>• Custom metrics dashboard</div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-medium text-emerald-900 mb-2">
                Infrastructure Monitoring
              </h4>
              <div className="text-sm text-emerald-800 space-y-1">
                <div>• Prometheus + Grafana</div>
                <div>• Container resource usage</div>
                <div>• Database performance</div>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">
                Business Metrics
              </h4>
              <div className="text-sm text-amber-800 space-y-1">
                <div>• API usage analytics</div>
                <div>• Content generation success rates</div>
                <div>• User engagement metrics</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Health Checks
            </h3>
            <div className="bg-gray-50 rounded p-4 font-mono text-sm text-gray-800 overflow-x-auto">
              {`# Docker health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \\
  CMD curl -f http://localhost:8000/health || exit 1

# Kubernetes liveness probe
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 30`}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Alerting Rules
            </h3>
            <div className="bg-gray-50 rounded p-4 font-mono text-sm text-gray-800 overflow-x-auto">
              {`# Prometheus alerting rules
groups:
- name: optiblogai
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    annotations:
      summary: "High error rate detected"
      
  - alert: LowSuccessRate
    expr: blog_generation_success_rate < 0.8
    for: 10m
    annotations:
      summary: "Blog generation success rate is low"`}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Optimization */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibent text-gray-900 mb-4">
          Performance Optimization
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                Backend Optimization
              </h3>
              <div className="space-y-3 text-sm text-indigo-800">
                <div>
                  <strong>Connection Pooling:</strong> Configure database and
                  Redis connection pools
                </div>
                <div>
                  <strong>Async Processing:</strong> Use async/await throughout
                  the pipeline
                </div>
                <div>
                  <strong>Caching Strategy:</strong> Implement multi-layer
                  caching for API responses
                </div>
                <div>
                  <strong>Worker Scaling:</strong> Scale Uvicorn workers based
                  on CPU cores
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-3">
                Database Optimization
              </h3>
              <div className="space-y-3 text-sm text-emerald-800">
                <div>
                  <strong>Indexing:</strong> Create indexes on frequently
                  queried columns
                </div>
                <div>
                  <strong>Query Optimization:</strong> Use query profiling and
                  optimization
                </div>
                <div>
                  <strong>Connection Pooling:</strong> Configure optimal pool
                  sizes
                </div>
                <div>
                  <strong>Read Replicas:</strong> Use read replicas for scaling
                  read operations
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                Frontend Optimization
              </h3>
              <div className="space-y-3 text-sm text-amber-800">
                <div>
                  <strong>Code Splitting:</strong> Implement route-based code
                  splitting
                </div>
                <div>
                  <strong>Image Optimization:</strong> Use next/image for
                  optimized images
                </div>
                <div>
                  <strong>CDN:</strong> Serve static assets through CDN
                </div>
                <div>
                  <strong>Bundle Analysis:</strong> Regular bundle size analysis
                  and optimization
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                Infrastructure Scaling
              </h3>
              <div className="space-y-3 text-sm text-purple-800">
                <div>
                  <strong>Auto-scaling:</strong> Configure HPA based on
                  CPU/memory usage
                </div>
                <div>
                  <strong>Load Balancing:</strong> Distribute traffic across
                  multiple instances
                </div>
                <div>
                  <strong>Resource Limits:</strong> Set appropriate CPU/memory
                  limits
                </div>
                <div>
                  <strong>Monitoring:</strong> Monitor performance metrics and
                  set alerts
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Common Issues & Troubleshooting
        </h2>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">
              🔧 Deployment Failures
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-red-800">Issue:</strong>{" "}
                <span className="text-red-700">Container fails to start</span>
                <div className="text-red-600 mt-1">
                  <strong>Solution:</strong> Check environment variables, verify
                  API keys, review container logs
                </div>
              </div>
              <div>
                <strong className="text-red-800">Issue:</strong>{" "}
                <span className="text-red-700">Out of memory errors</span>
                <div className="text-red-600 mt-1">
                  <strong>Solution:</strong> Increase container memory limits,
                  optimize model loading, implement proper caching
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">
              ⚡ Performance Issues
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-orange-800">Issue:</strong>{" "}
                <span className="text-orange-700">Slow API responses</span>
                <div className="text-orange-600 mt-1">
                  <strong>Solution:</strong> Enable caching, optimize database
                  queries, scale worker processes
                </div>
              </div>
              <div>
                <strong className="text-orange-800">Issue:</strong>{" "}
                <span className="text-orange-700">High resource usage</span>
                <div className="text-orange-600 mt-1">
                  <strong>Solution:</strong> Profile application, implement
                  connection pooling, optimize model usage
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              🔍 Debugging Commands
            </h3>
            <div className="bg-white rounded p-4 font-mono text-sm text-gray-800 overflow-x-auto">
              {`# Check container logs
docker logs -f optiblogai-backend

# Debug database connections
docker exec -it optiblogai-backend python -c "from src.database import test_connection; test_connection()"

# Test API endpoints
curl -X POST http://localhost:8000/health

# Monitor resource usage
docker stats

# Check service status
docker-compose ps`}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeploymentSection;
