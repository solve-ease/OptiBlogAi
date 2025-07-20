# requirements.txt
# google-custom-search[async]>=3.0.0

import os, asyncio
from typing import List, Dict, Any
import google_custom_search
from src.utils.logger import get_logger
from src.config import settings

logger = get_logger(__name__)

GOOGLE_API_KEY = settings.GOOGLE_API_KEY
GOOGLE_SEARCH_ENGINE_ID = settings.GOOGLE_SEARCH_ENGINE_ID


class SearchError(Exception):
    pass


class SearchClient:
    def __init__(self, api_key: str, cx: str):
        self.client = google_custom_search.CustomSearch(
            token=api_key, engine_id=cx, image=False
        )
        logger.info("SearchClient initialized (async)")

    async def search_top_posts(
        self, keyword: str, num_results: int = 10
    ) -> List[Dict[str, str]]:
        try:
            results = await self.client.search_async(keyword)
            output = []
            for idx, r in enumerate(results[:num_results]):
                output.append({"url": r.url, "title": r.title, "snippet": r.snippet})
            logger.info("Async search completed", keyword=keyword, count=len(output))
            return output
        except Exception as e:
            logger.error("Custom Search API error", keyword=keyword, error=str(e))
            raise SearchError(str(e))
        finally:
            await self.client.close()


def create_search_client() -> SearchClient:
    if not GOOGLE_API_KEY or not GOOGLE_SEARCH_ENGINE_ID:
        raise ValueError("GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID must be set")
    return SearchClient(GOOGLE_API_KEY, GOOGLE_SEARCH_ENGINE_ID)


# Example usage
async def main():
    client = create_search_client()
    results = await client.search_top_posts("python asyncio tutorial", num_results=10)
    print(results)


if __name__ == "__main__":
    asyncio.run(main())
