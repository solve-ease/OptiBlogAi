"""Enhanced blog generation API routes with security and better customization."""

import uuid
import time
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Request
from fastapi.responses import JSONResponse

from src.schemas.models import (
    EnhancedBlogGenerationRequest,
    EnhancedBlogGenerationResponse,
    SEOScoreDetails,
    ContentMetadata,
    BlogCustomization
)
from src.api.auth import verify_api_key
from src.agents.graph import get_blog_generation_graph
from src.utils.logger import get_logger
from datetime import datetime

logger = get_logger(__name__)

router = APIRouter(prefix="/api/v1", tags=["blog"])

@router.post(
    "/generate-blog",
    response_model=EnhancedBlogGenerationResponse,
    summary="Generate Enhanced SEO-optimized blog content",
    description="Generate a comprehensive, customizable blog post using AI agents with advanced options",
)
async def generate_enhanced_blog(
    request: EnhancedBlogGenerationRequest,
    background_tasks: BackgroundTasks,
    authorized: bool = Depends(verify_api_key),
    fastapi_request: Request = None
) -> EnhancedBlogGenerationResponse:
    """Generate enhanced SEO-optimized blog content with customization options.

    This endpoint provides advanced blog generation with:
    - Custom tone, audience, and content type
    - Flexible word count targets
    - Advanced SEO optimization
    - Detailed analytics and metadata
    - Rate limiting and security

    Args:
        request: Enhanced blog generation request with customization options
        background_tasks: FastAPI background tasks
        authorized: API key verification result
        fastapi_request: FastAPI request object for tracking

    Returns:
        EnhancedBlogGenerationResponse with detailed content and analytics

    Raises:
        HTTPException: If generation fails or validation errors occur
    """
    start_time = time.time()
    run_id = str(uuid.uuid4())

    # Track usage statistics
    if hasattr(fastapi_request.app.state, 'usage_stats'):
        fastapi_request.app.state.usage_stats["total_requests"] += 1

    logger.info(
        "Enhanced blog generation request received",
        run_id=run_id,
        keyword=request.keyword,
        max_attempts=request.max_attempts,
        seo_threshold=request.seo_threshold,
        user_id=request.user_id,
        priority=request.priority,
        customization=request.customization.dict(),
        timestamp=datetime.utcnow().isoformat(),
    )

    try:
        # Validate and prepare customization
        customization = request.customization or BlogCustomization()
        
        # Get blog generation graph
        blog_graph = await get_blog_generation_graph()

        # Execute workflow with enhanced parameters
        result = await blog_graph.run_blog_generation(
            keyword=request.keyword.strip(),
            max_attempts=request.max_attempts or 3,
            seo_threshold=request.seo_threshold or 75.0,
            thread_id=run_id,
            # customization=customization.dict(),  # Pass customization to graph
        )

        processing_time = time.time() - start_time

        # Calculate additional metrics
        word_count = len(result["final_blog"].split()) if result["final_blog"] else 0
        reading_time = max(1, word_count // 200)  # ~200 words per minute
        
        # Determine content quality grade based on SEO score
        final_score = result["final_score"]
        if final_score >= 90:
            quality_grade = "A"
        elif final_score >= 80:
            quality_grade = "B"
        elif final_score >= 70:
            quality_grade = "C"
        elif final_score >= 60:
            quality_grade = "D"
        else:
            quality_grade = "F"

        # Create enhanced SEO scores
        seo_scores = SEOScoreDetails(
            **result["seo_scores"],
            word_count=word_count,
            reading_time_minutes=reading_time,
            keyword_density=result.get("keyword_density", 0.0)
        )

        # Create metadata
        metadata = ContentMetadata(
            sources_used=result.get("sources_used", []),
            processing_time_seconds=round(processing_time, 2),
            model_used=result.get("model_used", "gemini-2.0-flash"),
            content_language="en",
            # generated_at=datetime.utcnow()
        )

        # Create enhanced response
        response = EnhancedBlogGenerationResponse(
            run_id=run_id,
            final_blog=result["final_blog"],
            seo_scores=seo_scores,
            attempts=result["attempts"],
            success=result["success"],
            metadata=metadata,
            customization_applied=customization,
            status="completed",
            progress_percentage=100,
            estimated_reading_time=reading_time,
            content_quality_grade=quality_grade
        )

        # Update usage statistics
        if hasattr(fastapi_request.app.state, 'usage_stats'):
            if result["success"]:
                fastapi_request.app.state.usage_stats["successful_requests"] += 1
            else:
                fastapi_request.app.state.usage_stats["failed_requests"] += 1

        # Send webhook notification if callback URL provided
        if request.callback_url:
            background_tasks.add_task(
                send_webhook_notification,
                request.callback_url,
                response.dict(),
                run_id
            )

        logger.info(
            "Enhanced blog generation completed successfully",
            run_id=run_id,
            keyword=request.keyword,
            final_score=final_score,
            attempts=result["attempts"],
            content_length=len(result["final_blog"]),
            word_count=word_count,
            processing_time=round(processing_time, 2),
            quality_grade=quality_grade
        )

        return response

    except HTTPException:
        # Update failed requests counter
        if hasattr(fastapi_request.app.state, 'usage_stats'):
            fastapi_request.app.state.usage_stats["failed_requests"] += 1
        raise
    except Exception as e:
        # Update failed requests counter
        if hasattr(fastapi_request.app.state, 'usage_stats'):
            fastapi_request.app.state.usage_stats["failed_requests"] += 1
            
        logger.error(
            "Enhanced blog generation failed with unexpected error",
            run_id=run_id,
            keyword=request.keyword,
            error=str(e),
            error_type=type(e).__name__,
            processing_time=round(time.time() - start_time, 2)
        )
        
        raise HTTPException(
            status_code=500,
            detail=f"Blog generation failed: {str(e)}"
        )

async def send_webhook_notification(callback_url: str, response_data: dict, run_id: str):
    """Send webhook notification for async processing."""
    try:
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.post(
                callback_url,
                json=response_data,
                timeout=aiohttp.ClientTimeout(total=10)
            ) as resp:
                if resp.status == 200:
                    logger.info("Webhook notification sent successfully", run_id=run_id)
                else:
                    logger.warning(
                        "Webhook notification failed",
                        run_id=run_id,
                        status=resp.status
                    )
    except Exception as e:
        logger.error(
            "Failed to send webhook notification",
            run_id=run_id,
            error=str(e)
        )

# Legacy endpoint for backward compatibility
@router.post(
    "/generate-blog-simple",
    summary="Simple blog generation (legacy)",
    description="Legacy endpoint for backward compatibility"
)
async def generate_blog_simple(
    request: dict,
    authorized: bool = Depends(verify_api_key)
):
    """Legacy endpoint for backward compatibility."""
    # Convert legacy request to enhanced request
    enhanced_request = EnhancedBlogGenerationRequest(
        keyword=request.get("keyword"),
        max_attempts=request.get("max_attempts", 3),
        seo_threshold=request.get("seo_threshold", 75.0)
    )
    
    # Call enhanced endpoint
    response = await generate_enhanced_blog(enhanced_request, BackgroundTasks(), authorized)
    
    # Return simplified response for backward compatibility
    return {
        "run_id": response.run_id,
        "final_blog": response.final_blog,
        "seo_scores": response.seo_scores.dict(),
        "attempts": response.attempts,
        "success": response.success
    }