from typing import Dict, Any
from src.schemas.state import GraphState
from src.tools.scraper import create_scraper
from src.utils.logger import get_logger

logger = get_logger(__name__)


async def scrape_posts(state: GraphState) -> Dict[str, Any]:
    """Scrape content from the top posts URLs."""
    top_posts = state.top_posts or []
    urls = [p["url"] for p in top_posts if p.get("url")]
    if not urls:
        logger.warning("No URLs to scrape")
        return {"raw_html_content": {}}

    logger.info("Starting to scrape posts", url_count=len(urls))
    scraper = create_scraper()

    try:
        raw_html = await scraper.scrape_multiple(urls)
        successful = {u: h for u, h in raw_html.items() if h}
        logger.info(
            "Scraping completed",
            total=len(urls),
            successful=len(successful),
            failed=len(urls) - len(successful),
        )
        return {"raw_html_content": successful}

    except Exception as e:
        logger.error("Scraping failed", error=str(e))
        return {"raw_html_content": {}}
