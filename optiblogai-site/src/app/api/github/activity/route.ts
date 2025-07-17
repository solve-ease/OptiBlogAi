/**
 * GitHub Repository Activity API Route
 * GET /api/github/activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchActivityStats } from '@/app/lib/github-api';

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200', // Cache for 10 minutes
    };

    const result = await fetchActivityStats();

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || 'Failed to fetch repository activity',
          success: false 
        },
        { 
          status: 500,
          headers 
        }
      );
    }

    return NextResponse.json(
      {
        data: result.data,
        success: true,
        rateLimit: result.rateLimit,
        lastFetched: new Date().toISOString(),
      },
      { 
        status: 200,
        headers 
      }
    );
  } catch (error) {
    console.error('GitHub activity API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}