"""LangGraph memory checkpointer implementation - Latest version."""

import asyncio
from typing import Optional, Dict, Any
from langgraph.checkpoint.memory import MemorySaver
from src.utils.logger import get_logger

logger = get_logger(__name__)


class EnhancedMemorySaver(MemorySaver):
    """Enhanced memory saver with additional logging and error handling."""

    def __init__(self):
        """Initialize enhanced memory saver."""
        super().__init__()
        self._lock = asyncio.Lock()
        logger.info("Enhanced memory saver initialized")

    # async def aput(self, config: Dict[str, Any], checkpoint: Dict[str, Any], metadata: Dict[str, Any] = None) -> None:
    # """Async put with enhanced logging."""
    # async with self._lock:
    #     try:
    #         thread_id = config.get("configurable", {}).get("thread_id", "unknown")
    #         logger.debug(
    #             "Saving checkpoint",
    #             thread_id=thread_id,
    #             checkpoint_keys=list(checkpoint.keys()) if checkpoint else []
    #         )
    #         # Call parent method with metadata parameter
    #         await super().aput(config, checkpoint, metadata or {})
    #     except Exception as e:
    #         logger.error("Failed to save checkpoint", error=str(e))
    #         raise

    async def aput(
        self,
        config: Dict[str, Any],
        checkpoint: Dict[str, Any],
        new_versions: Optional[Any] = None,
    ) -> None:
        """Async put with enhanced logging."""
        async with self._lock:
            try:
                # Assuming args[0] is config and args[1] is checkpoint
                # config = args[0] if len(args) > 0 else kwargs.get("config", {})
                # checkpoint = args[1] if len(args) > 1 else kwargs.get("checkpoint", {})
                thread_id = config.get("configurable", {}).get("thread_id", "unknown")

                logger.debug(
                    "Saving checkpoint",
                    thread_id=thread_id,
                    checkpoint_keys=list(checkpoint.keys()) if checkpoint else [],
                )
                # Forward all args/kwargs (including metadata) to super()
                await super().aput(config, checkpoint, new_versions)
            except Exception as e:
                logger.error("Failed to save checkpoint", error=str(e))
                raise

    async def aget(self, config: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Async get with enhanced logging."""
        try:
            thread_id = config.get("configurable", {}).get("thread_id", "unknown")
            checkpoint = await super().aget(config)

            if checkpoint:
                logger.debug("Retrieved checkpoint", thread_id=thread_id)
            else:
                logger.debug("No checkpoint found", thread_id=thread_id)

            return checkpoint

        except Exception as e:
            logger.error("Failed to retrieve checkpoint", error=str(e))
            return None


# Singleton instance
_memory_saver: Optional[EnhancedMemorySaver] = None
_memory_lock = asyncio.Lock()


async def get_memory_saver() -> EnhancedMemorySaver:
    """Get singleton memory saver instance."""
    global _memory_saver

    if _memory_saver is None:
        async with _memory_lock:
            if _memory_saver is None:
                _memory_saver = EnhancedMemorySaver()

    return _memory_saver
