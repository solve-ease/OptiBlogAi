"""
Webpage Crawler Module

This module provides functionality for crawling webpages and extracting
HTML content using BeautifulSoup.
"""

import requests
import logging
from typing import Dict, Optional, Any, List, Tuple
from bs4 import BeautifulSoup
import time
import random
from urllib.parse import urlparse, urljoin

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class WebpageCrawler:
    """Class for crawling webpages and extracting HTML content."""
    
    def __init__(self, user_agent: Optional[str] = None, timeout: int = 30,
                 respect_robots: bool = True):
        """
        Initialize the webpage crawler.
        
        Args:
            user_agent: Custom user agent string. If None, uses a default.
            timeout: Request timeout in seconds
            respect_robots: Whether to respect robots.txt directives
        """
        self.timeout = timeout
        self.respect_robots = respect_robots
        
        # Set default user agent if none provided
        if user_agent is None:
            self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        else:
            self.user_agent = user_agent
            
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": self.user_agent})
        
        # Cache for robots.txt rules
        self._robots_cache = {}
    
    def fetch_url(self, url: str, retry_attempts: int = 3, 
                  delay_between_attempts: float = 1.0) -> Optional[str]:
        """
        Fetch HTML content from a URL with retry logic.
        
        Args:
            url: The URL to fetch
            retry_attempts: Number of retry attempts if the request fails
            delay_between_attempts: Delay between retry attempts in seconds
            
        Returns:
            HTML content as string or None if all attempts fail
        """
        if self.respect_robots and not self._is_allowed_by_robots(url):
            logger.warning(f"URL {url} is disallowed by robots.txt. Skipping.")
            return None
        
        for attempt in range(retry_attempts):
            try:
                # Add jitter to avoid detection
                if attempt > 0:
                    jitter = random.uniform(0.5, 1.5) * delay_between_attempts
                    time.sleep(jitter)
                
                logger.info(f"Fetching URL: {url} (Attempt {attempt + 1}/{retry_attempts})")
                response = self.session.get(url, timeout=self.timeout, allow_redirects=True)
                
                # Check if the request was successful
                if response.status_code == 200:
                    return response.text
                else:
                    logger.warning(f"Failed to fetch {url}. Status code: {response.status_code}")
            
            except requests.exceptions.Timeout:
                logger.warning(f"Timeout occurred while fetching {url}")
            except requests.exceptions.TooManyRedirects:
                logger.warning(f"Too many redirects for {url}")
                break  # Don't retry on redirect issues
            except requests.exceptions.RequestException as e:
                logger.warning(f"Error fetching {url}: {str(e)}")
        
        logger.error(f"All attempts to fetch {url} failed")
        return None
    
    def parse_html(self, html_content: str) -> Optional[BeautifulSoup]:
        """
        Parse HTML content using BeautifulSoup.
        
        Args:
            html_content: HTML content as string
            
        Returns:
            BeautifulSoup object or None if parsing fails
        """
        try:
            return BeautifulSoup(html_content, 'html.parser')
        except Exception as e:
            logger.error(f"Error parsing HTML: {str(e)}")
            return None
    
    def extract_metadata(self, soup: BeautifulSoup) -> Dict[str, str]:
        """
        Extract metadata from BeautifulSoup object.
        
        Args:
            soup: BeautifulSoup object representing the HTML document
            
        Returns:
            Dictionary of metadata (title, description, etc.)
        """
        metadata = {
            "title": "",
            "description": "",
            "canonical_url": "",
            "keywords": "",
            "author": "",
            "published_date": ""
        }
        
        # Extract title
        title_tag = soup.find("title")
        if title_tag and title_tag.string:
            metadata["title"] = title_tag.string.strip()
        
        # Extract meta tags
        for meta in soup.find_all("meta"):
            name = meta.get("name", "").lower()
            property = meta.get("property", "").lower()
            content = meta.get("content", "")
            
            if name == "description" or property == "og:description":
                metadata["description"] = content
            elif name == "keywords":
                metadata["keywords"] = content
            elif name == "author":
                metadata["author"] = content
            elif name == "article:published_time" or property == "article:published_time":
                metadata["published_date"] = content
        
        # Extract canonical URL
        canonical = soup.find("link", rel="canonical")
        if canonical and canonical.get("href"):
            metadata["canonical_url"] = canonical.get("href")
        
        return metadata
    
    def extract_text_by_tag(self, soup: BeautifulSoup, tag_name: str) -> List[str]:
        """
        Extract text content from specific HTML tags.
        
        Args:
            soup: BeautifulSoup object
            tag_name: HTML tag name to extract (e.g., 'p', 'h1', 'h2')
            
        Returns:
            List of text content from the specified tags
        """
        elements = soup.find_all(tag_name)
        return [element.get_text().strip() for element in elements if element.get_text().strip()]
    
    def extract_headings(self, soup: BeautifulSoup) -> Dict[str, List[str]]:
        """
        Extract all headings (h1-h6) from the page.
        
        Args:
            soup: BeautifulSoup object
            
        Returns:
            Dictionary mapping heading levels to lists of heading text
        """
        headings = {}
        for level in range(1, 7):
            tag_name = f"h{level}"
            headings[tag_name] = self.extract_text_by_tag(soup, tag_name)
        return headings
    
    def extract_links(self, soup: BeautifulSoup, base_url: str) -> List[Dict[str, str]]:
        """
        Extract all links from the page.
        
        Args:
            soup: BeautifulSoup object
            base_url: Base URL for resolving relative links
            
        Returns:
            List of dictionaries containing link URL and text
        """
        links = []
        for a_tag in soup.find_all("a", href=True):
            href = a_tag.get("href", "").strip()
            if href and not href.startswith(("#", "javascript:", "mailto:")):
                # Resolve relative URLs
                absolute_url = urljoin(base_url, href)
                links.append({
                    "url": absolute_url,
                    "text": a_tag.get_text().strip()
                })
        return links
    
    def extract_images(self, soup: BeautifulSoup, base_url: str) -> List[Dict[str, str]]:
        """
        Extract all images from the page.
        
        Args:
            soup: BeautifulSoup object
            base_url: Base URL for resolving relative image URLs
            
        Returns:
            List of dictionaries containing image URL and alt text
        """
        images = []
        for img_tag in soup.find_all("img"):
            src = img_tag.get("src", "").strip()
            if src:
                # Resolve relative URLs
                absolute_url = urljoin(base_url, src)
                images.append({
                    "url": absolute_url,
                    "alt": img_tag.get("alt", "").strip()
                })
        return images
    
    def _is_allowed_by_robots(self, url: str) -> bool:
        """
        Check if the URL is allowed by the website's robots.txt.
        
        Args:
            url: URL to check
            
        Returns:
            True if allowed, False if disallowed
        """
        if not self.respect_robots:
            return True
            
        try:
            parsed_url = urlparse(url)
            robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
            
            # Check cache first
            if robots_url in self._robots_cache:
                rules = self._robots_cache[robots_url]
            else:
                # Fetch and parse robots.txt
                try:
                    response = self.session.get(robots_url, timeout=self.timeout)
                    if response.status_code == 200:
                        rules = self._parse_robots_txt(response.text)
                    else:
                        # If robots.txt doesn't exist or can't be fetched, allow all
                        rules = []
                    self._robots_cache[robots_url] = rules
                except Exception:
                    # If there's an error fetching robots.txt, allow all
                    self._robots_cache[robots_url] = []
                    return True
            
            # Check if URL is allowed
            path = parsed_url.path or "/"
            return not any(self._is_path_matched(path, rule) for rule in rules)
            
        except Exception as e:
            logger.warning(f"Error checking robots.txt for {url}: {str(e)}")
            return True  # Allow in case of error
    
    def _parse_robots_txt(self, content: str) -> List[str]:
        """
        Parse robots.txt content and extract disallow rules for our user agent.
        
        Args:
            content: Content of robots.txt file
            
        Returns:
            List of disallowed paths
        """
        disallowed = []
        agent_rules = False
        
        for line in content.split('\n'):
            line = line.strip()
            
            if not line or line.startswith('#'):
                continue
                
            parts = [part.strip() for part in line.split(':', 1)]
            if len(parts) != 2:
                continue
                
            key, value = parts
            key = key.lower()
            
            if key == "user-agent":
                if value == "*" or value in self.user_agent:
                    agent_rules = True
                else:
                    agent_rules = False
            
            elif key == "disallow" and agent_rules and value:
                disallowed.append(value)
        
        return disallowed
    
    def _is_path_matched(self, path: str, pattern: str) -> bool:
        """
        Check if a path matches a robots.txt pattern.
        
        Args:
            path: URL path to check
            pattern: Disallow pattern from robots.txt
            
        Returns:
            True if path matches pattern, False otherwise
        """
        # Simple pattern matching for now
        if pattern.endswith('*'):
            return path.startswith(pattern[:-1])
        return path.startswith(pattern)
    
    def crawl(self, url: str) -> Dict[str, Any]:
        """
        Crawl a webpage and extract all relevant content.
        
        Args:
            url: URL to crawl
            
        Returns:
            Dictionary containing the extracted content and metadata
        """
        html_content = self.fetch_url(url)
        if not html_content:
            return {"url": url, "success": False, "error": "Failed to fetch content"}
        
        soup = self.parse_html(html_content)
        if not soup:
            return {"url": url, "success": False, "error": "Failed to parse HTML"}
        
        # Extract content
        metadata = self.extract_metadata(soup)
        headings = self.extract_headings(soup)
        paragraphs = self.extract_text_by_tag(soup, "p")
        links = self.extract_links(soup, url)
        images = self.extract_images(soup, url)
        
        # Clean main content area (focus on content sections, remove navigation, sidebars, etc.)
        main_content = self._extract_main_content(soup)
        
        return {
            "url": url,
            "success": True,
            "metadata": metadata,
            "headings": headings,
            "paragraphs": paragraphs,
            "links": links,
            "images": images,
            "main_content": main_content,
            "html": html_content  # Include raw HTML for further processing
        }
    
    def _extract_main_content(self, soup: BeautifulSoup) -> str:
        """
        Extract the main content area of the webpage.
        Uses heuristics to find the most content-rich part of the page.
        
        Args:
            soup: BeautifulSoup object
            
        Returns:
            String containing the main content HTML
        """
        # Try common content container IDs and classes
        content_selectors = [
            "article", "main", ".post-content", ".entry-content", 
            "#content", ".content", ".post", ".entry", ".blog-post"
        ]
        
        # Try each selector
        for selector in content_selectors:
            try:
                content_element = soup.select_one(selector)
                if content_element and len(content_element.get_text().strip()) > 200:
                    return str(content_element)
            except Exception:
                continue
        
        # Fallback: Find the div with the most paragraph content
        paragraphs_by_container = {}
        for div in soup.find_all("div"):
            p_tags = div.find_all("p")
            if p_tags:
                text_length = sum(len(p.get_text()) for p in p_tags)
                paragraphs_by_container[div] = text_length
        
        if paragraphs_by_container:
            main_div = max(paragraphs_by_container.items(), key=lambda x: x[1])[0]
            return str(main_div)
        
        # Last resort: Return the body content
        body = soup.find("body")
        if body:
            return str(body)
        
        # If all else fails, return the entire HTML
        return str(soup)
    
    def batch_crawl(self, urls: List[str], delay: float = 1.0) -> List[Dict[str, Any]]:
        """
        Crawl multiple URLs with a delay between requests.
        
        Args:
            urls: List of URLs to crawl
            delay: Delay between requests in seconds
            
        Returns:
            List of dictionaries containing the extracted content for each URL
        """
        results = []
        for i, url in enumerate(urls):
            logger.info(f"Crawling URL {i+1}/{len(urls)}: {url}")
            result = self.crawl(url)
            results.append(result)
            
            # Add delay between requests (except for the last one)
            if i < len(urls) - 1:
                jitter = random.uniform(0.8, 1.2) * delay
                time.sleep(jitter)
        
        return results