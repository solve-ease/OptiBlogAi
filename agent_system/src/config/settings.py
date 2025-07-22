"""Application configuration and environment variable loading."""

import os
from pathlib import Path
from dotenv import load_dotenv


def load_environment():
    """Load environment variables from .env file."""
    # Try multiple locations for .env file
    possible_paths = [
        Path(__file__).parent.parent.parent.parent.parent.parent
        / ".env",  # Project root
        Path(__file__).parent.parent.parent.parent / ".env",  # v1_cop level
        Path("../../.env"),
        Path("../.env"),
        Path(".env"),  # Current directory
    ]

    for env_path in possible_paths:
        if env_path.exists():
            load_dotenv(env_path)
            print(f"Environment loaded from: {env_path}")
            return

    print("No .env file found, using system environment variables")


# Load environment variables when module is imported
load_environment()

# Configuration constants
MAX_CONCURRENT_REQUESTS = int(os.getenv("MAX_CONCURRENT_REQUESTS", "10"))
MAX_SCRAPE_TIMEOUT = int(os.getenv("MAX_SCRAPE_TIMEOUT", "10"))
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
LANGSMITH_API_KEY = os.getenv("LANGSMITH_API_KEY")
GOOGLE_SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


# Debug print
print(f"Config loaded - google api key set: {bool(GOOGLE_API_KEY)}, ")
