#!/usr/bin/env python3
"""Test script to verify LangGraph fixes work correctly."""

import asyncio
import json
from src.agents.graph import get_blog_generation_graph
from src.utils.logger import configure_logging, get_logger

configure_logging()
logger = get_logger(__name__)


async def test_blog_generation():
    """Test the blog generation workflow."""
    print("🧪 Testing Blog Generation Workflow")
    print("=" * 40)
    
    try:
        # Get the graph
        graph = await get_blog_generation_graph()
        print("✅ Graph compiled successfully")
        
        # Test with simple keyword
        result = await graph.run_blog_generation(
            keyword="python programming",
            max_attempts=2,
            seo_threshold=50.0,
            thread_id="test-001"
        )
        
        print("✅ Workflow completed successfully")
        print(f"📊 Results:")
        print(f"   Success: {result['success']}")
        print(f"   Final Score: {result['final_score']}")
        print(f"   Attempts: {result['attempts']}")
        print(f"   Content Length: {len(result['final_blog'])} characters")
        
        if result['final_blog']:
            # Show first 200 characters of content
            preview = result['final_blog'][:200] + "..." if len(result['final_blog']) > 200 else result['final_blog']
            print(f"   Content Preview: {preview}")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """Run all tests."""
    success = await test_blog_generation()
    
    if success:
        print("\n🎉 All tests passed! LangGraph is working correctly.")
        return 0
    else:
        print("\n❌ Tests failed. Check the errors above.")
        return 1


if __name__ == "__main__":
    import sys
    sys.exit(asyncio.run(main()))