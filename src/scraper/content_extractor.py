"""
Content Extractor Module

This module provides functionality for extracting clean, structured content
from HTML webpages using Trafilatura library.
"""

import logging
import trafilatura
from typing import Dict, List, Optional, Any, Union
from bs4 import BeautifulSoup
import os
import json
from datetime import datetime
from urllib.parse import urlparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ContentExtractor:
    """Class for extracting clean, structured content from HTML webpages."""
    
    def __init__(self, output_dir: Optional[str] = None, 
                 include_images: bool = True, 
                 include_tables: bool = True,
                 include_links: bool = True):
        """
        Initialize the content extractor.
        
        Args:
            output_dir: Directory to save extracted content. If None, content is not saved.
            include_images: Whether to include image information in extraction
            include_tables: Whether to include table information in extraction
            include_links: Whether to include link information in extraction
        """
        self.output_dir = output_dir
        self.include_images = include_images
        self.include_tables = include_tables
        self.include_links = include_links
        
        # Create output directory if it doesn't exist
        if self.output_dir and not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def extract_from_html(self, html: str, url: str = "") -> Dict[str, Any]:
        """
        Extract content from HTML using Trafilatura.
        
        Args:
            html: HTML content as string
            url: Source URL of the HTML content
            
        Returns:
            Dictionary containing the extracted content
        """
        try:
            logger.info(f"Extracting content from URL: {url}")
            
            # Extract content using Trafilatura
            extracted = trafilatura.extract(
                html,
                output_format="json",
                with_metadata=True,
                include_images=self.include_images,
                include_tables=self.include_tables,
                include_links=self.include_links,
                url=url
            )
            
            if not extracted:
                logger.warning(f"No content extracted from {url}")
                return self._create_empty_result(url)
            
            # Parse the JSON output
            content = json.loads(extracted)
            
            # Create result dictionary
            result = {
                "url": url,
                "success": True,
                "title": content.get("title", ""),
                "author": content.get("author", ""),
                "date": content.get("date", ""),
                "description": content.get("description", ""),
                "categories": content.get("categories", []),
                "tags": content.get("tags", []),
                "text": content.get("text", ""),
                "language": content.get("language", ""),
                "extracted_at": datetime.now().isoformat()
            }
            
            # Add optional extracted elements
            if self.include_images and "images" in content:
                result["images"] = content.get("images", [])
                
            if self.include_tables and "tables" in content:
                result["tables"] = content.get("tables", [])
                
            if self.include_links and "links" in content:
                result["links"] = content.get("links", [])
            
            # Save to file if output directory is specified
            if self.output_dir:
                self._save_to_file(result)
            
            return result
            
        except Exception as e:
            logger.error(f"Error extracting content from {url}: {str(e)}")
            return self._create_empty_result(url)
    
    def extract_from_url(self, url: str) -> Dict[str, Any]:
        """
        Download and extract content from a URL.
        
        Args:
            url: URL to fetch and extract
            
        Returns:
            Dictionary containing the extracted content
        """
        try:
            logger.info(f"Downloading and extracting content from URL: {url}")
            
            # Download and extract content using Trafilatura
            downloaded = trafilatura.fetch_url(url)
            if not downloaded:
                logger.warning(f"Failed to download content from {url}")
                return self._create_empty_result(url)
            
            # Extract content
            return self.extract_from_html(downloaded, url)
            
        except Exception as e:
            logger.error(f"Error extracting content from {url}: {str(e)}")
            return self._create_empty_result(url)
    
    def extract_structured_content(self, html: str, url: str = "") -> Dict[str, Any]:
        """
        Extract structured content (headings, paragraphs) from HTML.
        
        Args:
            html: HTML content as string
            url: Source URL of the HTML content
            
        Returns:
            Dictionary containing the structured content
        """
        try:
            # Extract main content
            extracted_content = trafilatura.extract(
                html,
                output_format="xml",
                with_metadata=True,
                include_images=self.include_images,
                include_tables=self.include_tables,
                include_links=self.include_links,
                url=url
            )
            
            if not extracted_content:
                logger.warning(f"No content extracted from {url}")
                return self._create_empty_result(url)
            
            # Parse the XML output with BeautifulSoup for structured analysis
            soup = BeautifulSoup(extracted_content, "xml")
            
            # Extract metadata
            metadata = {
                "title": self._get_element_text(soup, "title"),
                "author": self._get_element_text(soup, "author"),
                "date": self._get_element_text(soup, "date"),
                "description": self._get_element_text(soup, "description")
            }
            
            # Extract headings
            headings = {
                "h1": [h.text for h in soup.find_all("head", {"type": "h1"})],
                "h2": [h.text for h in soup.find_all("head", {"type": "h2"})],
                "h3": [h.text for h in soup.find_all("head", {"type": "h3"})],
                "h4": [h.text for h in soup.find_all("head", {"type": "h4"})],
            }
            
            # Extract paragraphs
            paragraphs = [p.text for p in soup.find_all("p")]
            
            # Extract quotes
            quotes = [q.text for q in soup.find_all("quote")]
            
            # Extract lists
            lists = [self._process_list(l) for l in soup.find_all("list")]
            
            # Extract images
            images = []
            if self.include_images:
                for img in soup.find_all("graphic"):
                    image_data = {
                        "url": img.get("url", ""),
                        "alt": img.get("alt", ""),
                        "type": img.get("type", "")
                    }
                    images.append(image_data)
            
            # Extract tables
            tables = []
            if self.include_tables:
                for table in soup.find_all("table"):
                    tables.append(str(table))
            
            # Extract links
            links = []
            if self.include_links:
                for ref in soup.find_all("ref"):
                    link_data = {
                        "url": ref.get("target", ""),
                        "text": ref.text
                    }
                    links.append(link_data)
            
            # Create result
            result = {
                "url": url,
                "success": True,
                "metadata": metadata,
                "headings": headings,
                "paragraphs": paragraphs,
                "quotes": quotes,
                "lists": lists,
                "extracted_at": datetime.now().isoformat()
            }
            
            if self.include_images:
                result["images"] = images
                
            if self.include_tables:
                result["tables"] = tables
                
            if self.include_links:
                result["links"] = links
            
            # Save to file if output directory is specified
            if self.output_dir:
                self._save_to_file(result, suffix="_structured")
            
            return result
            
        except Exception as e:
            logger.error(f"Error extracting structured content from {url}: {str(e)}")
            return self._create_empty_result(url)
    
    def _get_element_text(self, soup: BeautifulSoup, element_name: str) -> str:
        """
        Get text from a BeautifulSoup element if it exists.
        
        Args:
            soup: BeautifulSoup object
            element_name: Name of the element to extract
            
        Returns:
            Text content of the element or empty string
        """
        element = soup.find(element_name)
        return element.text if element else ""
    
    def _process_list(self, list_element: Any) -> Dict[str, Any]:
        """
        Process a list element into a structured format.
        
        Args:
            list_element: BeautifulSoup list element
            
        Returns:
            Dictionary containing the list type and items
        """
        items = [item.text for item in list_element.find_all("item")]
        list_type = list_element.get("type", "unordered")
        return {
            "type": list_type,
            "items": items
        }
    
    def _create_empty_result(self, url: str) -> Dict[str, Any]:
        """
        Create an empty result dictionary for failed extractions.
        
        Args:
            url: URL that failed extraction
            
        Returns:
            Dictionary with basic fields and failure indicator
        """
        return {
            "url": url,
            "success": False,
            "error": "Failed to extract content",
            "title": "",
            "author": "",
            "date": "",
            "description": "",
            "text": "",
            "extracted_at": datetime.now().isoformat()
        }
    
    def _save_to_file(self, content: Dict[str, Any], suffix: str = "") -> None:
        """
        Save extracted content to a JSON file.
        
        Args:
            content: Dictionary containing the extracted content
            suffix: Optional suffix to add to the filename
        """
        if not self.output_dir:
            return
        
        try:
            # Create a filename based on URL and timestamp
            url_parts = urlparse(content.get("url", ""))
            domain = url_parts.netloc.replace(".", "_")
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            if not domain:
                domain = "unknown_source"
                
            filename = f"{domain}_{timestamp}{suffix}.json"
            filepath = os.path.join(self.output_dir, filename)
            
            # Save to file
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(content, f, ensure_ascii=False, indent=2)
                
            logger.info(f"Content saved to {filepath}")
            
        except Exception as e:
            logger.error(f"Error saving content to file: {str(e)}")
    
    def extract_from_crawler_result(self, crawler_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract clean content from a crawler result.
        
        Args:
            crawler_result: Result dictionary from WebpageCrawler
            
        Returns:
            Dictionary containing the extracted content
        """
        if not crawler_result.get("success", False) or "html" not in crawler_result:
            logger.warning(f"Invalid crawler result for URL: {crawler_result.get('url', 'unknown')}")
            return self._create_empty_result(crawler_result.get("url", ""))
        
        # Extract content from HTML
        html = crawler_result["html"]
        url = crawler_result["url"]
        
        return self.extract_from_html(html, url)
    
    def batch_extract(self, urls: List[str]) -> List[Dict[str, Any]]:
        """
        Extract content from multiple URLs.
        
        Args:
            urls: List of URLs to extract content from
            
        Returns:
            List of dictionaries containing the extracted content for each URL
        """
        results = []
        for i, url in enumerate(urls):
            logger.info(f"Extracting content from URL {i+1}/{len(urls)}: {url}")
            result = self.extract_from_url(url)
            results.append(result)
        
        return results
    
    def extract_text_only(self, html: str, url: str = "") -> str:
        """
        Extract plain text content from HTML.
        
        Args:
            html: HTML content as string
            url: Source URL of the HTML content
            
        Returns:
            Plain text content
        """
        try:
            # Extract text using Trafilatura
            text = trafilatura.extract(html, output_format="text", url=url)
            return text if text else ""
            
        except Exception as e:
            logger.error(f"Error extracting text from {url}: {str(e)}")
            return ""
    
    def extract_readability_metrics(self, text: str) -> Dict[str, float]:
        """
        Calculate readability metrics for the extracted text.
        
        Args:
            text: Text content to analyze
            
        Returns:
            Dictionary containing readability metrics
        """
        try:
            # Check if text is long enough to analyze
            if len(text.split()) < 100:
                logger.warning("Text is too short for reliable readability analysis")
                return {
                    "word_count": len(text.split()),
                    "sentence_count": text.count('.') + text.count('!') + text.count('?'),
                    "avg_word_length": sum(len(word) for word in text.split()) / max(1, len(text.split())),
                    "flesch_reading_ease": None,
                    "flesch_kincaid_grade": None
                }
            
            # Basic metrics
            words = text.split()
            word_count = len(words)
            sentence_count = text.count('.') + text.count('!') + text.count('?')
            avg_word_length = sum(len(word) for word in words) / max(1, word_count)
            
            # Count syllables (simple approximation)
            def count_syllables(word):
                word = word.lower()
                # Count vowel groups
                count = 0
                vowels = "aeiouy"
                if word[0] in vowels:
                    count += 1
                for i in range(1, len(word)):
                    if word[i] in vowels and word[i-1] not in vowels:
                        count += 1
                # Subtract silent 'e' at the end
                if word.endswith('e'):
                    count -= 1
                # Ensure at least one syllable
                return max(1, count)
            
            syllable_count = sum(count_syllables(word) for word in words)
            
            # Calculate Flesch Reading Ease
            # Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
            flesch_reading_ease = 206.835 - 1.015 * (word_count / max(1, sentence_count)) - 84.6 * (syllable_count / max(1, word_count))
            
            # Calculate Flesch-Kincaid Grade Level
            # Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
            flesch_kincaid_grade = 0.39 * (word_count / max(1, sentence_count)) + 11.8 * (syllable_count / max(1, word_count)) - 15.59
            
            return {
                "word_count": word_count,
                "sentence_count": sentence_count,
                "syllable_count": syllable_count,
                "avg_word_length": avg_word_length,
                "avg_sentence_length": word_count / max(1, sentence_count),
                "avg_syllables_per_word": syllable_count / max(1, word_count),
                "flesch_reading_ease": flesch_reading_ease,
                "flesch_kincaid_grade": flesch_kincaid_grade
            }
            
        except Exception as e:
            logger.error(f"Error calculating readability metrics: {str(e)}")
            return {
                "error": str(e)
            }
    
    def analyze_content(self, content: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform comprehensive analysis on extracted content.
        
        Args:
            content: Dictionary containing extracted content
            
        Returns:
            Dictionary with the original content and additional analysis
        """
        if not content.get("success", False) or not content.get("text"):
            return content
        
        # Clone the content dictionary
        result = dict(content)
        
        # Add readability metrics
        result["readability"] = self.extract_readability_metrics(content["text"])
        
        # Add text statistics
        text = content["text"]
        result["statistics"] = {
            "character_count": len(text),
            "word_count": len(text.split()),
            "paragraph_count": text.count('\n\n') + 1,
            "avg_paragraph_length": len(text.split()) / max(1, text.count('\n\n') + 1)
        }
        
        # Add simple keyword extraction (based on word frequency)
        words = [word.lower() for word in text.split() if len(word) > 3]
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        # Get top keywords
        top_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:20]
        result["keywords"] = [{"word": word, "frequency": freq} for word, freq in top_keywords]
        
        return result