'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Survey } from '@/types/survey';

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys');
        if (!response.ok) throw new Error('Failed to fetch surveys');
        const data = await response.json();
        setSurveys(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey?')) return;
    
    try {
      const response = await fetch(`/api/surveys/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete survey');
      setSurveys(surveys.filter(s => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete survey');
    }
  };

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
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

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
            <Link
              href="/surveys/create"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Survey
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">All Surveys</h1>
        
        {surveys.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No surveys</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new survey.</p>
            <div className="mt-6">
              <Link
                href="/surveys/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Survey
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {survey.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {survey.description || 'No description'}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        survey.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {survey.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{survey.questions.length} questions</span>
                    <span>•</span>
                    <span>{survey.responseCount} responses</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex gap-2">
                  <Link
                    href={`/surveys/respond/${survey.id}`}
                    className="flex-1 text-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Take Survey
                  </Link>
                  <Link
                    href={`/surveys/results/${survey.id}`}
                    className="flex-1 text-center px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Results
                  </Link>
                  <button
                    onClick={() => handleDelete(survey.id)}
                    className="px-3 py-2 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
