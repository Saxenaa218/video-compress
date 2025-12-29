'use client';

import Link from 'next/link';
import { useSurvey } from '@/context/SurveyContext';

export default function Header() {
  const { currentUser, logout, isLoading } = useSurvey();

  if (isLoading) {
    return (
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold">Survey App</Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">Survey App</Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
            {currentUser?.role === 'coordinator' && (
              <>
                <Link href="/surveys/create" className="hover:text-blue-200 transition-colors">Create Survey</Link>
                <Link href="/surveys/manage" className="hover:text-blue-200 transition-colors">Manage Surveys</Link>
              </>
            )}
            <Link href="/surveys/respond" className="hover:text-blue-200 transition-colors">Take Survey</Link>
            <Link href="/surveys/results" className="hover:text-blue-200 transition-colors">View Results</Link>
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
                  {currentUser.username} ({currentUser.role})
                </span>
                <button 
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors"
              >
                Coordinator Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
