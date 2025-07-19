/**
 * GitHub Repository Discussions API Route
 * GET /api/github/discussions
 *
 * Note: GitHub Discussions API requires GraphQL and authentication.
 * As a fallback, this implementation uses GitHub Issues with "discussion" label
 * to simulate discussions functionality for public repositories.
 */

import { NextRequest, NextResponse } from "next/server";
import { Discussion } from "@/types/github";

// GitHub GraphQL endpoint for discussions
const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const REPO_OWNER = "solve-ease";
const REPO_NAME = "OptiBlogAi";

// GraphQL query to fetch discussions
const DISCUSSIONS_QUERY = `
  query($owner: String!, $name: String!, $first: Int!) {
    repository(owner: $owner, name: $name) {
      discussions(first: $first, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          id
          title
          body
          url
          createdAt
          updatedAt
          comments {
            totalCount
          }
          reactions {
            totalCount
          }
          reactionGroups {
            content
            users {
              totalCount
            }
          }
          author {
            login
            avatarUrl
            url
          }
          category {
            name
            emoji
          }
          answerChosenAt
          upvoteCount
        }
      }
    }
  }
`;

// Fallback data when GitHub API is unavailable
const FALLBACK_DISCUSSIONS: Discussion[] = [
  {
    id: "fallback-1",
    title: "How to optimize content for voice search using OptiBlogAi?",
    body: "I'm working on optimizing my blog content for voice search. What are the best practices when using OptiBlogAi for this specific use case?",
    author: {
      login: "community-user",
      avatar_url:
        "https://images.unsplash.com/photo-1494790108755-2616b612c75a?w=150&h=150&fit=crop&crop=face",
      html_url: "https://github.com/community-user",
    },
    category: {
      name: "Q&A",
      emoji: "❓",
    },
    createdAt: "2024-07-15T10:30:00Z",
    updatedAt: "2024-07-15T14:22:00Z",
    comments: 8,
    reactions: {
      total: 12,
      heart: 4,
      thumbsUp: 6,
      rocket: 2,
    },
    url: "https://github.com/solve-ease/OptiBlogAi/discussions",
    tags: ["voice-search", "seo", "optimization"],
    answered: true,
    featured: true,
  },
  {
    id: "fallback-2",
    title: "Feature Request: Multi-language content generation",
    body: "It would be amazing if OptiBlogAi could generate content in multiple languages. This would help with international SEO strategies.",
    author: {
      login: "feature-requester",
      avatar_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      html_url: "https://github.com/feature-requester",
    },
    category: {
      name: "Ideas",
      emoji: "💡",
    },
    createdAt: "2024-07-14T16:45:00Z",
    updatedAt: "2024-07-15T09:15:00Z",
    comments: 15,
    reactions: {
      total: 28,
      heart: 8,
      thumbsUp: 15,
      rocket: 5,
    },
    url: "https://github.com/solve-ease/OptiBlogAi/discussions",
    tags: ["feature-request", "multilingual", "i18n"],
    answered: false,
    featured: true,
  },
  {
    id: "fallback-3",
    title: "Sharing my OptiBlogAi workflow for e-commerce blogs",
    body: "After using OptiBlogAi for 3 months on my e-commerce blog, I've developed a workflow that increased my organic traffic by 150%.",
    author: {
      login: "success-story",
      avatar_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      html_url: "https://github.com/success-story",
    },
    category: {
      name: "Show and tell",
      emoji: "🎉",
    },
    createdAt: "2024-07-13T12:00:00Z",
    updatedAt: "2024-07-14T18:30:00Z",
    comments: 22,
    reactions: {
      total: 45,
      heart: 18,
      thumbsUp: 20,
      rocket: 7,
    },
    url: "https://github.com/solve-ease/OptiBlogAi/discussions",
    tags: ["success-story", "workflow", "e-commerce", "seo"],
    answered: false,
    featured: true,
  },
];

async function fetchDiscussionsFromGitHub(): Promise<Discussion[]> {
  try {
    // Note: GitHub Discussions API requires GraphQL API or specific endpoints
    // The REST API endpoint for discussions doesn't exist for public repos
    // We'll attempt to use GitHub Issues as a proxy for discussions
    // or use the GraphQL API if available (requires authentication)

    // First, try the GraphQL approach (if we had authentication)
    // For now, we'll use a fallback approach with issues that are tagged as discussions
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=discussion&state=all&sort=updated&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "OptiBlogAi-Website/1.0.0",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const issues = await response.json();

    // Transform GitHub issues to discussions format
    return issues.map((issue: any) => ({
      id: issue.id.toString(),
      title: issue.title,
      body: issue.body || "",
      author: {
        login: issue.user?.login || "unknown",
        avatar_url: issue.user?.avatar_url || "",
        html_url: issue.user?.html_url || "",
      },
      category: {
        name: determineCategory(issue.labels),
        emoji: getCategoryEmoji(issue.labels),
      },
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      comments: issue.comments || 0,
      reactions: {
        total: issue.reactions?.total_count || 0,
        heart: issue.reactions?.heart || 0,
        thumbsUp: issue.reactions?.["+1"] || 0,
        rocket: issue.reactions?.rocket || 0,
      },
      url: issue.html_url,
      tags: extractTags(issue.labels),
      answered: issue.state === "closed",
      featured:
        issue.labels?.some((label: any) => label.name === "featured") || false,
    }));
  } catch (error) {
    console.error("Failed to fetch discussions from GitHub:", error);
    throw error;
  }
}

// Helper function to determine category from labels
function determineCategory(labels: any[]): string {
  if (!labels) return "General";

  for (const label of labels) {
    const name = label.name?.toLowerCase();
    if (name === "question" || name === "q&a") return "Q&A";
    if (name === "enhancement" || name === "feature" || name === "idea")
      return "Ideas";
    if (name === "showcase" || name === "show-and-tell") return "Show and tell";
  }
  return "General";
}

// Helper function to get category emoji
function getCategoryEmoji(labels: any[]): string {
  if (!labels) return "💬";

  for (const label of labels) {
    const name = label.name?.toLowerCase();
    if (name === "question" || name === "q&a") return "❓";
    if (name === "enhancement" || name === "feature" || name === "idea")
      return "💡";
    if (name === "showcase" || name === "show-and-tell") return "🎉";
  }
  return "💬";
}

// Helper function to extract tags from labels
function extractTags(labels: any[]): string[] {
  if (!labels) return [];

  return labels
    .filter(
      (label: any) =>
        ![
          "discussion",
          "question",
          "enhancement",
          "feature",
          "showcase",
          "featured",
        ].includes(label.name?.toLowerCase()),
    )
    .map((label: any) => label.name)
    .slice(0, 5); // Limit to 5 tags
}

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800", // Cache for 15 minutes
    };

    let discussions: Discussion[];

    try {
      discussions = await fetchDiscussionsFromGitHub();
    } catch (error) {
      console.warn(
        "GitHub Discussions API failed, using fallback data:",
        error,
      );
      discussions = FALLBACK_DISCUSSIONS;
    }

    return NextResponse.json(
      {
        data: discussions,
        success: true,
        lastFetched: new Date().toISOString(),
        source: discussions === FALLBACK_DISCUSSIONS ? "fallback" : "github",
      },
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error("GitHub discussions API error:", error);

    return NextResponse.json(
      {
        data: FALLBACK_DISCUSSIONS,
        success: true,
        lastFetched: new Date().toISOString(),
        source: "fallback",
        error: "Using fallback data due to API error",
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
