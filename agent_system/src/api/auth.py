"""API Key based authentication for FastAPI."""

import os
from typing import Optional
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.utils.logger import get_logger
from src.config import settings

logger = get_logger(__name__)

# Security scheme
security = HTTPBearer()

class APIKeyAuth:
    """API Key authentication handler."""
    
    def __init__(self):
        self.api_key = settings.API_KEY
        if not self.api_key:
            logger.warning("API_KEY environment variable not set. API will be unsecured!")
    
    async def verify_api_key(
        self, 
        credentials: HTTPAuthorizationCredentials = Security(security)
    ) -> bool:
        """Verify the provided API key.
        
        Args:
            credentials: HTTP Bearer token credentials
            
        Returns:
            True if valid API key
            
        Raises:
            HTTPException: If API key is invalid or missing
        """
        if not self.api_key:
            # If no API key is configured, allow access (development mode)
            logger.debug("No API key configured, allowing access")
            return True
            
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        provided_key = credentials.credentials
        
        if provided_key != self.api_key:
            logger.warning(
                "Invalid API key attempted",
                provided_key_prefix=provided_key[:8] + "..." if len(provided_key) > 8 else "short_key",
                user_ip=None  # Add request IP in middleware if needed
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.debug("API key verified successfully")
        return True

# Global instance
api_key_auth = APIKeyAuth()

async def verify_api_key(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> bool:
    """Dependency function for API key verification."""
    return await api_key_auth.verify_api_key(credentials)