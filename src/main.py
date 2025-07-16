import sys

sys.path.append("src/scraper")

from scraper.google_search import GoogleSearchClient
from scraper.webpage_crawler import WebpageCrawler
from scraper.content_extractor import ContentExtractor


from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")

# Set up Google Search client
search_client = GoogleSearchClient(
    api_key=GOOGLE_API_KEY, search_engine_id=GOOGLE_CSE_ID
)

search_keyword = input("Enter a keyword to search: ")
num_results = int(input("Enter the number of results to fetch: "))

# Search for keywords
urls = search_client.get_top_urls(search_keyword, num_results=num_results)

# Set up webpage crawler
crawler = WebpageCrawler(respect_robots=False)

# get date in python
from datetime import datetime

current_date = datetime.now().strftime("%Y-%m-%d")

new_dir = f"{search_keyword}_{current_date}"
os.mkdir(new_dir)

# Crawl the URLs
crawl_results = crawler.batch_crawl(urls, delay=2.0)

# Set up content extractor
extractor = ContentExtractor(output_dir=f"extracted_content/{new_dir}")

# Extract and analyze content
analyzed_content = []
for result in crawl_results:
    if result["success"]:
        content = extractor.extract_from_crawler_result(result)
        analysis = extractor.analyze_content(content)
        analyzed_content.append(analysis)

# Process the analyzed content
for content in analyzed_content:
    print(f"Title: {content['title']}")
    print(f"Readability: {content['readability']['flesch_reading_ease']}")
    print(f"Top keywords: {content['keywords'][:5]}")
    print("---")
