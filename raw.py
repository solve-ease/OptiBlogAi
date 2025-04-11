import os

# Define the folder structure as a list of paths
structure = [
    ".github/workflows/ci-cd.yml",

    "src/scraper/init.py",
    "src/scraper/google_search.py",
    "src/scraper/webpage_crawler.py",
    "src/scraper/content_extractor.py",

    "src/content_processor/init.py",
    "src/content_processor/text_analyzer.py",
    "src/content_processor/seo_tools.py",

    "src/llm_generator/init.py",
    "src/llm_generator/prompt_engineer.py",
    "src/llm_generator/model_handler.py",
    "src/llm_generator/post_generator.py",

    "src/api/init.py",
    "src/api/schemas.py",
    "src/api/endpoints.py",

    "src/config/init.py",
    "src/config/settings.py",
    "src/config/constants.py",

    "src/main.py",

    "tests/unit/test_scraper.py",
    "tests/unit/test_llm.py",
    "tests/unit/test_seo.py",

    "tests/integration/test_workflow.py",

    "docs/architecture.md",
    "docs/setup-guide.md",
    "docs/ethical-guidelines.md",

    "assets/examples/.gitkeep",
    "assets/outputs/.gitkeep",

    "scripts/setup_env.sh",
    "scripts/deploy.sh",

    ".env.example",
    "requirements.txt",
    "Dockerfile",
    "docker-compose.yml",
    "pyproject.toml",
    "README.md",
    ".gitignore"
]

# Create each directory and file
for path in structure:
    dir_path = os.path.dirname(path)
    if dir_path and not os.path.exists(dir_path):
        os.makedirs(dir_path)
    # Create empty file (if it doesn't already exist)
    with open(path, "w") as f:
        pass

print("📁 Project structure created successfully!")
