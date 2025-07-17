/**
 * GitHub Repository Contributors API Route
 * GET /api/github/contributors
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchContributorStats } from '@/app/lib/github-api';

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800', // Cache for 15 minutes
    };

    const result = await fetchContributorStats();

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || 'Failed to fetch repository contributors',
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
    console.error('GitHub contributors API error:', error);
    
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