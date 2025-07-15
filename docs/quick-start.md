# Quick Start Guide - main.py

## TL;DR - How to Run main.py

### 1. Setup (One-time)

```bash
# Navigate to project directory
cd /home/kalie/work/projects/OptiBlogAi

# Activate virtual environment
source myenv/bin/activate

# Create .env file with your API keys
echo "GOOGLE_API_KEY=your_api_key_here" > .env
echo "GOOGLE_CSE_ID=your_cse_id_here" >> .env
```

### 2. Run the Script

```bash
python src/main.py
```

### 3. Sample Input/Output

**Input:**
```
Enter a keyword to search: digital marketing strategies
Enter the number of results to fetch: 5
```

**Output:**
```
Title: 10 Digital Marketing Strategies That Actually Work in 2024
Readability: 68.3
Top keywords: ['digital', 'marketing', 'strategies', 'SEO', 'content']
---
Title: Complete Guide to Digital Marketing: 15 Proven Strategies
Readability: 72.1
Top keywords: ['digital', 'marketing', 'strategies', 'social', 'email']
---
Title: Digital Marketing Strategy: How to Create One That Works
Readability: 65.9
Top keywords: ['digital', 'marketing', 'strategy', 'brand', 'audience']
---
Title: 7 Essential Digital Marketing Strategies for Small Business
Readability: 74.2
Top keywords: ['digital', 'marketing', 'strategies', 'business', 'online']
---
Title: Advanced Digital Marketing Strategies for 2024
Readability: 61.4
Top keywords: ['digital', 'marketing', 'strategies', 'advanced', 'ROI']
---
```

### 4. Generated Files

After running, you'll find:
- `digital marketing strategies_2025-07-15/` - Raw HTML files
- `extracted_content/digital marketing strategies_2025-07-15/` - Processed content and analysis

## Real-World Examples

### E-commerce Research
```bash
# Keyword: "conversion rate optimization"
# Results: 8
# Use case: Research CRO strategies for online store
```

### Tech Blog Research  
```bash
# Keyword: "Python web scraping tutorial"
# Results: 6
# Use case: Create comprehensive Python scraping guide
```

### Health & Wellness Content
```bash
# Keyword: "meditation benefits for stress"
# Results: 7
# Use case: Write evidence-based wellness article
```

## What main.py Actually Does

1. **Searches Google** for your keyword using Custom Search API
2. **Crawls top results** (respects 2-second delays between requests)
3. **Extracts clean content** from each webpage
4. **Analyzes readability** using Flesch Reading Ease algorithm
5. **Identifies top keywords** in each piece of content
6. **Saves everything** to organized directories for further analysis

## Pro Tips

- Use **specific keywords** (e.g., "email marketing automation tools" vs "marketing")
- Start with **5-10 results** to avoid rate limits
- **Check the extracted_content folder** for detailed analysis files
- **Combine results** from multiple keyword searches for comprehensive research
