'use client';

import React from 'react';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  createdAt: string;
  updatedAt: string;
  language: string | null;
  stars: number;
  forks: number;
}

interface TimelineProps {
  repos: Repo[];
  username: string;
}

// Color palette for different languages
const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Scala: '#c22d40',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Dart: '#00B4AB',
  R: '#198CE7',
  default: '#6e7681',
};

function getLanguageColor(language: string | null): string {
  if (!language) return languageColors.default;
  return languageColors[language] || languageColors.default;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getYearFromDate(dateString: string): number {
  return new Date(dateString).getFullYear();
}

export default function Timeline({ repos, username }: TimelineProps) {
  // Group repos by year for the summary
  const reposByYear = repos.reduce((acc, repo) => {
    const year = getYearFromDate(repo.createdAt);
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const years = Object.keys(reposByYear).map(Number).sort((a, b) => a - b);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Summary Section */}
      <div className="mb-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          <span role="img" aria-label="chart">📊</span> Repository Summary for {username}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Total Public Repositories: <span className="font-bold text-blue-600 dark:text-blue-400">{repos.length}</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {years.map(year => (
            <div
              key={year}
              className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
            >
              <span className="font-semibold text-gray-800 dark:text-white">{year}</span>
              <span className="ml-2 text-blue-600 dark:text-blue-400">{reposByYear[year]} repos</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>

        {repos.map((repo, index) => {
          const year = getYearFromDate(repo.createdAt);
          const showYearLabel = index === 0 || getYearFromDate(repos[index - 1].createdAt) !== year;

          return (
            <div key={repo.id}>
              {/* Year label */}
              {showYearLabel && (
                <div className="flex items-center mb-6 ml-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                    {year}
                  </div>
                </div>
              )}

              {/* Repo card */}
              <div className="flex items-start mb-6 ml-3">
                {/* Timeline dot */}
                <div 
                  className="w-6 h-6 rounded-full flex-shrink-0 z-10 border-4 border-white dark:border-gray-900 shadow-md"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                ></div>

                {/* Repo content */}
                <div className="ml-6 flex-1 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {repo.name}
                    </a>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(repo.createdAt)}
                    </span>
                  </div>

                  {repo.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {repo.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center flex-wrap gap-4 text-sm">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        ></span>
                        <span className="text-gray-600 dark:text-gray-400">{repo.language}</span>
                      </span>
                    )}
                    {repo.stars > 0 && (
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <span role="img" aria-label="stars">⭐</span> {repo.stars}
                      </span>
                    )}
                    {repo.forks > 0 && (
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <span role="img" aria-label="forks">🍴</span> {repo.forks}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
