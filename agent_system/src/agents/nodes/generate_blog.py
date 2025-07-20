"""Generate blog content node implementation - Fixed version."""

from typing import Dict, Any
from src.schemas.state import GraphState
from src.tools.gemini_client import get_gemini_client
from src.utils.logger import get_logger

logger = get_logger(__name__)


async def generate_blog(state: GraphState) -> Dict[str, Any]:
    """Generate blog content by synthesizing cleaned posts.
    
    Args:
        state: Current graph state containing cleaned_posts and keyword
        
    Returns:
        Updated state with draft_blog content
    """
    cleaned_posts = state.cleaned_posts
    keyword = state.keyword
    attempts = state.attempts
    
    # Critical check: If no cleaned posts, generate fallback content
    if not cleaned_posts:
        logger.warning("No cleaned posts available for blog generation")
        
        # Generate basic blog content without source material
        try:
            gemini_client = await get_gemini_client()
            
            fallback_prompt = f"""
            Write a comprehensive 1500-word blog post about: {keyword}
            
            Since no source material is available, create original content that covers:
            - Introduction to the topic
            - Key concepts and principles
            - Practical applications
            - Best practices
            - Common challenges and solutions
            - Future trends
            - Conclusion with actionable takeaways
            
            Make it SEO-optimized with:
            - Compelling title with the keyword
            - Meta description
            - Clear heading structure (H1, H2, H3)
            - Natural keyword integration
            - FAQ section
            
            Format as HTML with proper tags.
            """
            
            draft_blog = await gemini_client.generate_content(
                prompt=fallback_prompt,
                use_search=False,  # Don't use search for fallback
                temperature=0.7,
                max_output_tokens=4000
            )
            
            if draft_blog and len(draft_blog.strip()) >= 500:
                logger.info(
                    "Fallback blog generation completed",
                    keyword=keyword,
                    content_length=len(draft_blog),
                    attempts=attempts + 1
                )
                
                return {
                    "draft_blog": draft_blog,
                    "attempts": attempts + 1
                }
            else:
                raise ValueError("Generated fallback content is too short")
                
        except Exception as e:
            logger.error(
                "Fallback blog generation failed",
                keyword=keyword,
                error=str(e),
                attempts=attempts + 1
            )
            
            # Return minimal fallback content to prevent infinite loops
            minimal_content = f"""
            <title>{keyword.title()} - Complete Guide</title>
            <meta name="description" content="Learn about {keyword} with this comprehensive guide covering key concepts and best practices.">
            
            <h1>{keyword.title()} - Complete Guide</h1>
            
            <p>This is a comprehensive guide about {keyword}. While we encountered some technical difficulties gathering detailed source material, this guide will provide you with essential information about the topic.</p>
            
            <h2>Introduction</h2>
            <p>{keyword.title()} is an important topic that deserves careful consideration and understanding.</p>
            
            <h2>Key Concepts</h2>
            <p>Understanding the fundamentals of {keyword} is crucial for anyone looking to learn more about this subject.</p>
            
            <h2>Conclusion</h2>
            <p>This guide provides a foundation for understanding {keyword}. For more detailed information, consider exploring additional resources and documentation.</p>
            """
            
            return {
                "draft_blog": minimal_content,
                "attempts": attempts + 1
            }
    
    logger.info(
        "Starting blog generation", 
        keyword=keyword,
        source_posts=len(cleaned_posts),
        attempts=attempts + 1
    )
    
    try:
        # Prepare reference posts summary
        reference_posts = _prepare_reference_posts(cleaned_posts)
        
        # Load blog generation prompt template
        with open("src/agents/prompts/blog_gen_prompt.txt", "r") as f:
            blog_prompt_template = f.read()
        
        # Format prompt with data
        blog_prompt = blog_prompt_template.format(
            keyword=keyword,
            reference_posts=reference_posts
        )
        
        # Generate content using Gemini
        gemini_client = await get_gemini_client()
        
        draft_blog = await gemini_client.generate_content(
            prompt=blog_prompt,
            use_search=False,  # Don't use search for content generation
            temperature=0.7,
            max_output_tokens=4000
        )
        
        if not draft_blog or len(draft_blog.strip()) < 500:
            raise ValueError("Generated blog content is too short or empty")
        
        logger.info(
            "Blog generation completed successfully",
            keyword=keyword,
            content_length=len(draft_blog),
            attempts=attempts + 1
        )
        
        return {
            "draft_blog": draft_blog,
            "attempts": attempts + 1
        }
        
    except Exception as e:
        logger.error(
            "Blog generation failed",
            keyword=keyword,
            error=str(e),
            attempts=attempts + 1
        )
        
        # Return empty content to trigger failure handling
        return {
            "draft_blog": "",
            "attempts": attempts + 1
        }


def _prepare_reference_posts(cleaned_posts: list[Dict[str, Any]]) -> str:
    """Prepare reference posts summary for prompt."""
    reference_sections = []
    
    for i, post in enumerate(cleaned_posts[:8], 1):  # Limit to top 8 posts
        # Create a summary of each post
        title = post.get("title", "Untitled")
        url = post.get("url", "")
        headings = post.get("headings", [])
        paragraphs = post.get("paragraphs", [])
        word_count = post.get("word_count", 0)
        
        # Take first 3 paragraphs as summary
        summary_paragraphs = paragraphs[:3]
        summary_text = " ".join(summary_paragraphs)
        
        # Truncate if too long
        if len(summary_text) > 800:
            summary_text = summary_text[:800] + "..."
        
        # Format reference post
        reference_post = f"""
POST {i}: {title}
URL: {url}
Word Count: {word_count}
Key Headings: {', '.join(headings[:5])}
Summary: {summary_text}
---
"""
        reference_sections.append(reference_post)
    
    return "\n".join(reference_sections)