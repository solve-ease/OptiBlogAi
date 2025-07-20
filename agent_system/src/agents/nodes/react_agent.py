"""React agent node for decision making - Fixed END handling."""

from typing import Dict, Any, Literal
from src.schemas.state import GraphState
from src.utils.logger import get_logger

logger = get_logger(__name__)

DecisionType = Literal["ACCEPT", "REVISE", "FAIL"]


async def react_agent(state: GraphState) -> DecisionType:
    """Make decision on whether to accept, revise, or fail the blog generation."""
    final_score = state.final_score
    attempts = state.attempts
    max_attempts = state.max_attempts
    seo_threshold = state.seo_threshold
    
    logger.info(
        "React agent making decision",
        final_score=final_score,
        attempts=attempts,
        max_attempts=max_attempts,
        threshold=seo_threshold,
        has_content=bool(state.draft_blog.strip()),
        has_cleaned_posts=len(state.cleaned_posts) > 0
    )
    
    # Check for failure conditions first
    if attempts >= max_attempts:
        logger.warning("FAIL: Maximum attempts reached")
        return "FAIL"
    
    # Check if we have no content and no source material
    if not state.draft_blog.strip() and len(state.cleaned_posts) == 0:
        logger.warning("FAIL: No content generated and no source material")
        return "FAIL"
    
    # Check for acceptance
    if final_score >= seo_threshold and state.draft_blog.strip():
        logger.info("ACCEPT: Score meets threshold and content exists")
        return "ACCEPT"
    
    # Accept if we have reasonable content even with lower score
    if state.draft_blog.strip() and len(state.draft_blog) > 500 and attempts >= 2:
        logger.info("ACCEPT: Reasonable content available after multiple attempts")
        return "ACCEPT"
    
    # Retry if conditions allow
    if attempts < max_attempts:
        logger.info("REVISE: Retrying generation")
        return "REVISE"
    
    # Default to FAIL
    logger.warning("FAIL: No valid conditions met")
    return "FAIL"


def decide_next_action(state: GraphState) -> str:
    """Determine next action based on react agent decision."""
    final_score = state.final_score
    attempts = state.attempts
    max_attempts = state.max_attempts
    seo_threshold = state.seo_threshold
    
    logger.info(
        "Deciding next action",
        final_score=final_score,
        attempts=attempts,
        max_attempts=max_attempts,
        threshold=seo_threshold,
        has_content=bool(state.draft_blog.strip()),
        has_cleaned_posts=len(state.cleaned_posts) > 0
    )
    
    # CRITICAL: Always check for termination conditions first
    
    # Max attempts reached - terminate
    if attempts >= max_attempts:
        logger.info("Terminating: Maximum attempts reached")
        if state.draft_blog.strip():
            state.final_blog = state.draft_blog
        return "__end__"  # Fix: Use "__end__" instead of END
    
    # No source material and no content - terminate
    if len(state.cleaned_posts) == 0 and not state.draft_blog.strip():
        logger.info("Terminating: No source material and no content")
        return "__end__"
    
    # Good content achieved - terminate with success
    if final_score >= seo_threshold and state.draft_blog.strip():
        logger.info("Terminating: Target score achieved")
        state.final_blog = state.draft_blog
        return "__end__"
    
    # Reasonable content after multiple attempts - accept
    if (state.draft_blog.strip() and 
        len(state.draft_blog) > 500 and 
        attempts >= 2):
        logger.info("Terminating: Accepting reasonable content")
        state.final_blog = state.draft_blog
        return "__end__"
    
    # Continue only if we have attempts left and a reason to continue
    if attempts < max_attempts and (len(state.cleaned_posts) > 0 or not state.draft_blog.strip()):
        logger.info("Continuing: Retrying generation")
        return "generate"
    
    # Default termination
    logger.info("Terminating: Default case")
    if state.draft_blog.strip():
        state.final_blog = state.draft_blog
    return "__end__"