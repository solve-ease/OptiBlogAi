"""
Google Search API Integration Module

This module provides functionality to retrieve top search results for keywords
using the Google Custom Search JSON API.
"""

import os
import requests
import logging
from typing import List, Dict, Optional, Any
from urllib.parse import quote_plus


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class GoogleSearchClient:
    """Client for interacting with Google Custom Search JSON API."""
    
    BASE_URL = "https://www.googleapis.com/customsearch/v1"
    
    def __init__(self, api_key: Optional[str] = None, 
                 search_engine_id: Optional[str] = None):
        """
        Initialize the Google Search client.
        
        Args:
            api_key: Google API key. If None, tries to get from environment variable.
            search_engine_id: Custom Search Engine ID. If None, tries to get from environment variable.
        """
        self.api_key = api_key 
        self.search_engine_id = search_engine_id 
        
        if not self.api_key:
            logger.warning("No Google API key provided. Set GOOGLE_API_KEY environment variable.")
        
        if not self.search_engine_id:
            logger.warning("No search engine ID provided. Set GOOGLE_CSE_ID environment variable.")
    
    def search(self, query: str, num_results: int = 10, 
               search_type: str = "blog", language: str = "en") -> List[Dict[str, Any]]:
        """
        Search for query using Google Custom Search API.
        
        Args:
            query: The search query string
            num_results: Number of results to return (max 10 per request with free tier)
            search_type: Type of content to search for ("blog", "news", etc.)
            language: Language restriction for results
            
        Returns:
            List of search result items with URL, title, and snippet
        """
        if not self.api_key or not self.search_engine_id:
            logger.error("API key or Search Engine ID not provided")
            return []
        
        # Prepare parameters for the API request
        params = {
            "key": self.api_key,
            "cx": self.search_engine_id,
            "q": quote_plus(query),
            "num": min(num_results, 10),  # API limit is 10 results per query
            "lr": f"lang_{language}" if language else None,
        }
        
        # Add search type if specified
        if search_type == "blog":
            params["sort"] = "date"
            
        try:
            logger.info(f"Searching for: {query}")
            response = requests.get(self.BASE_URL, params=params)
            response.raise_for_status()
            
            search_results = response.json()
            
            if "items" not in search_results:
                logger.warning(f"No results found for query: {query}")
                return []
            
            # Extract relevant information from results
            processed_results = []
            for item in search_results["items"]:
                processed_results.append({
                    "url": item.get("link"),
                    "title": item.get("title"),
                    "snippet": item.get("snippet"),
                    "source": "google_search"
                })
            
            logger.info(f"Found {len(processed_results)} results for query: {query}")
            return processed_results
            
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error occurred: {e}")
            return []
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error occurred: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return []
    
    def get_top_urls(self, keyword: str, num_results: int = 10) -> List[str]:
        """
        Fetch top URLs for a given keyword.
        
        Args:
            keyword: The target keyword to search for
            num_results: Number of URLs to retrieve
            
        Returns:
            List of top-ranking URLs for the keyword
        """
        search_results = self.search(keyword, num_results=num_results)
        return [result["url"] for result in search_results if "url" in result]

    def batch_search(self, keywords: List[str], num_results: int = 10) -> Dict[str, List[Dict[str, Any]]]:
        """
        Perform searches for multiple keywords.
        
        Args:
            keywords: List of keywords to search for
            num_results: Number of results per keyword
            
        Returns:
            Dictionary mapping keywords to their search results
        """
        results = {}
        for keyword in keywords:
            results[keyword] = self.search(keyword, num_results=num_results)
        return results