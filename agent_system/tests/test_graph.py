"""Test cases for LangGraph workflow - Fixed version."""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from src.schemas.state import GraphState
from src.agents.nodes.search_top_posts import search_top_posts
from src.agents.nodes.scrape_posts import scrape_posts
from src.agents.nodes.clean_validate import clean_validate
from src.agents.nodes.generate_blog import generate_blog
from src.agents.nodes.evaluate_seo import evaluate_seo
from src.agents.nodes.react_agent import react_agent, decide_next_action


class TestGraphState:
    """Test cases for GraphState schema."""
    
    def test_graph_state_creation(self, sample_keyword):
        """Test GraphState creation with valid data."""
        state = GraphState(keyword=sample_keyword)
        
        assert state.keyword == sample_keyword
        assert state.top_posts == []
        assert state.cleaned_posts == []
        assert state.draft_blog == ""
        assert state.seo_scores == {}
        assert state.final_score == 0.0
        assert state.attempts == 0
        assert state.max_attempts == 3
        assert state.seo_threshold == 75.0  # Default value
        assert state.final_blog == ""
        assert state.raw_html_content == {}
    
    def test_graph_state_with_custom_values(self):
        """Test GraphState creation with custom values."""
        state = GraphState(
            keyword="test keyword",
            max_attempts=5,
            attempts=2,
            final_score=85.5,
            seo_threshold=80.0
        )
        
        assert state.keyword == "test keyword"
        assert state.max_attempts == 5
        assert state.attempts == 2
        assert state.final_score == 85.5
        assert state.seo_threshold == 80.0


class TestSearchTopPostsNode:
    """Test cases for search_top_posts node."""
    
    @pytest.mark.asyncio
    async def test_search_top_posts_success(self, sample_graph_state, mock_search_results):
        """Test successful search execution."""
        with patch('src.agents.nodes.search_top_posts.get_gemini_client') as mock_gemini, \
             patch('src.agents.nodes.search_top_posts.create_search_client') as mock_search_client:
            
            # Mock Gemini client failure to test fallback
            mock_gemini_instance = AsyncMock()
            mock_gemini_instance.generate_content.side_effect = Exception("Gemini failed")
            mock_gemini.return_value = mock_gemini_instance
            
            # Mock search client success - Fix the async call
            mock_search_instance = MagicMock()
            # Make the async method return a coroutine
            async def mock_search_async(*args, **kwargs):
                return mock_search_results
            mock_search_instance.search_top_posts = mock_search_async
            mock_search_client.return_value = mock_search_instance
            
            result = await search_top_posts(sample_graph_state)
            
            assert "top_posts" in result
            assert len(result["top_posts"]) == len(mock_search_results)
            assert result["top_posts"][0]["url"] == mock_search_results[0]["url"]
    
    @pytest.mark.asyncio
    async def test_search_top_posts_empty_keyword(self):
        """Test search with empty keyword."""
        state = GraphState(keyword="")
        
        with patch('src.agents.nodes.search_top_posts.get_gemini_client') as mock_gemini, \
             patch('src.agents.nodes.search_top_posts.create_search_client') as mock_search_client:
            
            mock_gemini_instance = AsyncMock()
            mock_gemini_instance.generate_content.side_effect = Exception("Gemini failed")
            mock_gemini.return_value = mock_gemini_instance
            
            mock_search_client.return_value = None  # No search client available
            
            result = await search_top_posts(state)
            
            # Should return mock results
            assert "top_posts" in result
            assert len(result["top_posts"]) > 0  # Mock results should be generated


class TestScrapePostsNode:
    """Test cases for scrape_posts node."""
    
    @pytest.mark.asyncio
    async def test_scrape_posts_success(self, sample_graph_state, mock_search_results):
        """Test successful post scraping."""
        sample_graph_state.top_posts = mock_search_results
        
        mock_html_content = {
            "https://example.com/fastapi-tutorial-1": "<html><body>Content 1</body></html>",
            "https://example.com/fastapi-tutorial-2": "<html><body>Content 2</body></html>"
        }
        
        with patch('src.agents.nodes.scrape_posts.create_web_scraper') as mock_scraper:
            mock_scraper_instance = MagicMock()
            # Fix: Make the async method return a coroutine
            async def mock_scrape_async(*args, **kwargs):
                return mock_html_content
            mock_scraper_instance.scrape_multiple_urls = mock_scrape_async
            mock_scraper.return_value = mock_scraper_instance
            
            result = await scrape_posts(sample_graph_state)
            
            assert "raw_html_content" in result
            assert len(result["raw_html_content"]) == 2
    
    @pytest.mark.asyncio
    async def test_scrape_posts_empty_posts(self, sample_graph_state):
        """Test scraping with no posts."""
        sample_graph_state.top_posts = []
        
        result = await scrape_posts(sample_graph_state)
        
        assert result["raw_html_content"] == {}


class TestReactAgentNode:
    """Test cases for react_agent node."""
    
    @pytest.mark.asyncio
    async def test_react_agent_accept(self, sample_graph_state):
        """Test react agent decision to accept."""
        sample_graph_state.final_score = 80.0
        sample_graph_state.seo_threshold = 75.0
        
        decision = await react_agent(sample_graph_state)
        assert decision == "ACCEPT"
    
    @pytest.mark.asyncio
    async def test_react_agent_revise(self, sample_graph_state):
        """Test react agent decision to revise."""
        sample_graph_state.final_score = 70.0
        sample_graph_state.attempts = 1
        sample_graph_state.max_attempts = 3
        sample_graph_state.seo_threshold = 75.0
        
        decision = await react_agent(sample_graph_state)
        assert decision == "REVISE"
    
    @pytest.mark.asyncio
    async def test_react_agent_fail(self, sample_graph_state):
        """Test react agent decision to fail."""
        sample_graph_state.final_score = 60.0
        sample_graph_state.attempts = 3
        sample_graph_state.max_attempts = 3
        sample_graph_state.seo_threshold = 75.0
        
        decision = await react_agent(sample_graph_state)
        assert decision == "FAIL"
    
    def test_decide_next_action_accept(self, sample_graph_state):
        """Test decide_next_action for acceptance."""
        sample_graph_state.final_score = 80.0
        sample_graph_state.draft_blog = "Test blog content"
        sample_graph_state.seo_threshold = 75.0
        
        action = decide_next_action(sample_graph_state)
        assert action == "END"
        assert sample_graph_state.final_blog == "Test blog content"
    
    def test_decide_next_action_revise(self, sample_graph_state):
        """Test decide_next_action for revision."""
        sample_graph_state.final_score = 70.0
        sample_graph_state.attempts = 1
        sample_graph_state.max_attempts = 3
        sample_graph_state.seo_threshold = 75.0
        
        action = decide_next_action(sample_graph_state)
        assert action == "generate"
    
    def test_decide_next_action_fail(self, sample_graph_state):
        """Test decide_next_action for failure."""
        sample_graph_state.final_score = 60.0
        sample_graph_state.attempts = 3
        sample_graph_state.max_attempts = 3
        sample_graph_state.seo_threshold = 75.0
        
        action = decide_next_action(sample_graph_state)
        assert action == "END"


class TestEvaluateSEONode:
    """Test cases for evaluate_seo node."""
    
    @pytest.mark.asyncio
    async def test_evaluate_seo_with_content(self, sample_graph_state, sample_blog_content):
        """Test SEO evaluation with valid content."""
        sample_graph_state.draft_blog = sample_blog_content
        
        mock_evaluation = """
        ```json
        {
            "title_score": 85,
            "meta_description_score": 80,
            "keyword_optimization_score": 90,
            "content_structure_score": 88,
            "readability_score": 82,
            "content_quality_score": 87,
            "technical_seo_score": 85,
            "final_score": 85.0,
            "feedback": "Good content overall"
        }
        ```
        """
        
        with patch('src.agents.nodes.evaluate_seo.get_gemini_client') as mock_gemini, \
             patch('builtins.open', mock_open_read_text("Evaluate: {blog_content}")):
            
            mock_gemini_instance = AsyncMock()
            mock_gemini_instance.generate_content.return_value = mock_evaluation
            mock_gemini.return_value = mock_gemini_instance
            
            result = await evaluate_seo(sample_graph_state)
            
            assert "seo_scores" in result
            assert "final_score" in result
            assert result["final_score"] > 0
    
    @pytest.mark.asyncio
    async def test_evaluate_seo_empty_content(self, sample_graph_state):
        """Test SEO evaluation with empty content."""
        sample_graph_state.draft_blog = ""
        
        result = await evaluate_seo(sample_graph_state)
        
        assert result["seo_scores"] == {}
        assert result["final_score"] == 0.0


def mock_open_read_text(content):
    """Helper function to mock file reading."""
    from unittest.mock import mock_open
    return mock_open(read_data=content)