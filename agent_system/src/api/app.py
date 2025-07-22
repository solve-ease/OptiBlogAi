"""Enhanced FastAPI application with security and middleware."""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
import uvloop
import asyncio
from dotenv import load_dotenv

from src.api.routes.blog import router as blog_router
from src.api.middleware import RateLimitMiddleware, RequestLoggingMiddleware
from src.api.auth import verify_api_key
from src.utils.logger import configure_logging, get_logger
from src.schemas.models import ErrorDetail
from langsmith import Client as LangSmithClient
from fastapi.encoders import jsonable_encoder
# Load environment variables
load_dotenv()

# Configure logging
configure_logging()
logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager for startup and shutdown events."""
    # Startup
    logger.info("Starting Enhanced Gemini Blog Agent service")

    # Set uvloop as the event loop policy for better performance
    if os.name != "nt":  # Not Windows
        try:
            asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
            logger.info("uvloop event loop policy set")
        except ImportError:
            logger.warning("uvloop not available, using default event loop")

    # Initialize LangSmith client if API key is provided
    langsmith_api_key = os.getenv("LANGSMITH_API_KEY")
    if langsmith_api_key:
        try:
            langsmith_client = LangSmithClient(api_key=langsmith_api_key)
            app.state.langsmith_client = langsmith_client
            logger.info("LangSmith client initialized successfully")
        except Exception as e:
            logger.warning("Failed to initialize LangSmith client", error=str(e))
    else:
        logger.info("LangSmith API key not provided, skipping initialization")

    # Pre-compile the blog generation graph
    try:
        from src.agents.graph import get_blog_generation_graph
        await get_blog_generation_graph()
        logger.info("Blog generation graph pre-compiled successfully")
    except Exception as e:
        logger.error("Failed to pre-compile blog generation graph", error=str(e))

    # Initialize usage tracking
    app.state.usage_stats = {
        "total_requests": 0,
        "successful_requests": 0,
        "failed_requests": 0,
        "rate_limit_hits": 0
    }

    logger.info("Enhanced service startup completed")
    yield

    # Shutdown
    logger.info("Shutting down Enhanced Gemini Blog Agent service")
    
    # Log final statistics
    if hasattr(app.state, 'usage_stats'):
        logger.info("Final usage statistics", **app.state.usage_stats)
    
    logger.info("Enhanced service shutdown completed")

def create_app() -> FastAPI:
    """Create and configure enhanced FastAPI application."""
    
    # Create FastAPI app with custom configuration
    app = FastAPI(
        title="Enhanced Gemini Blog Agent",
        description="Secure FastAPI × LangGraph × Gemini Search × LangSmith Blog Generation Service with API Key Authentication",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # Add custom exception handler for detailed error responses
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """Handle HTTP exceptions with detailed error information."""
        error_detail = ErrorDetail(
            error_code=f"HTTP_{exc.status_code}",
            error_message=exc.detail,
            details={
                "path": str(request.url.path),
                "method": request.method,
                "status_code": exc.status_code
            }
        )
        
        logger.error(
            "HTTP exception occurred",
            status_code=exc.status_code,
            detail=exc.detail,
            path=request.url.path,
            method=request.method
        )
        
        return JSONResponse(
            status_code=exc.status_code,
            content=jsonable_encoder(error_detail)
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle general exceptions."""
        error_detail = ErrorDetail(
            error_code="INTERNAL_SERVER_ERROR",
            error_message="An unexpected error occurred",
            details={
                "path": str(request.url.path),
                "method": request.method,
                "error_type": type(exc).__name__
            }
        )
        
        logger.error(
            "Unexpected exception occurred",
            error=str(exc),
            error_type=type(exc).__name__,
            path=request.url.path,
            method=request.method
        )
        
        return JSONResponse(
            status_code=500,
            content=jsonable_encoder(error_detail)
        )

    # Add middleware in correct order (last added = first executed)
    
    # CORS middleware (should be last)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
    
    # Trusted host middleware for production
    environment = os.getenv("ENVIRONMENT", "development")
    if environment == "production":
        trusted_hosts = os.getenv("TRUSTED_HOSTS", "localhost,127.0.0.1").split(",")
        app.add_middleware(TrustedHostMiddleware, allowed_hosts=trusted_hosts)
    
    # Rate limiting middleware
    rate_limit_calls = int(os.getenv("RATE_LIMIT_CALLS", "100"))
    rate_limit_period = int(os.getenv("RATE_LIMIT_PERIOD", "3600"))  # 1 hour
    app.add_middleware(
        RateLimitMiddleware,
        calls=rate_limit_calls,
        period=rate_limit_period
    )
    
    # Request logging middleware (should be first)
    app.add_middleware(RequestLoggingMiddleware)

    # Add health check endpoint (no auth required)
    @app.get("/health", tags=["health"])
    @app.get("/api/v1/health", tags=["health"])
    async def health_check():
        """Health check endpoint."""
        return {
            "status": "healthy",
            "timestamp": "2025-07-22T10:23:52Z",
            "version": "1.0.0",
            "environment": os.getenv("ENVIRONMENT", "development")
        }

    # Add API statistics endpoint (requires auth)
    @app.get("/api/v1/stats", tags=["monitoring"])
    async def get_api_stats(authorized: bool = Depends(verify_api_key)):
        """Get API usage statistics (requires API key)."""
        if hasattr(app.state, 'usage_stats'):
            return app.state.usage_stats
        return {"message": "No statistics available"}

    # Include routers with API key dependency
    app.include_router(blog_router, dependencies=[Depends(verify_api_key)])

    logger.info(
        "Enhanced FastAPI application created",
        rate_limit_calls=rate_limit_calls,
        rate_limit_period=rate_limit_period,
        environment=environment,
        api_key_configured=bool(os.getenv("API_KEY"))
    )

    return app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api.app:create_app", host="0.0.0.0", port=8000, factory=True)