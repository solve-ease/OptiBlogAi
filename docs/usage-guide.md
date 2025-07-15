# OptiBlogAi Usage Guide

## Overview

The `main.py` script is the primary entry point for OptiBlogAi's content research and analysis pipeline. It performs automated keyword research, web scraping, content extraction, and SEO analysis.

## Prerequisites

### 1. Environment Setup

Before running `main.py`, ensure you have:

1. **Python Environment**: Python 3.10+ with all dependencies installed
2. **Google API Credentials**: Required for search functionality
3. **Environment Variables**: Properly configured `.env` file

### 2. Required Environment Variables

Create a `.env` file in the project root with:

```env
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_custom_search_engine_id_here
```

**How to get these credentials:**
- **Google API Key**: Visit [Google Cloud Console](https://console.cloud.google.com/), enable Custom Search JSON API
- **Google CSE ID**: Create a Custom Search Engine at [Google CSE](https://cse.google.com/)

### 3. Installation

```bash
# Clone the repository
git clone <repository-url>
cd OptiBlogAi

# Create virtual environment
python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install additional dependencies (if needed)
pip install python-dotenv
```

## Running main.py

### Basic Usage

```bash
# From the project root directory
cd /home/kalie/work/projects/OptiBlogAi
python src/main.py
```

### Interactive Prompts

The script will prompt you for:

1. **Search Keyword**: The topic you want to research
2. **Number of Results**: How many top-ranking pages to analyze (recommended: 5-10)

### Sample Execution

```bash
$ python src/main.py
Enter a keyword to search: artificial intelligence in healthcare
Enter the number of results to fetch: 5
```

## Sample Use Cases

### Case 1: Blog Content Research

**Scenario**: You want to write a blog post about "sustainable fashion trends"

**Input:**
- Keyword: `sustainable fashion trends`
- Number of results: `8`

**Expected Output:**
```
Title: 10 Sustainable Fashion Trends That Are Changing the Industry
Readability: 65.4
Top keywords: ['sustainable', 'fashion', 'trends', 'eco-friendly', 'organic']
---
Title: The Future of Sustainable Fashion: 2024 Trends
Readability: 72.1
Top keywords: ['sustainable', 'fashion', 'eco', 'brands', 'materials']
---
...
```

**Generated Files:**
- `sustainable fashion trends_2025-07-15/` (directory with crawled content)
- `extracted_content/sustainable fashion trends_2025-07-15/` (processed content)

### Case 2: Competitive Analysis

**Scenario**: Analyzing competitors for "AI marketing tools"

**Input:**
- Keyword: `AI marketing tools`
- Number of results: `10`

**Expected Output:**
```
Title: Best AI Marketing Tools for 2024: Complete Guide
Readability: 58.7
Top keywords: ['AI', 'marketing', 'tools', 'automation', 'software']
---
Title: 15 AI-Powered Marketing Tools Every Marketer Needs
Readability: 61.3
Top keywords: ['AI', 'marketing', 'tools', 'analytics', 'personalization']
---
...
```

### Case 3: Niche Research

**Scenario**: Exploring a specific niche like "indoor plant care for beginners"

**Input:**
- Keyword: `indoor plant care for beginners`
- Number of results: `6`

**Expected Output:**
```
Title: Indoor Plant Care Guide: Complete Beginner's Handbook
Readability: 78.2
Top keywords: ['indoor', 'plants', 'care', 'beginners', 'watering']
---
Title: How to Care for Indoor Plants: A Step-by-Step Guide
Readability: 75.9
Top keywords: ['indoor', 'plants', 'care', 'light', 'watering']
---
...
```

## Output Structure

### Directory Structure Created

```
project_root/
├── {keyword}_{date}/               # Raw crawled content
│   ├── page_1.html
│   ├── page_2.html
│   └── ...
└── extracted_content/
    └── {keyword}_{date}/           # Processed content
        ├── analysis_results.json
        ├── extracted_text_1.txt
        └── ...
```

### Data Analysis Output

For each analyzed page, you'll see:

- **Title**: The main title of the webpage
- **Readability Score**: Flesch Reading Ease score (0-100, higher = easier to read)
- **Top Keywords**: The 5 most frequent keywords found in the content

### Readability Score Interpretation

- **90-100**: Very Easy (5th grade level)
- **80-90**: Easy (6th grade level)
- **70-80**: Fairly Easy (7th grade level)
- **60-70**: Standard (8th-9th grade level)
- **50-60**: Fairly Difficult (10th-12th grade level)
- **30-50**: Difficult (College level)
- **0-30**: Very Difficult (Graduate level)

## Advanced Usage

### Customizing Parameters

You can modify the script to customize:

```python
# In main.py, modify these values:
crawler = WebpageCrawler(respect_robots=False)  # Change to True to respect robots.txt
crawl_results = crawler.batch_crawl(urls, delay=2.0)  # Adjust delay between requests
```

### Batch Processing

For processing multiple keywords, you could create a wrapper script:

```python
# batch_process.py
keywords = [
    "artificial intelligence",
    "machine learning",
    "deep learning"
]

for keyword in keywords:
    # Modify main.py to accept keyword as parameter
    # Then call it programmatically
```

## Troubleshooting

### Common Issues

1. **API Key Errors**
   ```
   Error: Invalid API key
   Solution: Check your .env file and Google API key
   ```

2. **No Results Found**
   ```
   Error: No search results
   Solution: Try different keywords or check CSE configuration
   ```

3. **Permission Errors**
   ```
   Error: Permission denied creating directory
   Solution: Ensure write permissions in the project directory
   ```

4. **Import Errors**
   ```
   Error: Module not found
   Solution: Run from project root and check sys.path configuration
   ```

### Best Practices

- **Keyword Selection**: Use specific, long-tail keywords for better results
- **Result Limits**: Start with 5-10 results to avoid rate limiting
- **Delay Settings**: Keep crawler delay at 2+ seconds to be respectful
- **Storage Management**: Regularly clean up generated directories

## Integration with Other Components

This script is designed to work with:

- **LLM Generator**: Pass analyzed content to content generation pipeline
- **SEO Tools**: Use extracted keywords for SEO optimization
- **Content Processor**: Further refine and structure the content

## Next Steps

After running `main.py`, you can:

1. **Analyze Results**: Review the readability scores and keywords
2. **Generate Content**: Use the research as input for AI content generation
3. **SEO Optimization**: Apply the discovered keywords to your content strategy
4. **Competitive Analysis**: Compare your content against the analyzed competitors

## Support

For issues or questions:
- Check the logs in the generated directories
- Review the extracted content for data quality
- Ensure all dependencies are properly installed
- Verify API credentials and quotas
