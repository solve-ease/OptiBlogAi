# Gemini Blog Agent

FastAPI × LangGraph × Gemini Search × LangSmith Blog Generation Service

A self-optimizing blog generation agent that creates SEO-optimized content using AI agents orchestrated with LangGraph.

## 🚀 Features

- **AI-Powered Content Generation**: Uses Google Gemini 2.0 Flash with search grounding
- **Intelligent Workflow**: LangGraph orchestration with iterative optimization
- **SEO Optimization**: Automated SEO scoring and content improvement
- **Async Performance**: Built with FastAPI and asyncio for high performance
- **Observability**: Full tracing with LangSmith integration
- **Production Ready**: Comprehensive testing, logging, and error handling

## 🏗️ Architecture

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

## 🛠️ Tech Stack

- **Python 3.12**: Modern Python with latest features
- **FastAPI**: Async web framework for APIs
- **LangGraph**: Agent workflow orchestration
- **LangChain**: AI application framework
- **LangSmith**: Observability and tracing
- **Google Gemini**: AI model with search grounding
- **Pydantic v2**: Data validation and serialization
- **Structlog**: Structured logging
- **Pytest**: Testing framework

## 📦 Installation

### Prerequisites

- Python 3.12+
- Google API key with Gemini access
- LangSmith account (optional but recommended)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd agent_system
   ```

2. **Create virtual environment**

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   pip install -e .
   ```

4. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. **Install pre-commit hooks**
   ```bash
   pre-commit install
   ```

## 🔧 Configuration

Create a `.env` file with the following variables:

```env
GOOGLE_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-2.5-flash
LANGSMITH_API_KEY=your_langsmith_api_key_here
LANGSMITH_PROJECT=gemini-search-blog-agent
MAX_CONCURRENT_REQUESTS=10
MAX_SCRAPE_TIMEOUT=10
MAX_ATTEMPTS=3
SEO_THRESHOLD=75
```

## 🚀 Usage

### Start the Development Server

```bash
uvicorn src.api.app:create_app --reload --factory
```

The API will be available at `http://localhost:8000`

### API Documentation

- **Interactive docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Generate Blog Content

```bash
curl -X POST "http://localhost:8000/api/v1/generate-blog" \
     -H "Content-Type: application/json" \
     -d '{
       "keyword": "fastapi tutorial",
       "max_attempts": 3,
       "seo_threshold": 75
     }'
```

### Example Response

```json
{
  "run_id": "123e4567-e89b-12d3-a456-426614174000",
  "final_blog": "<html content>",
  "seo_scores": {
    "title_score": 85,
    "meta_description_score": 80,
    "keyword_optimization_score": 90,
    "content_structure_score": 88,
    "readability_score": 82,
    "content_quality_score": 87,
    "technical_seo_score": 85,
    "final_score": 85.0
  },
  "attempts": 2,
  "success": true
}
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/test_api.py

# Run with verbose output
pytest -v
```

### Test Categories

- **Unit Tests**: Individual component testing
- **Integration Tests**: End-to-end workflow testing
- **API Tests**: FastAPI endpoint testing

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:8000/api/v1/health
```

### Metrics

```bash
curl http://localhost:8000/api/v1/metrics
```

### LangSmith Dashboard

Visit your LangSmith project dashboard to view:

- Workflow execution traces
- Performance metrics
- Error analysis
- Token usage

## 🔍 Development

### Code Quality

```bash
# Format code
black src/ tests/

# Lint code
ruff check src/ tests/

# Type checking
mypy src/

# Run all pre-commit hooks
pre-commit run --all-files
```

### Project Structure

```
src/
├── api/              # FastAPI application
├── agents/           # LangGraph nodes and workflow
├── tools/            # External service integrations
├── schemas/          # Pydantic models
├── memory/           # LangGraph checkpointers
└── utils/            # Utilities and helpers

tests/
├── test_api.py       # API endpoint tests
├── test_graph.py     # LangGraph workflow tests
└── conftest.py       # Test configuration
```

## 🐳 Deployment

### Docker

```bash
# Build image
docker build -t gemini-blog-agent .

# Run container
docker run -p 8000:8000 --env-file .env gemini-blog-agent
```

### Production Considerations

- Configure proper CORS settings
- Set up reverse proxy (nginx)
- Use production ASGI server (gunicorn + uvicorn)
- Set up monitoring and alerting
- Configure log aggregation
- Implement rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 style guidelines
- Write comprehensive tests
- Add type hints
- Update documentation
- Use conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**4darsh-Dev**

- GitHub: [@4darsh-Dev](https://github.com/4darsh-Dev)

## 🙏 Acknowledgments

- Google for Gemini AI capabilities
- LangChain team for the fantastic framework
- FastAPI for the excellent web framework
- All contributors and maintainers

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](docs/)
2. Search [existing issues](issues)
3. Create a [new issue](issues/new)

---

**Built with ❤️ by 4darsh-Dev**
