/**
 * GitHub Repository Events API Route
 * GET /api/github/events
 * 
 * Fetches events from GitHub issues with 'event' label
 */

import { NextRequest, NextResponse } from 'next/server';

const REPO_OWNER = 'solve-ease';
const REPO_NAME = 'OptiBlogAi';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "hackathon" | "workshop" | "meetup" | "webinar" | "conference";
  location: "virtual" | "hybrid" | string;
  attendees: number;
  maxAttendees?: number;
  organizer: string;
  registrationUrl?: string;
  tags: string[];
  featured: boolean;
}

// Fallback events data
const FALLBACK_EVENTS: Event[] = [
  {
    id: "ai-hackathon-2024",
    title: "AI Content Optimization Hackathon",
    description: "48-hour hackathon focused on building innovative features for OptiBlogAi. Win amazing prizes and get your contributions merged!",
    date: "2024-08-15",
    time: "09:00",
    type: "hackathon",
    location: "virtual",
    attendees: 234,
    maxAttendees: 500,
    organizer: "OptiBlogAi Team",
    registrationUrl: "https://github.com/solve-ease/OptiBlogAi/discussions",
    tags: ["AI", "Hackathon", "Prizes", "48h"],
    featured: true
  },
  {
    id: "contributing-workshop",
    title: "Open Source Contributing Workshop",
    description: "Learn how to contribute to OptiBlogAi and other open source projects. Perfect for beginners!",
    date: "2024-07-28",
    time: "14:00",
    type: "workshop",
    location: "virtual",
    attendees: 89,
    maxAttendees: 100,
    organizer: "OptiBlogAi Community",
    registrationUrl: "https://github.com/solve-ease/OptiBlogAi/discussions",
    tags: ["Workshop", "Beginners", "Git", "GitHub"],
    featured: true
  },
  {
    id: "seo-optimization-webinar",
    title: "Advanced SEO Optimization Techniques",
    description: "Deep dive into SEO optimization strategies using AI and machine learning techniques.",
    date: "2024-08-05",
    time: "16:00",
    type: "webinar",
    location: "virtual",
    attendees: 156,
    maxAttendees: 200,
    organizer: "SEO Expert Panel",
    registrationUrl: "https://github.com/solve-ease/OptiBlogAi/discussions",
    tags: ["SEO", "AI", "Marketing", "Content"],
    featured: false
  },
  {
    id: "community-meetup",
    title: "Monthly Community Meetup",
    description: "Connect with other contributors, share ideas, and discuss the future of OptiBlogAi.",
    date: "2024-08-10",
    time: "18:00",
    type: "meetup",
    location: "virtual",
    attendees: 67,
    organizer: "Community Team",
    registrationUrl: "https://github.com/solve-ease/OptiBlogAi/discussions",
    tags: ["Community", "Networking", "Discussion"],
    featured: false
  }
];

function parseEventFromIssue(issue: any): Event | null {
  try {
    // Check if issue has event label
    const hasEventLabel = issue.labels.some((label: any) => 
      label.name.toLowerCase().includes('event') || 
      label.name.toLowerCase().includes('hackathon') ||
      label.name.toLowerCase().includes('workshop') ||
      label.name.toLowerCase().includes('meetup') ||
      label.name.toLowerCase().includes('webinar') ||
      label.name.toLowerCase().includes('conference')
    );

    if (!hasEventLabel) {
      return null;
    }

    // Extract event type from labels
    let eventType: Event['type'] = 'meetup';
    const typeLabels = issue.labels.map((label: any) => label.name.toLowerCase());
    
    if (typeLabels.some((label: string) => label.includes('hackathon'))) {
      eventType = 'hackathon';
    } else if (typeLabels.some((label: string) => label.includes('workshop'))) {
      eventType = 'workshop';
    } else if (typeLabels.some((label: string) => label.includes('webinar'))) {
      eventType = 'webinar';
    } else if (typeLabels.some((label: string) => label.includes('conference'))) {
      eventType = 'conference';
    }

    // Parse event details from issue body
    const body = issue.body || '';
    
    // Try to extract date and time from body (simple regex)
    const dateMatch = body.match(/date[:\s]*(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i);
    const timeMatch = body.match(/time[:\s]*(\d{1,2}:\d{2})/i);
    const locationMatch = body.match(/location[:\s]*([^\n\r]+)/i);
    const registrationMatch = body.match(/registration[:\s]*([https?:\/\/][^\s\n\r]+)/i);
    
    // Extract attendee count from comments or reactions
    const attendees = issue.comments + (issue.reactions?.total_count || 0);
    
    // Determine if featured (pinned issues or high reaction count)
    const featured = issue.reactions?.total_count > 10 || !!issue.milestone;

    // Extract tags from labels
    const tags = issue.labels
      .map((label: any) => label.name)
      .filter((name: string) => !name.toLowerCase().includes('event'));

    const event: Event = {
      id: issue.id.toString(),
      title: issue.title,
      description: body.slice(0, 200) + (body.length > 200 ? '...' : ''),
      date: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
      time: timeMatch ? timeMatch[1] : '12:00',
      type: eventType,
      location: locationMatch ? locationMatch[1].trim() : 'virtual',
      attendees: Math.max(attendees, 0),
      maxAttendees: undefined,
      organizer: issue.user?.login || 'Community',
      registrationUrl: registrationMatch ? registrationMatch[1] : issue.html_url,
      tags,
      featured
    };

    return event;
  } catch (error) {
    console.error('Error parsing event from issue:', error);
    return null;
  }
}

async function fetchEventsFromGitHub(): Promise<Event[]> {
  try {
    // Fetch issues with event-related labels
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=event,hackathon,workshop,meetup,webinar,conference&state=all&per_page=20`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'OptiBlogAi-Website/1.0.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const issues = await response.json();
    
    // Filter and transform issues to events
    const events = issues
      .map(parseEventFromIssue)
      .filter((event: Event | null): event is Event => event !== null)
      .sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return events;
  } catch (error) {
    console.error('Failed to fetch events from GitHub:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // Cache for 30 minutes
    };

    let events: Event[];
    
    try {
      events = await fetchEventsFromGitHub();
      
      // If no events found from GitHub, use fallback data
      if (events.length === 0) {
        console.log('No events found from GitHub issues, using fallback data');
        events = FALLBACK_EVENTS;
      }
    } catch (error) {
      console.warn('GitHub Events API failed, using fallback data:', error);
      events = FALLBACK_EVENTS;
    }

    return NextResponse.json(
      {
        data: events,
        success: true,
        lastFetched: new Date().toISOString(),
        source: events === FALLBACK_EVENTS ? 'fallback' : 'github',
      },
      { 
        status: 200,
        headers 
      }
    );
  } catch (error) {
    console.error('GitHub events API error:', error);
    
    return NextResponse.json(
      { 
        data: FALLBACK_EVENTS,
        success: true,
        lastFetched: new Date().toISOString(),
        source: 'fallback',
        error: 'Using fallback data due to API error',
      },
      { 
        status: 200,
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