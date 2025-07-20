# Technical Roadmap: Gemini-with-Search Blog Agent

FastAPI × LangGraph × Gemini Search × LangSmith

---

## 1. Executive Summary

Build a **self-optimising blog-generation agent** that lives in a FastAPI backend and is orchestrated with **LangGraph**.  
The agent uses **Gemini 2.0 Flash with Grounding / Search API** to discover the top-10 ranking blog posts for a keyword, scrapes the posts, cleans and normalises the content, fuses them into a **new SEO-optimised blog**, evaluates it with SEO metrics, and rewrites it until a configurable score ≥ 75 is achieved.  
All traces are logged to **LangSmith**.

---

## 2. Tech Stack & Versions

| Component                  | Purpose                    | Version / Constraint   |
| -------------------------- | -------------------------- | ---------------------- |
| Python                     | Runtime                    | 3.12                   |
| FastAPI                    | Async HTTP API layer       |                        |
| LangGraph                  | Orchestration framework    | (check latest)         |
| LangChain Core / Community | Utilities, prompts, memory | latest                 |
| LangSmith                  | Observability & tracing    | cloud account required |
| google-generativeai        | Gemini SDK                 | latest                 |
| google-api-python-client   | Search API client          | latest                 |
| aiohttp                    | Async HTTP scraping        |                        |
| beautifulsoup4             | HTML parsing               | latest                 |
| Pydantic v2                | Schema validation          | ≥ 2.5                  |
| uvloop                     | Fast async loop            | optional               |
| python-dotenv              | Secrets management         | latest                 |
| pytest                     | Unit & integration tests   | latest                 |
| pre-commit                 | Linting & formatting       | black, ruff, mypy      |

---

## 3. High-Level Architecture

```
┌────────────┐     ┌──────────────────────┐     ┌────────────────────┐
│  Client    │────►│ FastAPI /health      │────►│ /generate-blog POST│
└────────────┘     │  - validate input    │     └────────────────────┘
                   │  - trigger LangGraph │
                   └──────────┬───────────┘
                              │ run_id
                   ┌──────────┴───────────┐
                   │     LangGraph        │
                   │   (StateGraph)       │
                   └──────────┬───────────┘
                              │ traces
                   ┌──────────┴───────────┐
                   │     LangSmith        │
                   │   (dashboard)        │
                   └──────────────────────┘
```

---

## 4. LangGraph Workflow (StateGraph)

### 4.1 State Schema (Pydantic)

```python
class GraphState(BaseModel):
    keyword: str
    top_posts: list[dict] = []
    cleaned_posts: list[dict] = []
    draft_blog: str = ""
    seo_scores: dict = {}
    final_score: float = 0.0
    attempts: int = 0
    max_attempts: int = 3
    final_blog: str = ""
```

### 4.2 Nodes & Edges

| Node                 | Responsibility                                | Tool Calls                                    | Prompts           |
| -------------------- | --------------------------------------------- | --------------------------------------------- | ----------------- |
| **search_top_posts** | Gemini Search → top-10 URLs                   | `genai.generate_content(..., tools=[search])` | `search_prompt`   |
| **scrape_posts**     | Async fetch + BS4 parse each URL              | `aiohttp.ClientSession`                       | none              |
| **clean_validate**   | Normalise JSON schema, prune boilerplate      | none                                          | `clean_prompt`    |
| **generate_blog**    | Gemini 2.0 Flash fusion                       | `genai.generate_content`                      | `blog_gen_prompt` |
| **evaluate_seo**     | Gemini + custom rules → SEO score             | `genai.generate_content`                      | `seo_eval_prompt` |
| **react_agent**      | Decide: accept / rewrite / fail               | LangGraph conditional edge                    | `react_prompt`    |
| **memory_store**     | Persist intermediate state in `InMemorySaver` | LangGraph checkpointer                        | none              |

### 4.3 Conditional Edges

```
evaluate_seo
  ├─ final_score ≥ 75 ─► END
  ├─ attempts < max_attempts ─► generate_blog
  └─ else ─► raise HTTPException
```

---

## 5. Folder Architecture

```
gemini_with_search/
├── .env.example
├── .gitignore
├── Dockerfile
├── pyproject.toml
├── README.md
├── pre-commit-config.yaml
│
├── src/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── app.py                 # FastAPI factory
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── blog.py            # POST /generate-blog
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── graph.py               # LangGraph StateGraph definition
│   │   ├── nodes/
│   │   │   ├── __init__.py
│   │   │   ├── search_top_posts.py
│   │   │   ├── scrape_posts.py
│   │   │   ├── clean_validate.py
│   │   │   ├── generate_blog.py
│   │   │   ├── evaluate_seo.py
│   │   │   └── react_agent.py
│   │   └── prompts/
│   │       ├── __init__.py
│   │       ├── search_prompt.txt
│   │       ├── blog_gen_prompt.txt
│   │       ├── seo_eval_prompt.txt
│   │       └── react_prompt.txt
│   │
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── gemini_client.py       # singleton async client
│   │   ├── search_client.py       # wrapper for Gemini search tool
│   │   └── scraper.py             # aiohttp + BS4 utilities
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── blog.py                # Pydantic request/response
│   │   └── state.py               # GraphState
│   │
│   ├── memory/
│   │   ├── __init__.py
│   │   └── checkpointer.py        # LangGraph InMemorySaver wrapper
│   │
│   └── utils/
│       ├── __init__.py
│       └── logger.py              # structlog + LangSmith integration
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_api.py
│   ├── test_graph.py
│   └── fixtures/
│       └── sample_keyword.json
│
└── docs/
    ├── api.md
    ├── langgraph.md
    └── deployment.md
```

---

## 6. Component-by-Component Specification

### 6.1 Environment Variables (.env.example)

```
GOOGLE_API_KEY=************************
GEMINI_MODEL=gemini-1.5-pro-latest
LANGSMITH_API_KEY=************************
LANGSMITH_PROJECT="gemini-search-blog-agent"
MAX_CONCURRENT_REQUESTS=10
MAX_SCRAPE_TIMEOUT=10
MAX_ATTEMPTS=3
SEO_THRESHOLD=75
```

---

### 6.2 FastAPI Layer (`src/api/app.py`)

- **Factory pattern** (`create_app()`)
- Mounts `/generate-blog` router
- Global exception handler → returns `HTTPException(status_code=500, detail=str(exc))`
- Adds LangSmith tracing middleware
- Health check `GET /health` returns `{ "status": "ok", "timestamp": "..." }`

---

### 6.3 LangGraph Graph Construction (`src/agents/graph.py`)

```python
from langgraph.graph import StateGraph, END
from .nodes import (
    search_top_posts,
    scrape_posts,
    clean_validate,
    generate_blog,
    evaluate_seo,
    react_agent,
)
from src.schemas.state import GraphState

workflow = StateGraph(GraphState)

workflow.add_node("search", search_top_posts)
workflow.add_node("scrape", scrape_posts)
workflow.add_node("clean", clean_validate)
workflow.add_node("generate", generate_blog)
workflow.add_node("evaluate", evaluate_seo)
workflow.add_node("react", react_agent)

workflow.set_entry_point("search")
workflow.add_edge("search", "scrape")
workflow.add_edge("scrape", "clean")
workflow.add_edge("clean", "generate")
workflow.add_edge("generate", "evaluate")
workflow.add_conditional_edges("evaluate", react_agent)

memory = InMemorySaver()
app = workflow.compile(checkpointer=memory)
```

---

### 6.4 Node Specifications

#### 6.4.1 search_top_posts

- **Input**: `GraphState.keyword`
- **Output**: `GraphState.top_posts: list[dict]`  
  Each dict: `{ "url": str, "title": str, "snippet": str }`
- **Tool**: `genai.generate_content(prompt=search_prompt(keyword), tools=["google_search_retrieval"])`
- **Max results**: 10
- **Error handling**: Retry w/ exponential back-off (max 3)

#### 6.4.2 scrape_posts

- **Input**: `GraphState.top_posts`
- **Output**: `raw_html: dict[str, str]` (url → html)
- **Concurrency**: `asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)`
- **Timeout**: `aiohttp.ClientTimeout(total=MAX_SCRAPE_TIMEOUT)`
- **Headers**: Rotate user-agent strings
- **Error handling**: 404/403 → skip & log, raise `ScrapeError` only if >50 % fail

#### 6.4.3 clean_validate

- **Input**: `raw_html`
- **Output**: `cleaned_posts: list[dict]`  
  Schema:
  ```
  {
    "url": str,
    "title": str,
    "meta_description": str,
    "headings": list[str],
    "paragraphs": list[str],
    "word_count": int
  }
  ```
- **Steps**:
  1. BeautifulSoup → strip scripts, nav, footer
  2. `trafilatura` fallback if BS4 fails
  3. Pydantic validation → raise `ValidationError` if schema mismatch

#### 6.4.4 generate_blog

- **Input**: `cleaned_posts`
- **Output**: `GraphState.draft_blog: str`
- **Prompt**: `blog_gen_prompt`  
  Includes system prompt:  
  “You are an expert SEO copywriter... synthesise the 10 posts into a new 1500-word blog... maintain originality... include FAQs...”  
  Few-shot examples embedded in prompt file.

#### 6.4.5 evaluate_seo

- **Input**: `draft_blog`
- **Output**: `GraphState.seo_scores`  
  Schema:
  ```
  {
    "title_score": float,
    "meta_score": float,
    "keyword_density_score": float,
    "readability_score": float,
    "internal_linking_score": float,
    "final_score": float
  }
  ```
- **Tool**: Gemini prompt + deterministic rules (e.g., keyword density 1-2 %, Flesch > 60)

#### 6.4.6 react_agent

- **Logic**:
  ```
  if final_score >= SEO_THRESHOLD:
      state.final_blog = state.draft_blog
      return END
  if state.attempts < MAX_ATTEMPTS:
      state.attempts += 1
      return "generate"
  raise RewriteFailedException
  ```

---

### 6.5 Memory Management (`src/memory/checkpointer.py`)

- LangGraph `InMemorySaver` wrapped in singleton
- Optional Redis saver for multi-worker deployment (future)

---

### 6.6 Logging & Tracing

- `structlog` JSON logs to stdout
- LangSmith tracer auto-captures:
  - node latency
  - token counts
  - prompt/response snapshots
- Add custom tags: `{"run_type": "blog_generation", "keyword": keyword}`

---

## 7. API Contract

### Request

```json
POST /generate-blog
{
  "keyword": "how to use fastapi with langgraph",
  "max_attempts": 3,
  "seo_threshold": 75
}
```

### Response

```json
200 OK
{
  "run_id": "uuid",
  "final_blog": "<html/markdown>",
  "seo_scores": { ... },
  "attempts": 2
}
```

### Error

```json
422 ValidationError
500 InternalServerError
```

---

## 8. Development Workflow

1. **Bootstrap**
   ```
   uv venv
   uv pip install -e .
   pre-commit install
   ```
2. **Secrets**
   ```
   cp .env.example .env
   # fill keys
   ```
3. **Local dev server**
   ```
   uvicorn src.api.app:create_app --reload --factory
   ```
4. **Unit tests**
   ```
   pytest -q
   ```
5. **LangSmith playground**
   - Visit `https://smith.langchain.com/projects/gemini-search-blog-agent`

---

## 9. Deployment

- **Container**: Multi-stage Dockerfile (`python:3.11-slim`)
- **Health**: docker-compose includes `depends_on` redis if Redis saver enabled
- **CI**: GitHub Actions
  - lint & type-check
  - pytest
  - build & push image
- **CD**: ArgoCD / Helm chart (out of scope)

---

## 10. Future Enhancements (Backlog)

- Switch to **LangGraph Cloud** for persistent threads
- Add **images** generation & alt-text SEO scoring
- **Vector store** (Chroma) for semantic deduplication
- **Human-in-the-loop** approval node via FastAPI WebSocket
- **Rate-limiting** per IP via Redis

---

## 11. Links & Docs

- [LangGraph latest docs](https://langchain-ai.github.io/langgraph/)
- [Gemini 2.0 Flash ground with search](https://ai.google.dev/gemini-api/docs/grounding)
- [LangSmith tracing](https://docs.smith.langchain.com/tracing)
- [FastAPI async tests](https://fastapi.tiangolo.com/advanced/async-tests/)

---

**Handover Note**:  
This roadmap provides the _exact_ blueprint for engineering. Each file/function referenced above maps 1-to-1 to the final codebase.
