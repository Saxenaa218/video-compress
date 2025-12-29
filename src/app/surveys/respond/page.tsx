'use client';

import Link from 'next/link';
import { useSurvey } from '@/context/SurveyContext';

export default function RespondSurveysPage() {
  const { getOpenSurveys, isLoading } = useSurvey();
  const openSurveys = getOpenSurveys();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Take a Survey</h1>

      {openSurveys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No open surveys available at the moment.</p>
          <p className="text-gray-400 mt-2">Please check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {openSurveys.map(survey => (
            <Link 
              key={survey.id}
              href={`/surveys/respond/${survey.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-700">
                    {survey.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">
                    {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Open
                </span>
              </div>
              <p className="text-gray-600 mt-4">Click to start the survey →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
