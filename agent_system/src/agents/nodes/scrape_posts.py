"""Scrape posts node implementation - Fixed version."""

from typing import Dict, Any, List
from src.schemas.state import GraphState
from src.tools.scraper import create_web_scraper, ScrapeError
from src.utils.logger import get_logger

logger = get_logger(__name__)


async def scrape_posts(state: GraphState) -> Dict[str, Any]:
    """Scrape content from the top posts URLs.
    
    Args:
        state: Current graph state containing top_posts
        
    Returns:
        Updated state with raw_html_content
    """
    top_posts = state.top_posts
    
    if not top_posts:
        logger.warning("No top posts to scrape")
        return {"raw_html_content": {}}
    
    # Extract URLs from top posts
    urls = [post.get("url", "") for post in top_posts if post.get("url")]
    
    if not urls:
        logger.warning("No valid URLs found in top posts")
        return {"raw_html_content": {}}
    
    logger.info("Starting to scrape posts", url_count=len(urls))
    
    try:
        # Create web scraper instance
        scraper = create_web_scraper()
        
        # Fix: Properly await the async method
        raw_html_content = await scraper.scrape_multiple_urls(urls)
        
        # Filter out failed scrapes
        successful_scrapes = {
            url: html for url, html in raw_html_content.items() 
            if html is not None
        }
        
        logger.info(
            "Scraping completed",
            total_urls=len(urls),
            successful=len(successful_scrapes),
            failed=len(urls) - len(successful_scrapes)
        )
        
        return {"raw_html_content": successful_scrapes}
        
    except ScrapeError as e:
        logger.error("Scraping failed", error=str(e))
        # Return empty dict to continue pipeline
        return {"raw_html_content": {}}
    except Exception as e:
        logger.error("Unexpected error during scraping", error=str(e))
        return {"raw_html_content": {}}