import re
import asyncio
import json
from typing import Any, Dict, List
from src.schemas.state import GraphState
from src.tools.gemini_client import get_gemini_client
from src.tools.search_client import create_search_client, SearchError
from src.utils.logger import get_logger

logger = get_logger(__name__)

# If you want strict JSON from Gemini, ask it explicitly:
GPT_JSON_PROMPT = """
Find the top 10 most comprehensive and authoritative blog posts, tutorials, and guides about "{keyword}".

Focus on:
- High-quality, well-structured content
- Recent publications (last 2 years)
- Authoritative sources and established blogs
- Practical value and actionable insights
- Good SEO and readability

Output a JSON array of objects, each with:
  - "url": string
  - "title": string
  - "snippet": string

Return only valid JSON.
""".strip()


async def search_top_posts(state: GraphState) -> Dict[str, Any]:
    keyword = state.keyword
    logger.info("Starting search for top posts", keyword=keyword)

    # 1️⃣ Try grounding through Gemini
    try:
        client = await get_gemini_client()
        prompt = GPT_JSON_PROMPT.format(keyword=keyword)
        logger.info("Gemini grounding with JSON prompt", prompt=prompt[:60] + "…")

        raw = await client.generate_content(prompt=prompt, temperature=0.3)

        print(f"Raw Gemini response: {raw[:1000]}...")  # Debug print

        text = raw.strip()

        # Parse JSON safely
        try:
            top_posts = json.loads(text)

        except json.JSONDecodeError:
            # try to extract a JSON array or object via regex
            match = re.search(r"(\[.*\]|\{.*\})", text, re.DOTALL)
            if match:
                try:
                    top_posts = json.loads(match.group(1))
                except json.JSONDecodeError:
                    top_posts = []
            else:
                top_posts = []

        if isinstance(top_posts, list) and len(top_posts) >= 5:
            return {"top_posts": top_posts}

    except json.JSONDecodeError as je:
        logger.warning("Failed to parse Gemini JSON", error=str(je))

        # fixing json decoding error

    except Exception as e:
        logger.error("Gemini grounding error", error=str(e), exc_info=True)

    # 2️⃣ Fallback to Custom Search API
    try:
        search_client = create_search_client()
        logger.info("Falling back to Custom Search API", keyword=keyword)

        posts = await search_client.search_top_posts(keyword, num_results=10)
        if posts:
            logger.info("Custom Search returned results", count=len(posts))
            return {"top_posts": posts}
    except SearchError as se:
        logger.warning("Custom Search failed", error=str(se))
    except Exception as e:
        logger.error("Unexpected Custom Search error", error=str(e), exc_info=True)

    # # 3️⃣ Last resort: mock data
    # logger.warning("Using mock results for testing", keyword=keyword)
    # return {"top_posts": _generate_mock_results(keyword)}

    # 3️⃣ No results found - return safe response that signals workflow to end
    logger.error("All search methods failed - no results found", keyword=keyword)
    return {
        "top_posts": [],
        "search_failed": True,
        "error_message": f"No blog posts found for keyword: '{keyword}'",
        "workflow_status": "search_failed",
    }


# def _generate_mock_results(keyword: str) -> List[Dict[str, Any]]:
#     """Keep your existing mock helper or inject via config."""
#     # … same as before …
#     return [
#         {
#             "url": f"https://example.com/{keyword.replace(' ', '-')}-{i+1}",
#             "title": f"{keyword.title()} Guide #{i+1}",
#             "snippet": f"Comprehensive guide about {keyword}"
#         }
#         for i in range(10)
#     ]
