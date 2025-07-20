"""Blog generation API routes."""

import uuid
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse

from src.schemas.blog import (
    BlogGenerationRequest,
    BlogGenerationResponse,
    HealthResponse,
)
from src.agents.graph import get_blog_generation_graph
from src.utils.logger import get_logger
from datetime import datetime

logger = get_logger(__name__)

router = APIRouter(prefix="/api/v1", tags=["blog"])


@router.post(
    "/generate-blog",
    response_model=BlogGenerationResponse,
    summary="Generate SEO-optimized blog content",
    description="Generate a comprehensive blog post using AI agents with Gemini and search integration",
)
async def generate_blog(request: BlogGenerationRequest) -> BlogGenerationResponse:
    """Generate SEO-optimized blog content for a given keyword.

    This endpoint triggers a LangGraph workflow that:
    1. Searches for top blog posts on the topic
    2. Scrapes and analyzes content from those posts
    3. Generates original, SEO-optimized content
    4. Evaluates and iteratively improves the content

    Args:
        request: Blog generation request with keyword and parameters

    Returns:
        BlogGenerationResponse with generated content and metrics

    Raises:
        HTTPException: If generation fails or validation errors occur
    """
    run_id = str(uuid.uuid4())

    logger.info(
        "Blog generation request received",
        run_id=run_id,
        keyword=request.keyword,
        max_attempts=request.max_attempts,
        seo_threshold=request.seo_threshold,
        user="4darsh-Dev",
        timestamp=datetime.utcnow().isoformat(),
    )

    try:
        # Validate keyword
        if not request.keyword.strip():
            raise HTTPException(status_code=422, detail="Keyword cannot be empty")

        # Get blog generation graph
        blog_graph = await get_blog_generation_graph()

        # Execute workflow
        result = await blog_graph.run_blog_generation(
            keyword=request.keyword.strip(),
            max_attempts=request.max_attempts or 3,
            seo_threshold=request.seo_threshold or 75.0,
            thread_id=run_id,
        )

        # Check if generation was successful
        if not result["success"]:
            logger.warning(
                "Blog generation failed to meet requirements",
                run_id=run_id,
                final_score=result["final_score"],
                attempts=result["attempts"],
            )

            # Still return the best attempt if we have content
            if result["final_blog"]:
                logger.info("Returning best attempt despite low score", run_id=run_id)
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to generate satisfactory content after {result['attempts']} attempts. "
                    f"Best score achieved: {result['final_score']}",
                )

        response = BlogGenerationResponse(
            run_id=run_id,
            final_blog=result["final_blog"],
            seo_scores=result["seo_scores"],
            attempts=result["attempts"],
            success=result["success"],
        )

        logger.info(
            "Blog generation completed successfully",
            run_id=run_id,
            keyword=request.keyword,
            final_score=result["final_score"],
            attempts=result["attempts"],
            content_length=len(result["final_blog"]),
        )

        return response

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(
            "Blog generation failed with unexpected error",
            run_id=run_id,
            keyword=request.keyword,
            error=str(e),
            error_type=type(e).__name__,
        )

        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during blog generation: {str(e)}",
        )


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check endpoint",
    description="Check the health status of the blog generation service",
)
async def health_check() -> HealthResponse:
    """Health check endpoint for monitoring and load balancers.

    Returns:
        HealthResponse with service status and metadata
    """
    try:
        # You could add more sophisticated health checks here:
        # - Database connectivity
        # - External API availability
        # - Memory usage
        # - Disk space

        return HealthResponse(
            status="healthy", timestamp=datetime.utcnow().isoformat(), version="0.1.0"
        )

    except Exception as e:
        logger.error("Health check failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


@router.get(
    "/metrics",
    summary="Service metrics endpoint",
    description="Get service metrics and statistics",
)
async def get_metrics() -> Dict[str, Any]:
    """Get service metrics for monitoring.

    Returns:
        Dictionary with service metrics
    """
    try:
        # In a production environment, you would collect real metrics
        # from your monitoring system (Prometheus, etc.)

        metrics = {
            "service": "gemini-blog-agent",
            "version": "0.1.0",
            "uptime_seconds": 0,  # Implement actual uptime tracking
            "total_requests": 0,  # Implement request counter
            "successful_generations": 0,  # Implement success counter
            "failed_generations": 0,  # Implement failure counter
            "average_generation_time": 0.0,  # Implement timing metrics
            "timestamp": datetime.utcnow().isoformat(),
        }

        return metrics

    except Exception as e:
        logger.error("Failed to retrieve metrics", error=str(e))
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve metrics: {str(e)}"
        )
