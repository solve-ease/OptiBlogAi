import asyncio
import os
from typing import Dict, List, Optional, Tuple, Any

from playwright.async_api import (
    async_playwright,
    Browser,
    Page,
    TimeoutError as PlaywrightTimeoutError,
)
from urllib.parse import urlparse
from src.utils.logger import get_logger
from bs4 import BeautifulSoup
import trafilatura

logger = get_logger(__name__)

# List of full browser User‑Agents to rotate
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/116.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) "
    "Version/16.5 Safari/605.1.15",
    # add more as needed…
]


class PlaywrightScraper:
    def __init__(
        self,
        max_concurrent: int = 5,
        navigation_timeout: int = 15_000,  # 15s
        headless: bool = True,
    ):
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.navigation_timeout = navigation_timeout
        self.headless = headless

    async def _fetch(
        self, browser: Browser, url: str, ua: str
    ) -> Tuple[str, Optional[str]]:
        """Load a page in Playwright and return its HTML or None."""
        async with self.semaphore:
            page: Page = await browser.new_page(
                user_agent=ua,
                viewport={"width": 1280, "height": 800},
            )
            # Optionally block images/fonts/css to speed up
            await page.route(
                "**/*",
                lambda route: (
                    route.continue_()
                    if route.request.resource_type
                    not in ("image", "font", "stylesheet")
                    else route.abort()
                ),
            )
            # Set a Referer header
            origin = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
            await page.set_extra_http_headers({"Referer": origin})

            try:
                await page.goto(
                    url, wait_until="networkidle", timeout=self.navigation_timeout
                )
                html = await page.content()
                logger.debug("Scraped successfully", url=url, length=len(html))
                return url, html
            except PlaywrightTimeoutError:
                logger.warning("Timeout loading page", url=url)
            except Exception as e:
                logger.warning("Error loading page", url=url, error=str(e))
            finally:
                await page.close()

            return url, None

    def clean_html_content(self, html: str, url: str) -> Optional[Dict[str, Any]]:
        """Clean and extract content from HTML.

        Args:
            html: Raw HTML content
            url: Source URL

        Returns:
            Cleaned content dictionary or None if extraction fails
        """
        try:
            # Try BeautifulSoup first
            soup = BeautifulSoup(html, "html.parser")

            # Remove unwanted elements
            for element in soup(
                ["script", "style", "nav", "footer", "aside", "header"]
            ):
                element.decompose()

            # Extract title
            title = ""
            title_tag = soup.find("title")
            if title_tag:
                title = title_tag.get_text().strip()

            # Extract meta description
            meta_desc = ""
            meta_tag = soup.find("meta", attrs={"name": "description"})
            if meta_tag and meta_tag.get("content"):
                meta_desc = meta_tag.get("content").strip()

            # Extract headings
            headings = []
            for heading in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
                text = heading.get_text().strip()
                if text:
                    headings.append(text)

            # Extract paragraphs
            paragraphs = []
            for p in soup.find_all("p"):
                text = p.get_text().strip()
                if text and len(text) > 20:  # Filter out short paragraphs
                    paragraphs.append(text)

            # If BeautifulSoup didn't get enough content, try trafilatura
            if len(paragraphs) < 3:
                extracted_text = trafilatura.extract(html)
                if extracted_text:
                    paragraphs = [
                        p.strip() for p in extracted_text.split("\n\n") if p.strip()
                    ]

            # Calculate word count
            all_text = " ".join(paragraphs)
            word_count = len(all_text.split())

            if word_count < 100:  # Skip articles that are too short
                logger.warning("Article too short", url=url, word_count=word_count)
                return None

            cleaned_content = {
                "url": url,
                "title": title,
                "meta_description": meta_desc,
                "headings": headings,
                "paragraphs": paragraphs,
                "word_count": word_count,
            }

            logger.debug(
                "Content cleaned successfully",
                url=url,
                word_count=word_count,
                paragraphs=len(paragraphs),
                headings=len(headings),
            )

            return cleaned_content

        except Exception as e:
            logger.error("Failed to clean HTML content", url=url, error=str(e))
            return None

    async def scrape_multiple(self, urls: List[str]) -> Dict[str, Optional[str]]:
        """Scrape a list of URLs using a single browser instance."""
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=self.headless)
            tasks = []
            for idx, url in enumerate(urls):
                ua = USER_AGENTS[idx % len(USER_AGENTS)]
                tasks.append(self._fetch(browser, url, ua))

            results = await asyncio.gather(*tasks)
            await browser.close()

        scraped = {url: html for url, html in results}
        # Log summary
        total = len(urls)
        success = sum(1 for html in scraped.values() if html)
        rate = success / total * 100
        logger.info(
            "Playwright scraping completed",
            total=total,
            success=success,
            failed=total - success,
            success_rate=f"{rate:.1f}%",
        )

        return scraped


# Factory
def create_scraper() -> PlaywrightScraper:
    max_conc = int(os.getenv("MAX_CONCURRENT_REQUESTS", "5"))
    timeout = int(os.getenv("MAX_SCRAPE_TIMEOUT", "15")) * 1000
    headless = os.getenv("PLAYWRIGHT_HEADLESS", "true").lower() == "true"

    return PlaywrightScraper(
        max_concurrent=max_conc, navigation_timeout=timeout, headless=headless
    )


# Example usage inside your scrape_posts node
# --------------------------------------------------
# scraper = create_scraper()
# html_map = await scraper.scrape_multiple(state.top_posts)
# # then feed html_map into your clean_validate step…
