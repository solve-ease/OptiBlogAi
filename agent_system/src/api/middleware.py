"""Custom middleware for rate limiting, logging, and security."""

import time
import asyncio
from typing import Dict, Optional
from collections import defaultdict, deque
from fastapi import Request, Response, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from src.utils.logger import get_logger

logger = get_logger(__name__)

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware using sliding window algorithm."""
    
    def __init__(self, app, calls: int = 100, period: int = 3600):
        """Initialize rate limiter.
        
        Args:
            app: FastAPI application
            calls: Number of calls allowed per period
            period: Time period in seconds (default: 1 hour)
        """
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients: Dict[str, deque] = defaultdict(deque)
        
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier from request."""
        # Try to get API key from authorization header
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            api_key = auth_header[7:]
            return f"api_key:{api_key[:8]}..."  # Use first 8 chars for identification
        
        # Fallback to IP address
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        client_ip = request.client.host if request.client else "unknown"
        return f"ip:{client_ip}"
    
    def _is_rate_limited(self, client_id: str) -> bool:
        """Check if client is rate limited."""
        now = time.time()
        client_requests = self.clients[client_id]
        
        # Remove old requests outside the time window
        while client_requests and client_requests[0] <= now - self.period:
            client_requests.popleft()
        
        # Check if limit exceeded
        if len(client_requests) >= self.calls:
            return True
        
        # Add current request
        client_requests.append(now)
        return False
    
    async def dispatch(self, request: Request, call_next):
        """Process request through rate limiting."""
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/api/v1/health", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        client_id = self._get_client_id(request)
        
        if self._is_rate_limited(client_id):
            logger.warning(
                "Rate limit exceeded",
                client_id=client_id,
                path=request.url.path,
                method=request.method
            )
            return Response(
                content='{"detail":"Rate limit exceeded. Try again later."}',
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                headers={"Content-Type": "application/json"}
            )
        
        # Add rate limit headers
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Add custom headers
        response.headers["X-RateLimit-Limit"] = str(self.calls)
        response.headers["X-RateLimit-Remaining"] = str(
            max(0, self.calls - len(self.clients[client_id]))
        )
        response.headers["X-Process-Time"] = str(round(process_time, 4))
        
        logger.info(
            "Request processed",
            client_id=client_id,
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            process_time=round(process_time, 4)
        )
        
        return response

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for detailed request/response logging."""
    
    async def dispatch(self, request: Request, call_next):
        """Log request and response details."""
        start_time = time.time()
        
        # Log request
        logger.info(
            "Incoming request",
            method=request.method,
            path=request.url.path,
            query_params=dict(request.query_params),
            client_ip=request.client.host if request.client else "unknown",
            user_agent=request.headers.get("user-agent", "unknown")
        )
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            "Request completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            process_time=round(process_time, 4)
        )
        
        return response