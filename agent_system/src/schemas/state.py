"""LangGraph state schema definition - Fixed version."""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class GraphState(BaseModel):
    """State schema for the LangGraph workflow."""
    
    # Use ConfigDict instead of Config class (Pydantic v2)
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    keyword: str = Field(..., description="Target keyword for blog generation")
    top_posts: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Top-10 search results with URL, title, snippet"
    )
    cleaned_posts: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Cleaned and validated post content"
    )
    draft_blog: str = Field(
        default="",
        description="Generated blog content draft"
    )
    seo_scores: Dict[str, float] = Field(
        default_factory=dict,
        description="SEO evaluation scores breakdown"
    )
    final_score: float = Field(
        default=0.0,
        description="Final aggregated SEO score"
    )
    attempts: int = Field(
        default=0,
        description="Number of generation attempts made"
    )
    max_attempts: int = Field(
        default=3,
        description="Maximum allowed generation attempts"
    )
    seo_threshold: float = Field(
        default=75.0,
        description="Minimum SEO score threshold for acceptance"
    )
    final_blog: str = Field(
        default="",
        description="Final optimized blog content"
    )
    
    # Add raw_html_content field for scraping results
    raw_html_content: Optional[Dict[str, str]] = Field(
        default_factory=dict,
        description="Raw HTML content from scraped URLs"
    )