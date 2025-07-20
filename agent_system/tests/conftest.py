"""Pytest configuration and fixtures - Fixed version."""

import pytest
import asyncio
import os
from typing import AsyncGenerator, Generator
from httpx import AsyncClient, ASGITransport
from fastapi.testclient import TestClient

from src.api.app import create_app
from src.schemas.state import GraphState
from src.tools.gemini_client import GeminiClient, GeminiConfig


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def app():
    """Create FastAPI app for testing."""
    return create_app()


@pytest.fixture
def client(app):
    """Create test client for FastAPI app."""
    return TestClient(app)


@pytest.fixture
async def async_client(app) -> AsyncGenerator[AsyncClient, None]:
    """Create async test client for FastAPI app."""
    # Fix: Use transport parameter instead of app parameter
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def sample_keyword() -> str:
    """Sample keyword for testing."""
    return "fastapi tutorial"


@pytest.fixture
def sample_graph_state(sample_keyword: str) -> GraphState:
    """Sample GraphState for testing."""
    return GraphState(
        keyword=sample_keyword,
        max_attempts=3,
        seo_threshold=75.0
    )


@pytest.fixture
def mock_search_results():
    """Mock search results for testing."""
    return [
        {
            "url": "https://example.com/fastapi-tutorial-1",
            "title": "Complete FastAPI Tutorial for Beginners",
            "snippet": "Learn FastAPI from scratch with this comprehensive tutorial...",
            "meta_description": "A complete guide to building APIs with FastAPI"
        },
        {
            "url": "https://example.com/fastapi-tutorial-2", 
            "title": "Advanced FastAPI Techniques",
            "snippet": "Explore advanced FastAPI features like dependency injection...",
            "meta_description": "Advanced FastAPI patterns and best practices"
        }
    ]


@pytest.fixture
def mock_cleaned_posts():
    """Mock cleaned posts for testing."""
    return [
        {
            "url": "https://example.com/fastapi-tutorial-1",
            "title": "Complete FastAPI Tutorial for Beginners",
            "meta_description": "A complete guide to building APIs with FastAPI",
            "headings": ["Introduction", "Getting Started", "Creating Your First API"],
            "paragraphs": [
                "FastAPI is a modern web framework for building APIs with Python.",
                "It's based on standard Python type hints and provides automatic API documentation.",
                "In this tutorial, we'll cover everything you need to know about FastAPI."
            ],
            "word_count": 1500
        }
    ]


@pytest.fixture
def mock_html_content():
    """Mock HTML content for testing."""
    return """
    <html>
    <head>
        <title>Complete FastAPI Tutorial</title>
        <meta name="description" content="Learn FastAPI with this comprehensive guide">
    </head>
    <body>
        <h1>Complete FastAPI Tutorial</h1>
        <h2>Introduction</h2>
        <p>FastAPI is a modern web framework for building APIs with Python.</p>
        <h2>Getting Started</h2>
        <p>First, install FastAPI using pip install fastapi.</p>
        <p>Then create your first API endpoint.</p>
    </body>
    </html>
    """


@pytest.fixture
def mock_gemini_config():
    """Mock Gemini configuration for testing."""
    return GeminiConfig(
        api_key="test-api-key",
        model_name="gemini-1.5-pro-latest",
        temperature=0.7
    )


@pytest.fixture
def sample_blog_content():
    """Sample generated blog content for testing."""
    return """
    <title>Complete FastAPI Tutorial: Build Modern APIs with Python</title>
    <meta name="description" content="Learn how to build modern, fast APIs with FastAPI. Complete tutorial covering installation, basic concepts, and advanced features.">
    
    <h1>Complete FastAPI Tutorial: Build Modern APIs with Python</h1>
    
    <p>FastAPI has revolutionized the way we build APIs in Python. This comprehensive tutorial will guide you through everything you need to know to get started with FastAPI and build production-ready APIs.</p>
    
    <h2>What is FastAPI?</h2>
    <p>FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.</p>
    
    <h2>Getting Started with FastAPI</h2>
    <p>Installing FastAPI is straightforward. You can install it using pip along with an ASGI server like uvicorn.</p>
    
    <h2>Creating Your First API</h2>
    <p>Let's create a simple API endpoint to understand the basics of FastAPI.</p>
    
    <h2>Advanced Features</h2>
    <p>FastAPI provides many advanced features like automatic API documentation, data validation, and dependency injection.</p>
    
    <h2>Frequently Asked Questions</h2>
    <h3>Is FastAPI suitable for production?</h3>
    <p>Yes, FastAPI is production-ready and is used by many companies in production environments.</p>
    
    <h2>Conclusion</h2>
    <p>FastAPI is an excellent choice for building modern APIs. Start building your next API with FastAPI today!</p>
    """


# Environment variable overrides for testing
@pytest.fixture(autouse=True)
def mock_env_vars(monkeypatch):
    """Mock environment variables for testing."""
    monkeypatch.setenv("GOOGLE_API_KEY", "test-api-key")
    monkeypatch.setenv("GEMINI_MODEL", "gemini-1.5-pro-latest")
    monkeypatch.setenv("LANGSMITH_API_KEY", "test-langsmith-key")
    monkeypatch.setenv("LANGSMITH_PROJECT", "test-project")
    monkeypatch.setenv("MAX_CONCURRENT_REQUESTS", "5")
    monkeypatch.setenv("MAX_SCRAPE_TIMEOUT", "5")
    monkeypatch.setenv("ENVIRONMENT", "test")
    # Fix: Set trusted hosts to allow testserver
    monkeypatch.setenv("TRUSTED_HOSTS", "testserver,localhost,127.0.0.1")