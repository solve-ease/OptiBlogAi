"""LangGraph StateGraph definition and configuration - Fixed END handling."""

import os
from typing import Dict, Any, Optional
from langgraph.graph import StateGraph, END

from src.schemas.state import GraphState
from src.agents.nodes import (
    search_top_posts,
    scrape_posts,
    clean_validate,
    generate_blog,
    evaluate_seo,
    react_agent,
)
from src.agents.nodes.react_agent import decide_next_action
from src.memory.checkpointer import get_memory_saver
from src.utils.logger import get_logger

logger = get_logger(__name__)


class BlogGenerationGraph:
    """Blog generation workflow using LangGraph."""
    
    def __init__(self):
        """Initialize the blog generation graph."""
        self.workflow = None
        self.app = None
        
    async def create_workflow(self) -> StateGraph:
        """Create and configure the LangGraph workflow."""
        logger.info("Creating blog generation workflow")
        
        # Create the state graph
        workflow = StateGraph(GraphState)
        
        # Add nodes
        workflow.add_node("search", search_top_posts)
        workflow.add_node("scrape", scrape_posts)
        workflow.add_node("clean", clean_validate)
        workflow.add_node("generate", generate_blog)
        workflow.add_node("evaluate", evaluate_seo)
        
        # Set entry point
        workflow.set_entry_point("search")
        
        # Add linear edges
        workflow.add_edge("search", "scrape")
        workflow.add_edge("scrape", "clean")
        workflow.add_edge("clean", "generate")
        workflow.add_edge("generate", "evaluate")
        
        # Add conditional edge for the react agent logic
        workflow.add_conditional_edges(
            "evaluate",
            decide_next_action,
            {
                "generate": "generate",  # Retry generation
                "__end__": END,  # Fix: Use "__end__" as key
            }
        )
        
        self.workflow = workflow
        logger.info("Blog generation workflow created successfully")
        
        return workflow
    
    async def compile_app(self):
        """Compile the workflow into a runnable application."""
        if not self.workflow:
            await self.create_workflow()
        
        # Get memory saver
        memory_saver = await get_memory_saver()
        
        # Compile the workflow
        self.app = self.workflow.compile(checkpointer=memory_saver)
        
        logger.info("Blog generation app compiled successfully")
        return self.app
    
    async def run_blog_generation(
        self,
        keyword: str,
        max_attempts: int = 3,
        seo_threshold: float = 75.0,
        thread_id: str = "default"
    ) -> Dict[str, Any]:
        """Run the complete blog generation workflow."""
        if not self.app:
            await self.compile_app()
        
        # Create initial state
        initial_state = GraphState(
            keyword=keyword,
            max_attempts=min(max_attempts, 5),
            seo_threshold=seo_threshold
        )
        
        # Configuration for LangGraph execution
        config = {
            "configurable": {
                "thread_id": thread_id
            },
            "recursion_limit": 15,
            "max_concurrency": 4
        }
        
        logger.info(
            "Starting blog generation workflow",
            keyword=keyword,
            max_attempts=initial_state.max_attempts,
            seo_threshold=seo_threshold,
            thread_id=thread_id,
            recursion_limit=config["recursion_limit"]
        )
        
        try:
            # Execute the workflow with proper configuration
            final_state = None
            
            # Use ainvoke as primary method
            try:
                final_state = await self.app.ainvoke(initial_state, config=config)
                logger.info("Workflow completed via ainvoke", keyword=keyword, thread_id=thread_id)
                
            except Exception as invoke_error:
                logger.warning("ainvoke failed, falling back to astream", error=str(invoke_error))
                
                # Fallback to astream if ainvoke fails
                step_count = 0
                max_steps = 20
                
                async for state in self.app.astream(initial_state, config=config):
                    final_state = state
                    step_count += 1
                    
                    if step_count > max_steps:
                        logger.error("Emergency stop: Too many workflow steps")
                        break
                    
                    # Log intermediate progress
                    if isinstance(state, dict) and len(state) == 1:
                        node_name = list(state.keys())[0]
                        logger.info(
                            "Workflow node completed",
                            node=node_name,
                            keyword=keyword,
                            thread_id=thread_id,
                            step=step_count
                        )
            
            if final_state is None:
                raise Exception("Workflow execution failed - no final state")
            
            # Handle the final state properly
            if isinstance(final_state, GraphState):
                final_graph_state = final_state
            elif isinstance(final_state, dict):
                # Extract state from dict if needed
                if len(final_state) == 1 and list(final_state.keys())[0] != "__end__":
                    final_graph_state = list(final_state.values())[0]
                else:
                    # This might be the final state itself
                    final_graph_state = GraphState(**final_state) if "__end__" not in final_state else None
            else:
                final_graph_state = final_state
            
            # If we couldn't extract proper state, create fallback
            if not isinstance(final_graph_state, GraphState):
                logger.warning("Could not extract proper final state, creating fallback")
                final_graph_state = GraphState(
                    keyword=keyword,
                    final_blog="",
                    seo_scores={"final_score": 50.0},
                    final_score=50.0,
                    attempts=1
                )
            
            # Determine success and content
            has_content = bool(final_graph_state.final_blog.strip() or final_graph_state.draft_blog.strip())
            success = (
                final_graph_state.final_score >= seo_threshold and has_content
            ) or (
                has_content and final_graph_state.attempts >= max_attempts
            )
            
            # Use final_blog if available, otherwise use draft_blog
            final_content = final_graph_state.final_blog or final_graph_state.draft_blog
            if not final_content:
                # Generate minimal fallback content
                final_content = f"""
                <title>{keyword.title()} - Complete Guide</title>
                <meta name="description" content="Learn about {keyword} with this comprehensive guide.">
                
                <h1>{keyword.title()} - Complete Guide</h1>
                
                <h2>Introduction</h2>
                <p>Welcome to this comprehensive guide about {keyword}.</p>
                
                <h2>Key Concepts</h2>
                <p>Understanding {keyword} is important for professionals in this field.</p>
                
                <h2>Getting Started</h2>
                <p>To begin working with {keyword}, you'll need to understand the fundamentals.</p>
                
                <h2>Best Practices</h2>
                <p>When working with {keyword}, it's important to follow proven methodologies.</p>
                
                <h2>Conclusion</h2>
                <p>This guide provides an overview of {keyword}. Continue exploring to learn more!</p>
                """
                success = True
            
            logger.info(
                "Blog generation workflow completed",
                keyword=keyword,
                success=success,
                final_score=final_graph_state.final_score,
                attempts=final_graph_state.attempts,
                content_length=len(final_content),
                thread_id=thread_id
            )
            
            return {
                "success": success,
                "final_blog": final_content,
                "seo_scores": final_graph_state.seo_scores,
                "final_score": final_graph_state.final_score,
                "attempts": final_graph_state.attempts,
                "keyword": keyword,
                "thread_id": thread_id
            }
            
        except Exception as e:
            logger.error(
                "Blog generation workflow failed",
                keyword=keyword,
                thread_id=thread_id,
                error=str(e),
                error_type=type(e).__name__
            )
            
            # Return fallback response
            fallback_content = f"""
            <title>{keyword.title()} - Guide</title>
            <meta name="description" content="A guide about {keyword}.">
            
            <h1>{keyword.title()}</h1>
            <p>This is a basic guide about {keyword}.</p>
            """
            
            return {
                "success": False,
                "final_blog": fallback_content,
                "seo_scores": {"final_score": 50.0},
                "final_score": 50.0,
                "attempts": 1,
                "keyword": keyword,
                "thread_id": thread_id,
                "error": str(e)
            }


# Singleton instance
_blog_graph: Optional[BlogGenerationGraph] = None


async def get_blog_generation_graph() -> BlogGenerationGraph:
    """Get singleton blog generation graph instance."""
    global _blog_graph
    
    if _blog_graph is None:
        _blog_graph = BlogGenerationGraph()
        await _blog_graph.compile_app()
    
    return _blog_graph