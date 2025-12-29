'use client';

import Link from 'next/link';
import { useSurvey } from '@/context/SurveyContext';

export default function ResultsPage() {
  const { getClosedSurveys, isLoading } = useSurvey();
  const closedSurveys = getClosedSurveys();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Survey Results</h1>

      {closedSurveys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No completed surveys available yet.</p>
          <p className="text-gray-400 mt-2">Results will appear here when surveys are closed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {closedSurveys.map(survey => (
            <Link 
              key={survey.id}
              href={`/surveys/results/${survey.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-700">
                    {survey.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">
                    {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''} • 
                    {survey.responses.length} response{survey.responses.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Closed
                </span>
              </div>
              <p className="text-gray-600 mt-4">Click to view results →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
