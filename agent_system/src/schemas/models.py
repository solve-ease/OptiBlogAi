"""Enhanced Pydantic models for better API customization."""

from typing import Dict, List, Optional, Any, Literal
from pydantic import BaseModel, Field, validator
from datetime import datetime
import re

class BlogCustomization(BaseModel):
    """Blog customization options for enhanced user control."""
    
    tone: Optional[Literal["professional", "casual", "technical", "friendly", "authoritative"]] = Field(
        default="professional",
        description="Writing tone for the blog content"
    )
    
    target_audience: Optional[Literal["beginners", "intermediate", "advanced", "general"]] = Field(
        default="general",
        description="Target audience level"
    )
    
    content_type: Optional[Literal["tutorial", "guide", "review", "comparison", "news", "opinion"]] = Field(
        default="guide",
        description="Type of content to generate"
    )
    
    word_count_target: Optional[int] = Field(
        default=1500,
        ge=800,
        le=5000,
        description="Target word count for the blog post"
    )
    
    include_faq: Optional[bool] = Field(
        default=True,
        description="Whether to include FAQ section"
    )
    
    include_conclusion: Optional[bool] = Field(
        default=True,
        description="Whether to include conclusion section"
    )
    
    include_table_of_contents: Optional[bool] = Field(
        default=True,
        description="Whether to include table of contents"
    )
    
    focus_keywords: Optional[List[str]] = Field(
        default=[],
        max_items=10,
        description="Additional focus keywords to include"
    )
    
    exclude_domains: Optional[List[str]] = Field(
        default=[],
        max_items=20,
        description="Domains to exclude from content scraping"
    )

class EnhancedBlogGenerationRequest(BaseModel):
    """Enhanced request schema with customization options."""

    keyword: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Target keyword for blog content generation",
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
        description="Minimum SEO score threshold for acceptance",
    )
    
    customization: Optional[BlogCustomization] = Field(
        default=BlogCustomization(),
        description="Blog customization options"
    )
    
    priority: Optional[Literal["low", "normal", "high"]] = Field(
        default="normal",
        description="Processing priority level"
    )
    
    callback_url: Optional[str] = Field(
        default=None,
        description="Webhook URL for async processing notifications"
    )
    
    user_id: Optional[str] = Field(
        default=None,
        max_length=100,
        description="User identifier for tracking"
    )
    
    @validator('keyword')
    def validate_keyword(cls, v):
        """Validate keyword format."""
        if not v.strip():
            raise ValueError("Keyword cannot be empty or whitespace only")
        
        # Remove excessive whitespace
        v = re.sub(r'\s+', ' ', v.strip())
        
        # Basic validation for reasonable keywords
        if len(v.split()) > 10:
            raise ValueError("Keyword should not exceed 10 words")
            
        return v
    
    @validator('callback_url')
    def validate_callback_url(cls, v):
        """Validate callback URL format."""
        if v is not None:
            url_pattern = re.compile(
                r'^https?://'  # http:// or https://
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
                r'localhost|'  # localhost...
                r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
                r'(?::\d+)?'  # optional port
                r'(?:/?|[/?]\S+)$', re.IGNORECASE
            )
            if not url_pattern.match(v):
                raise ValueError("Invalid callback URL format")
        return v

class SEOScoreDetails(BaseModel):
    """Detailed SEO score breakdown."""
    
    title_score: float = Field(..., ge=0, le=100)
    meta_description_score: float = Field(..., ge=0, le=100)
    keyword_optimization_score: float = Field(..., ge=0, le=100)
    content_structure_score: float = Field(..., ge=0, le=100)
    readability_score: float = Field(..., ge=0, le=100)
    content_quality_score: float = Field(..., ge=0, le=100)
    technical_seo_score: float = Field(..., ge=0, le=100)
    final_score: float = Field(..., ge=0, le=100)
    
    # Additional metrics
    word_count: Optional[int] = Field(default=None, description="Total word count")
    reading_time_minutes: Optional[int] = Field(default=None, description="Estimated reading time")
    keyword_density: Optional[float] = Field(default=None, description="Target keyword density percentage")

class ContentMetadata(BaseModel):
    """Metadata about the generated content."""
    
    sources_used: List[str] = Field(default=[], description="URLs of sources used")
    processing_time_seconds: float = Field(..., description="Total processing time")
    model_used: str = Field(..., description="AI model used for generation")
    content_language: str = Field(default="en", description="Content language")
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    
class EnhancedBlogGenerationResponse(BaseModel):
    """Enhanced response schema with detailed information."""

    run_id: str = Field(..., description="Unique identifier for this generation run")
    final_blog: str = Field(..., description="Generated blog content")
    seo_scores: SEOScoreDetails = Field(..., description="Detailed SEO score breakdown")
    attempts: int = Field(..., description="Number of attempts made")
    success: bool = Field(..., description="Whether generation was successful")
    
    # Enhanced fields
    metadata: ContentMetadata = Field(..., description="Content generation metadata")
    customization_applied: BlogCustomization = Field(..., description="Applied customization settings")
    
    # Optional fields for async processing
    status: Literal["completed", "processing", "failed"] = Field(default="completed")
    progress_percentage: Optional[int] = Field(default=100, ge=0, le=100)
    
    # Analytics
    estimated_reading_time: Optional[int] = Field(default=None, description="Estimated reading time in minutes")
    content_quality_grade: Optional[Literal["A", "B", "C", "D", "F"]] = Field(default=None)

class ApiUsageStats(BaseModel):
    """API usage statistics for monitoring."""
    
    total_requests: int = Field(..., description="Total API requests")
    successful_requests: int = Field(..., description="Successful requests")
    failed_requests: int = Field(..., description="Failed requests")
    average_processing_time: float = Field(..., description="Average processing time in seconds")
    rate_limit_hits: int = Field(..., description="Number of rate limit violations")
    last_request_at: Optional[datetime] = Field(default=None)

class ErrorDetail(BaseModel):
    """Detailed error information."""
    
    error_code: str = Field(..., description="Error code")
    error_message: str = Field(..., description="Human-readable error message")
    details: Optional[Dict[str, Any]] = Field(default={}, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    run_id: Optional[str] = Field(default=None, description="Associated run ID if available")