
from scraper import GoogleSearchClient, WebpageCrawler, ContentExtractor

# Set up Google Search client
search_client = GoogleSearchClient(api_key="your_api_key", search_engine_id="your_cse_id")

# Search for keywords
urls = search_client.get_top_urls("AI content generation", num_results=5)

# Set up webpage crawler
crawler = WebpageCrawler(respect_robots=True)

# Crawl the URLs
crawl_results = crawler.batch_crawl(urls, delay=2.0)

# Set up content extractor
extractor = ContentExtractor(output_dir="extracted_content")

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