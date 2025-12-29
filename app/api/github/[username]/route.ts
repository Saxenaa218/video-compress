import { NextRequest, NextResponse } from 'next/server';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    // First, check if the user exists
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Timeline-App',
      },
    });

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return NextResponse.json(
          { error: `GitHub user "${username}" not found` },
          { status: 404 }
        );
      }
      if (userResponse.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later or use a GitHub token.' },
          { status: 429 }
        );
      }
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }

    // Fetch all public repos (handle pagination)
    let allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;
    const maxPages = 10; // Safety limit to prevent excessive API calls

    while (page <= maxPages) {
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=created&direction=asc`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Timeline-App',
          },
        }
      );

      if (!reposResponse.ok) {
        if (reposResponse.status === 403) {
          return NextResponse.json(
            { error: 'GitHub API rate limit exceeded. Please try again later or use a GitHub token.' },
            { status: 429 }
          );
        }
        throw new Error(`GitHub API error: ${reposResponse.status}`);
      }

      const repos: GitHubRepo[] = await reposResponse.json();
      
      if (repos.length === 0) {
        break;
      }

      // Filter out private repos (though API should only return public for unauthenticated requests)
      const publicRepos = repos.filter(repo => !repo.private);
      allRepos = [...allRepos, ...publicRepos];

      if (repos.length < perPage) {
        break;
      }

      page++;
    }

    // Sort repos by creation date
    allRepos.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return NextResponse.json({
      username,
      repos: allRepos.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      })),
    });
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data. Please try again later.' },
      { status: 500 }
    );
  }
}
