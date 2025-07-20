# """Updated search implementation with proper async handling."""

# import asyncio
# from typing import Dict, Any, List
# from src.schemas.state import GraphState
# from src.tools.gemini_client import get_gemini_client
# from src.tools.search_client import create_search_client, SearchError
# from src.utils.logger import get_logger

# logger = get_logger(__name__)


# async def search_top_posts(state: GraphState) -> Dict[str, Any]:
#     """Search for top blog posts related to the keyword.
    
#     Args:
#         state: Current graph state containing keyword
        
#     Returns:
#         Updated state with top_posts populated
#     """
#     keyword = state.keyword
#     logger.info("Starting search for top posts", keyword=keyword)
    
#     # Method 1: Try Gemini with search grounding (Primary)
#     try:
#         gemini_client = await get_gemini_client()
        
#         search_prompt = f"""
#         Find the top 10 most comprehensive and authoritative blog posts, tutorials, and guides about: {keyword}

#         Focus on:
#         - High-quality, well-structured content
#         - Recent publications (preferably last 2 years)
#         - Authoritative sources and established blogs
#         - Content that provides practical value and actionable insights
#         - Posts with good SEO and readability

#         For each result, I need:
#         - URL
#         - Title
#         - Brief description/snippet
        
#         Return the results in a structured format.
#         """
        
#         logger.info("Attempting Gemini search with grounding")
#         search_response = await gemini_client.generate_content(
#             prompt=search_prompt,
#             use_search=True,
#             temperature=0.3
#         )
        
#         # Parse Gemini search response
#         top_posts = _parse_gemini_search_response(search_response, keyword)
        
#         if len(top_posts) >= 5:
#             logger.info(
#                 "Successfully found posts via Gemini search grounding",
#                 keyword=keyword,
#                 count=len(top_posts)
#             )
#             return {"top_posts": top_posts}
#         else:
#             logger.warning("Gemini search returned insufficient results, trying fallback")
            
#     except Exception as e:
#         logger.warning(
#             "Gemini search grounding failed, trying fallback",
#             keyword=keyword,
#             error=str(e)
#         )
    
#     # Method 2: Fallback to Google Custom Search API
#     try:
#         search_client = create_search_client()
        
#         if search_client is None:
#             logger.warning("Custom Search client not available, using mock results")
#             return {"top_posts": _generate_mock_results(keyword)}
        
#         logger.info("Attempting Custom Search API")
#         # Fix: Properly await the async method
#         top_posts = await search_client.search_top_posts(keyword, num_results=10)
        
#         if top_posts:
#             logger.info(
#                 "Successfully found posts via Custom Search API",
#                 keyword=keyword,
#                 count=len(top_posts)
#             )
#             return {"top_posts": top_posts}
        
#     except SearchError as e:
#         logger.warning("Custom Search API failed", keyword=keyword, error=str(e))
#     except Exception as e:
#         logger.error("Unexpected error in Custom Search", keyword=keyword, error=str(e))
    
#     # Method 3: Generate mock results for testing/development
#     logger.warning("All search methods failed, generating mock results for testing")
#     mock_posts = _generate_mock_results(keyword)
    
#     return {"top_posts": mock_posts}


# def _parse_gemini_search_response(response: str, keyword: str) -> List[Dict[str, Any]]:
#     """Parse Gemini search response to extract structured data."""
#     posts = []
    
#     try:
#         import re
        
#         # Look for URL patterns
#         url_pattern = r'https?://[^\s<>"\']+[^\s<>"\'.,)]'
#         urls = re.findall(url_pattern, response)
        
#         # Split response into sections
#         lines = response.split('\n')
#         current_post = {}
        
#         for line in lines:
#             line = line.strip()
#             if not line:
#                 if current_post and 'url' in current_post:
#                     posts.append(current_post)
#                     current_post = {}
#                 continue
            
#             # Look for URLs
#             if any(url in line for url in urls):
#                 url_match = re.search(url_pattern, line)
#                 if url_match:
#                     current_post['url'] = url_match.group(0)
            
#             # Look for titles (various patterns)
#             elif any(marker in line.lower() for marker in ['title:', 'post:', '**', '##']):
#                 title = re.sub(r'^[#*\-\d\.\s]*', '', line)
#                 title = re.sub(r'[*#]*$', '', title).strip()
#                 if title and len(title) > 10:
#                     current_post['title'] = title
            
#             # Look for descriptions
#             elif len(line) > 30 and not line.startswith(('http', 'www')):
#                 if 'snippet' not in current_post:
#                     current_post['snippet'] = line
        
#         # Add the last post
#         if current_post and 'url' in current_post:
#             posts.append(current_post)
        
#         # Fill in missing fields and validate
#         validated_posts = []
#         for i, post in enumerate(posts[:10]):
#             validated_post = {
#                 'url': post.get('url', f'https://example.com/{keyword.replace(" ", "-")}-{i+1}'),
#                 'title': post.get('title', f'{keyword.title()} Guide #{i+1}'),
#                 'snippet': post.get('snippet', f'Comprehensive guide about {keyword}'),
#                 'meta_description': post.get('meta_description', '')
#             }
#             validated_posts.append(validated_post)
        
#         return validated_posts
        
#     except Exception as e:
#         logger.warning("Failed to parse Gemini search response", error=str(e))
#         return []


# def _generate_mock_results(keyword: str) -> List[Dict[str, Any]]:
#     """Generate mock search results for testing/development."""
#     logger.info("Generating mock search results", keyword=keyword)
    
#     mock_domains = [
#         "medium.com", "dev.to", "realpython.com", "towardsdatascience.com",
#         "freecodecamp.org", "digitalocean.com", "hackernoon.com", "auth0.com",
#         "blog.miguelgrinberg.com", "testdriven.io"
#     ]
    
#     mock_posts = []
#     keyword_clean = keyword.replace(" ", "-").lower()
    
#     for i, domain in enumerate(mock_domains):
#         post = {
#             "url": f"https://{domain}/{keyword_clean}-tutorial-{i+1}",
#             "title": f"Complete {keyword.title()} Tutorial - Part {i+1}",
#             "snippet": f"Learn {keyword} with this comprehensive guide. "
#                       f"Covers everything from basics to advanced concepts.",
#             "meta_description": f"A complete guide to {keyword} for developers"
#         }
#         mock_posts.append(post)
    
#     return mock_posts



# src/agents/nodes/search_top_posts.py

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
        
        raw = await client.generate_content(
            prompt=prompt,
            temperature=0.3
        )
        
        # Parse JSON safely
        top_posts = json.loads(raw)
        if isinstance(top_posts, list) and len(top_posts) >= 5:
            logger.info("Gemini returned valid JSON results", count=len(top_posts))
            return {"top_posts": top_posts}
        else:
            logger.warning("Gemini JSON is invalid or too small", payload=raw)

    except json.JSONDecodeError as je:
        logger.warning("Failed to parse Gemini JSON", error=str(je))
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

    # 3️⃣ Last resort: mock data
    logger.warning("Using mock results for testing", keyword=keyword)
    return {"top_posts": _generate_mock_results(keyword)}


def _generate_mock_results(keyword: str) -> List[Dict[str, Any]]:
    """Keep your existing mock helper or inject via config."""
    # … same as before …
    return [
        {
            "url": f"https://example.com/{keyword.replace(' ', '-')}-{i+1}",
            "title": f"{keyword.title()} Guide #{i+1}",
            "snippet": f"Comprehensive guide about {keyword}"
        }
        for i in range(10)
    ]
