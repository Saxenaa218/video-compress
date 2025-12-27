'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { SurveyAnalytics } from '@/types/survey';

export default function SurveyResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/surveys/${resolvedParams.id}?analytics=true`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Survey not found');
          }
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <Link href="/surveys" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Surveys
          </Link>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  // Helper function to render distribution bars
  const renderDistribution = (distribution: Record<string, number>, total: number) => {
    const entries = Object.entries(distribution).sort((a, b) => {
      // Try to sort numerically if keys are numbers
      const aNum = parseFloat(a[0]);
      const bNum = parseFloat(b[0]);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return a[0].localeCompare(b[0]);
    });

    return (
      <div className="space-y-2">
        {entries.map(([label, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={label} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate" title={label}>
                {label}
              </div>
              <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-16 text-sm text-gray-600 dark:text-gray-400 text-right">
                {count} ({percentage.toFixed(0)}%)
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // NPS Category colors
  const getNPSColor = (score: number) => {
    if (score >= 9) return 'text-green-600 dark:text-green-400';
    if (score >= 7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">FeedbackFlow</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/surveys"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                All Surveys
              </Link>
              <Link
                href={`/surveys/respond/${resolvedParams.id}`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Take Survey
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {analytics.surveyTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Survey Results & Analytics</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{analytics.totalResponses}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Responses</div>
            </div>
          </div>
        </div>

        {analytics.totalResponses === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No responses yet</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Share your survey to start collecting responses.
            </p>
            <div className="mt-6">
              <Link
                href={`/surveys/respond/${resolvedParams.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Preview Survey
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {analytics.questionAnalytics.map((qa, index) => (
              <div key={qa.questionId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Q{index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {qa.questionText}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {qa.totalResponses} response{qa.totalResponses !== 1 ? 's' : ''} • {qa.questionType.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* Rating Questions */}
                {qa.questionType === 'rating' && qa.averageScore !== undefined && (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        {qa.averageScore.toFixed(1)}
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-2xl ${
                              star <= Math.round(qa.averageScore!)
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">out of 5</span>
                    </div>
                    {qa.distribution && renderDistribution(qa.distribution, qa.totalResponses)}
                  </div>
                )}

                {/* NPS Questions */}
                {qa.questionType === 'nps' && qa.averageScore !== undefined && (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`text-4xl font-bold ${getNPSColor(qa.averageScore)}`}>
                        {qa.averageScore.toFixed(1)}
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">average NPS score (0-10)</span>
                    </div>
                    {qa.distribution && (
                      <div className="mb-4 flex gap-2">
                        {Object.entries(qa.distribution)
                          .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                          .map(([score, count]) => {
                            const numScore = parseInt(score);
                            let bgColor = 'bg-red-500';
                            if (numScore >= 9) bgColor = 'bg-green-500';
                            else if (numScore >= 7) bgColor = 'bg-yellow-500';
                            
                            const height = Math.max((count / qa.totalResponses) * 100, 10);
                            return (
                              <div key={score} className="flex-1 flex flex-col items-center">
                                <div className="h-24 flex items-end">
                                  <div
                                    className={`w-full ${bgColor} rounded-t transition-all duration-500`}
                                    style={{ height: `${height}%` }}
                                  />
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{score}</div>
                                <div className="text-xs text-gray-400">{count}</div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}

                {/* Multiple Choice / Checkbox Questions */}
                {(qa.questionType === 'multiple_choice' || qa.questionType === 'checkbox') &&
                  qa.distribution && renderDistribution(qa.distribution, qa.totalResponses)}

                {/* Text Questions */}
                {(qa.questionType === 'text' || qa.questionType === 'textarea') && qa.responses && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {qa.responses.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 italic">No responses yet</p>
                    ) : (
                      qa.responses.map((response, rIndex) => (
                        <div
                          key={rIndex}
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                        >
                          {response}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
