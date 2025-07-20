# src/tools/gemini_client.py

import os
import asyncio
from dataclasses import dataclass, fields
from typing import Any, Optional
from google import genai
from google.genai import types
from src.config import settings
from src.utils.logger import get_logger

logger = get_logger(__name__)

@dataclass
class GeminiConfig:
    api_key: str
    model_name: str = "gemini-2.5-flash"
    temperature: float = 0.7
    max_output_tokens: int = 8192

class GeminiClient:
    """Singleton async Gemini client using google-genai."""
    _instance: Optional["GeminiClient"] = None

    def __init__(self, config: GeminiConfig):
        if not config.api_key:
            raise ValueError("API key is required for Gemini client.")
        self.client = genai.Client(api_key=config.api_key)
        self.model_name = config.model_name
        self.base_config = types.GenerateContentConfig(
            temperature=config.temperature,
            max_output_tokens=config.max_output_tokens
        )
        # Precompute allowed config fields for filtering
        self._config_fields = {f.name for f in fields(self.base_config)}
        logger.info("GeminiClient initialized", model=self.model_name)

    @classmethod
    async def get_instance(cls) -> "GeminiClient":
        if cls._instance is None:
            api_key = os.getenv("GOOGLE_API_KEY") or settings.GOOGLE_API_KEY
            if not api_key:
                raise ValueError("GOOGLE_API_KEY environment variable is required")
            config = GeminiConfig(
                api_key=api_key,
                model_name=settings.GEMINI_MODEL
            )
            cls._instance = cls(config)
        return cls._instance

    async def generate_content(
        self,
        prompt: str,
        use_search: bool = False,     # kept for compatibility, but ignored
        **overrides: Any
    ) -> str:
        """
        Generate text using the Gemini model asynchronously.
        
        Args:
          prompt: the text prompt
          use_search: flag (ignored at this level; you can implement grounding upstream)
          **overrides: any GenerateContentConfig fields you wish to override
        """
        try:
            # Filter overrides to only valid config fields
            valid_overrides = {
                k: v for k, v in overrides.items() if k in self._config_fields
            }
            if valid_overrides:
                gen_config = _dataclass_replace(self.base_config, **valid_overrides)
            else:
                gen_config = self.base_config

            # Perform the async call
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=gen_config
            )

            text = response.text or ""
            if not text:
                raise ValueError("Empty response from Gemini API")

            logger.info(
                "Generated content",
                prompt_len=len(prompt),
                response_len=len(text)
            )
            return text

        except Exception as e:
            logger.error("Gemini generation failed", error=str(e))
            raise

def _dataclass_replace(dc_obj: Any, **kwargs: Any) -> Any:
    """Helper to copy and override dataclass fields."""
    data = {**dc_obj.__dict__, **kwargs}
    return type(dc_obj)(**data)

async def get_gemini_client() -> GeminiClient:
    """Factory for async GeminiClient instance."""
    return await GeminiClient.get_instance()
