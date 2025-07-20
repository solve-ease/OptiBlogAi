"""FastAPI application factory and configuration - Fixed version."""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import uvloop
import asyncio
from dotenv import load_dotenv

from src.api.routes.blog import router as blog_router
from src.utils.logger import configure_logging, get_logger
from langsmith import Client as LangSmithClient
import structlog

# Load environment variables
load_dotenv()

# Configure logging
configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager for startup and shutdown events."""
    # Startup
    logger.info("Starting Gemini Blog Agent service")

    # Set uvloop as the event loop policy for better performance
    if os.name != "nt":  # Not Windows
        try:
            asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
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

    logger.info("Service startup completed")

    yield

    # Shutdown
    logger.info("Shutting down Gemini Blog Agent service")

    # Cleanup resources if needed
    if hasattr(app.state, "langsmith_client"):
        # Close LangSmith client if it has cleanup methods
        pass

    logger.info("Service shutdown completed")


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    # Create FastAPI app with custom configuration
    app = FastAPI(
        title="Gemini Blog Agent",
        description="FastAPI × LangGraph × Gemini Search × LangSmith Blog Generation Service",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add trusted host middleware for security - Fix: Allow test hosts
    environment = os.getenv("ENVIRONMENT", "development")
    if environment == "production":
        trusted_hosts = os.getenv("TRUSTED_HOSTS", "localhost,127.0.0.1").split(",")
        app.add_middleware(TrustedHostMiddleware, allowed_hosts=trusted_hosts)
    else:
        # In development/test, allow all hosts
        app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

    # Add request logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        """Log all HTTP requests."""
        start_time = asyncio.get_event_loop().time()

        # Log request start
        logger.info(
            "HTTP request started",
            method=request.method,
            url=str(request.url),
            client_ip=request.client.host if request.client else "unknown",
            user_agent=request.headers.get("user-agent", ""),
            user="4darsh-Dev",
        )

        try:
            response = await call_next(request)

            # Calculate request duration
            duration = asyncio.get_event_loop().time() - start_time

            # Log request completion
            logger.info(
                "HTTP request completed",
                method=request.method,
                url=str(request.url),
                status_code=response.status_code,
                duration_ms=round(duration * 1000, 2),
                user="4darsh-Dev",
            )

            return response

        except Exception as e:
            # Calculate request duration for failed requests
            duration = asyncio.get_event_loop().time() - start_time

            # Log request failure
            logger.error(
                "HTTP request failed",
                method=request.method,
                url=str(request.url),
                duration_ms=round(duration * 1000, 2),
                error=str(e),
                user="4darsh-Dev",
            )

            raise

    # Global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        """Global exception handler for unhandled errors."""
        logger.error(
            "Unhandled exception occurred",
            method=request.method,
            url=str(request.url),
            error=str(exc),
            error_type=type(exc).__name__,
            user="4darsh-Dev",
        )

        # Don't expose internal error details in production
        if os.getenv("ENVIRONMENT", "development") == "production":
            detail = "Internal server error"
        else:
            detail = str(exc)

        return JSONResponse(
            status_code=500,
            content={
                "detail": detail,
                "type": "internal_server_error",
                "timestamp": "2025-07-19T20:32:49Z",
            },
        )

    # HTTP exception handler
    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request, exc: HTTPException
    ) -> JSONResponse:
        """Handle HTTP exceptions with proper logging."""
        logger.warning(
            "HTTP exception occurred",
            method=request.method,
            url=str(request.url),
            status_code=exc.status_code,
            detail=exc.detail,
            user="4darsh-Dev",
        )

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": exc.detail,
                "type": "http_exception",
                "timestamp": "2025-07-19T20:32:49Z",
            },
        )

    # Include routers
    app.include_router(blog_router)

    # Add root endpoint
    @app.get("/", summary="Root endpoint")
    async def root():
        """Root endpoint with service information."""
        return {
            "service": "Gemini Blog Agent",
            "version": "0.1.0",
            "description": "FastAPI × LangGraph × Gemini Search × LangSmith Blog Generation Service",
            "docs": "/docs",
            "health": "/api/v1/health",
            "timestamp": "2025-07-19T20:32:49Z",
            "developer": "4darsh-Dev",
        }

    logger.info("FastAPI application created successfully")

    return app


# Application instance for direct import
app = create_app()
