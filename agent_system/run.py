"""Development runner script for the Gemini Blog Agent."""

import asyncio
import uvloop
import uvicorn
import os
# import sys
# from pathlib import Path

# # Add src to Python path
# sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.utils.logger import configure_logging, get_logger

# Configure logging
configure_logging()
logger = get_logger(__name__)


def main():
    """Main entry point for development server."""
    # Set uvloop as event loop policy for better performance (Unix only)
    if os.name != 'nt':
        asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
    
    # Configuration
    host = os.getenv("HOST", "localhost")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    workers = int(os.getenv("WORKERS", "1"))
    
    logger.info(
        "Starting Gemini Blog Agent development server",
        host=host,
        port=port,
        reload=reload,
        workers=workers
    )
    
    # Run the server
    uvicorn.run(
        "src.api.app:create_app",
        host=host,
        port=port,
        reload=reload,
        workers=workers if not reload else 1,  # Reload mode requires 1 worker
        factory=True,
        log_level="info",
        access_log=True
    )


if __name__ == "__main__":
    main()