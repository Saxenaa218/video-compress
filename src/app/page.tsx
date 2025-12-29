'use client';

import Link from 'next/link';
import { useSurvey } from '@/context/SurveyContext';

export default function Home() {
  const { currentUser, getOpenSurveys, getClosedSurveys, isLoading } = useSurvey();
  const openSurveys = getOpenSurveys();
  const closedSurveys = getClosedSurveys();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Survey App</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create, conduct, and analyze surveys with ease. Get valuable feedback from your users.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* For Coordinators */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">For Coordinators</h2>
          <p className="text-gray-600 mb-6">
            Create and manage surveys, open them for responses, and analyze results.
          </p>
          {currentUser?.role === 'coordinator' ? (
            <div className="space-y-3">
              <Link 
                href="/surveys/create"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Create New Survey
              </Link>
              <Link 
                href="/surveys/manage"
                className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition-colors"
              >
                Manage Surveys
              </Link>
            </div>
          ) : (
            <Link 
              href="/login"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Login as Coordinator
            </Link>
          )}
        </div>

        {/* For Respondents */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">For Respondents</h2>
          <p className="text-gray-600 mb-6">
            Take open surveys and help provide valuable feedback.
          </p>
          <div className="space-y-3">
            <Link 
              href="/surveys/respond"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Take a Survey ({openSurveys.length} available)
            </Link>
            <Link 
              href="/surveys/results"
              className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition-colors"
            >
              View Results ({closedSurveys.length} completed)
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{openSurveys.length}</div>
            <div className="text-gray-500">Open Surveys</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{closedSurveys.length}</div>
            <div className="text-gray-500">Completed Surveys</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {openSurveys.reduce((acc, s) => acc + s.responses.length, 0) + 
               closedSurveys.reduce((acc, s) => acc + s.responses.length, 0)}
            </div>
            <div className="text-gray-500">Total Responses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {openSurveys.reduce((acc, s) => acc + s.questions.length, 0) + 
               closedSurveys.reduce((acc, s) => acc + s.questions.length, 0)}
            </div>
            <div className="text-gray-500">Total Questions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
