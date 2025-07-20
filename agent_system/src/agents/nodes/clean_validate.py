"""Clean and validate scraped content node implementation."""

from typing import Dict, Any, List
from pydantic import BaseModel, ValidationError
from src.schemas.state import GraphState
from src.tools.scraper import create_web_scraper
from src.utils.logger import get_logger

logger = get_logger(__name__)


class CleanedPostSchema(BaseModel):
    """Schema for cleaned post content."""
    url: str
    title: str
    meta_description: str
    headings: List[str]
    paragraphs: List[str]
    word_count: int


async def clean_validate(state: GraphState) -> Dict[str, Any]:
    """Clean and validate scraped HTML content.
    
    Args:
        state: Current graph state containing raw_html_content
        
    Returns:
        Updated state with cleaned_posts
    """
    raw_html_content = getattr(state, 'raw_html_content', {})
    
    if not raw_html_content:
        logger.warning("No raw HTML content to clean")
        return {"cleaned_posts": []}
    
    logger.info("Starting content cleaning and validation", content_count=len(raw_html_content))
    
    cleaned_posts = []
    scraper = create_web_scraper()
    
    for url, html in raw_html_content.items():
        if not html:
            logger.debug("Skipping empty HTML content", url=url)
            continue
            
        try:
            # Clean HTML content using scraper utility
            cleaned_content = scraper.clean_html_content(html, url)
            
            if not cleaned_content:
                logger.warning("Failed to clean content", url=url)
                continue
            
            # Validate against schema
            validated_post = CleanedPostSchema(**cleaned_content)
            cleaned_posts.append(validated_post.model_dump())
            
            logger.debug(
                "Successfully cleaned and validated post",
                url=url,
                word_count=validated_post.word_count,
                headings_count=len(validated_post.headings),
                paragraphs_count=len(validated_post.paragraphs)
            )
            
        except ValidationError as e:
            logger.warning(
                "Content validation failed",
                url=url,
                validation_errors=str(e)
            )
            continue
        except Exception as e:
            logger.error(
                "Unexpected error during content cleaning",
                url=url,
                error=str(e)
            )
            continue
    
    # Filter posts with insufficient content
    quality_posts = []
    for post in cleaned_posts:
        if (post["word_count"] >= 300 and 
            len(post["paragraphs"]) >= 3 and
            post["title"].strip()):
            quality_posts.append(post)
        else:
            logger.debug(
                "Filtered out low-quality post",
                url=post["url"],
                word_count=post["word_count"],
                paragraphs=len(post["paragraphs"])
            )
    
    logger.info(
        "Content cleaning completed",
        total_raw=len(raw_html_content),
        cleaned=len(cleaned_posts),
        quality_filtered=len(quality_posts)
    )
    
    return {"cleaned_posts": quality_posts}