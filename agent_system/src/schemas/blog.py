"""Blog-related request/response schemas."""

from typing import Dict, Optional
from pydantic import BaseModel, Field


class BlogGenerationRequest(BaseModel):
    """Request schema for blog generation endpoint."""
    
    keyword: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Target keyword for blog content generation"
    )
    max_attempts: Optional[int] = Field(
        default=3,
        ge=1,
        le=10,
        description="Maximum number of generation attempts"
    )
    seo_threshold: Optional[float] = Field(
        default=75.0,
        ge=0.0,
        le=100.0,
        description="Minimum SEO score threshold for acceptance"
    )


class BlogGenerationResponse(BaseModel):
    """Response schema for blog generation endpoint."""
    
    run_id: str = Field(..., description="Unique identifier for this generation run")
    final_blog: str = Field(..., description="Generated blog content")
    seo_scores: Dict[str, float] = Field(
        ..., 
        description="Breakdown of SEO scores"
    )
    attempts: int = Field(..., description="Number of attempts made")
    success: bool = Field(..., description="Whether generation was successful")


class HealthResponse(BaseModel):
    """Health check response schema."""
    
    status: str = Field(..., description="Service status")
    timestamp: str = Field(..., description="Current timestamp")
    version: str = Field(..., description="Application version")