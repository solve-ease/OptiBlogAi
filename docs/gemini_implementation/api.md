# API Documentation

## Overview

The Gemini Blog Agent provides a REST API for generating SEO-optimized blog content using AI agents.

## Authentication

Currently, the API does not require authentication. In production, you should implement proper authentication and authorization.

## Base URL

```
http://localhost:8000
```

## Endpoints

### Health Check

Check the service health status.

**GET** `/api/v1/health`

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2025-07-19T18:32:53Z",
  "version": "0.1.0"
}
```

### Generate Blog

Generate SEO-optimized blog content for a keyword.

**POST** `/api/v1/generate-blog`

#### Request Body

```json
{
  "keyword": "string (required, 1-200 chars)",
  "max_attempts": "integer (optional, 1-10, default: 3)",
  "seo_threshold": "number (optional, 0-100, default: 75.0)"
}
```

#### Response

```json
{
  "run_id": "uuid",
  "final_blog": "string (HTML content)",
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

#### Error Responses

- **422 Validation Error**: Invalid request parameters
- **500 Internal Server Error**: Generation failed

### Metrics

Get service metrics and statistics.

**GET** `/api/v1/metrics`

#### Response

```json
{
  "service": "gemini-blog-agent",
  "version": "0.1.0",
  "uptime_seconds": 3600,
  "total_requests": 42,
  "successful_generations": 38,
  "failed_generations": 4,
  "average_generation_time": 45.2,
  "timestamp": "2025-07-19T18:32:53Z"
}
```

## Rate Limiting

The API includes built-in concurrency limits:

- Maximum concurrent scraping requests: 10
- Request timeout: 10 seconds
- Maximum generation attempts: 10

## Error Handling

All endpoints return structured error responses:

```json
{
  "detail": "Error description",
  "type": "error_type",
  "timestamp": "2025-07-19T18:32:53Z"
}
```

## Examples

### cURL Examples

```bash
# Health check
curl -X GET "http://localhost:8000/api/v1/health"

# Generate blog
curl -X POST "http://localhost:8000/api/v1/generate-blog" \
     -H "Content-Type: application/json" \
     -d '{
       "keyword": "python machine learning",
       "max_attempts": 3,
       "seo_threshold": 80
     }'

# Get metrics
curl -X GET "http://localhost:8000/api/v1/metrics"
```

### Python Examples

```python
import requests

# Generate blog
response = requests.post(
    "http://localhost:8000/api/v1/generate-blog",
    json={
        "keyword": "fastapi tutorial",
        "max_attempts": 3,
        "seo_threshold": 75
    }
)

if response.status_code == 200:
    result = response.json()
    print(f"Blog generated successfully!")
    print(f"Score: {result['seo_scores']['final_score']}")
    print(f"Attempts: {result['attempts']}")
else:
    print(f"Error: {response.json()['detail']}")
```

### JavaScript Examples

```javascript
// Generate blog
fetch("http://localhost:8000/api/v1/generate-blog", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    keyword: "react tutorial",
    max_attempts: 3,
    seo_threshold: 75,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log("Blog generated successfully!");
      console.log("Score:", data.seo_scores.final_score);
    } else {
      console.error("Generation failed");
    }
  })
  .catch((error) => console.error("Error:", error));
```
