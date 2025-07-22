"""React agent node for decision making – LangGraph 0.5.x compatible."""

from typing import Dict, Any, Literal
from langgraph.constants import END  # canonical END literal

from src.schemas.state import GraphState
from src.utils.logger import get_logger

logger = get_logger(__name__)

DecisionType = Literal["ACCEPT", "REVISE", "FAIL"]


# ------------------------------------------------------------------
# 1. Core decision node (used if you *call* the agent as a node)
# ------------------------------------------------------------------
async def react_agent(state: GraphState) -> DecisionType:
    """
    Decide whether to ACCEPT, REVISE, or fail the current blog attempt.
    This function is **not** used by the conditional edge logic below;
    it is kept for backward compatibility / unit tests.
    """
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
        has_cleaned_posts=len(state.cleaned_posts) > 0,
    )

    # 1) Hard failure rules
    if attempts >= max_attempts:
        logger.warning("FAIL: Maximum attempts reached")
        return "FAIL"

    if not state.draft_blog.strip() and not state.cleaned_posts:
        logger.warning("FAIL: No content and no source material")
        return "FAIL"

    # 2) Accept rules
    if final_score >= seo_threshold and state.draft_blog.strip():
        logger.info("ACCEPT: Score meets threshold")
        return "ACCEPT"

    if state.draft_blog.strip() and len(state.draft_blog) > 500 and attempts >= 2:
        logger.info("ACCEPT: Reasonable content after ≥2 attempts")
        return "ACCEPT"

    # 3) Otherwise retry
    logger.info("REVISE: Retrying generation")
    return "REVISE"


# ------------------------------------------------------------------
# 2. Conditional-edge router used in graph.py
#    Must return strings understood by LangGraph 0.5.x
# ------------------------------------------------------------------
def decide_next_action(state: GraphState):
    """
    Router used by the conditional edge coming out of the 'evaluate' node.
    Returns:
        "generate"  – loop back to generate node
        END         – finish the workflow (LangGraph constant)
    """
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
        has_cleaned_posts=len(state.cleaned_posts) > 0,
    )

    # --- Termination conditions -------------------------------------------------
    if attempts >= max_attempts:
        logger.info("Terminating: max attempts reached")
        # state.final_blog = state.draft_blog
        return END

    if not state.cleaned_posts and not state.draft_blog.strip():
        logger.info("Terminating: no material & no content")
        return END

    if final_score >= seo_threshold and state.draft_blog.strip():
        logger.info("Terminating: target score achieved")
        # state.final_blog = state.draft_blog
        return END

    if state.draft_blog.strip() and len(state.draft_blog) > 500 and attempts >= 2:
        logger.info("Terminating: reasonable content accepted")
        # state.final_blog = state.draft_blog
        return END

    # --- Continue ---------------------------------------------------------------
    logger.info("Continuing: retrying generation")
    return "generate"
