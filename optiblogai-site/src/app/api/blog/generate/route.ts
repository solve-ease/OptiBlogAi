import { NextRequest, NextResponse } from 'next/server';
import { BlogGenerationRequest, BlogGenerationResponse } from '../../../../types/blog';

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000';
const API_KEY = process.env.FASTAPI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body: BlogGenerationRequest = await request.json();

    // Validate required fields
    if (!body.keyword || body.keyword.trim().length === 0) {
      return NextResponse.json(
        { error: 'Keyword is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Set default values
    const requestPayload: BlogGenerationRequest = {
      keyword: body.keyword.trim(),
      max_attempts: body.max_attempts || 3,
      seo_threshold: body.seo_threshold || 75,
      customization: {
        tone: body.customization?.tone || 'professional',
        target_audience: body.customization?.target_audience || 'general',
        content_type: body.customization?.content_type || 'guide',
        word_count_target: body.customization?.word_count_target || 1500,
        include_faq: body.customization?.include_faq !== false,
        include_conclusion: body.customization?.include_conclusion !== false,
        include_table_of_contents: body.customization?.include_table_of_contents !== false,
        focus_keywords: body.customization?.focus_keywords || [],
        exclude_domains: body.customization?.exclude_domains || []
      },
      priority: body.priority || 'normal',
      callback_url: body.callback_url,
      user_id: body.user_id || 'demo-user'
    };

    // Prepare headers for FastAPI request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    // Make request to FastAPI backend
    const response = await fetch(`${FASTAPI_BASE_URL}/api/v1/generate-blog`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('FastAPI Error:', response.status, errorData);
      
      return NextResponse.json(
        { 
          error: 'Failed to generate blog content',
          details: response.statusText,
          status_code: response.status
        },
        { status: response.status }
      );
    }

    const data: BlogGenerationResponse = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Blog generation error:', error);
    
    // Handle different types of errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Unable to connect to AI service. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error occurred while generating blog content' },
      { status: 500 }
    );
  }
}