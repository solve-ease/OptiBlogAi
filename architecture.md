## Architecture

<pre>
project-root/
│
├── .github/
│ └── workflows/
│ └── ci-cd.yml # GitHub Actions for CI/CD
│
├── src/
│ ├── scraper/
│ │ ├── init.py
│ │ ├── google_search.py # Google Search API integration
│ │ ├── webpage_crawler.py# Scrapy/Playwright implementation
│ │ └── content_extractor.py # Trafilatura wrapper
│ │
│ ├── content_processor/
│ │ ├── init.py
│ │ ├── text_analyzer.py # NLTK-based analysis
│ │ └── seo_tools.py # SEO metrics calculation
│ │
│ ├── llm_generator/
│ │ ├── init.py
│ │ ├── prompt_engineer.py# LLM prompt templates
│ │ ├── model_handler.py # HF API/Ollama integration
│ │ └── post_generator.py # LangGraph workflow setup
│ │
│ ├── api/
│ │ ├── init.py
│ │ ├── schemas.py # Pydantic models
│ │ └── endpoints.py # FastAPI routes
│ │
│ ├── config/
│ │ ├── init.py
│ │ ├── settings.py # App configuration
│ │ └── constants.py # API keys (template)
│ │
│ └── main.py # Entry point
│
├── tests/
│ ├── unit/
│ │ ├── test_scraper.py
│ │ ├── test_llm.py
│ │ └── test_seo.py
│ │
│ └── integration/
│ └── test_workflow.py
│
├── docs/
│ ├── architecture.md # This document
│ ├── setup-guide.md
│ └── ethical-guidelines.md
│
├── assets/
│ ├── examples/ # Sample scraped content
│ └── outputs/ # Generated blog posts
│
├── scripts/
│ ├── setup_env.sh # Environment setup
│ └── deploy.sh # Deployment script
│
├── .env.example # Environment variables template
├── requirements.txt # Python dependencies
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml # Modern Python config
├── README.md
└── .gitignore
</pre>