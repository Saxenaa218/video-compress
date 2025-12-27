import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">FeedbackFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/surveys"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                All Surveys
              </Link>
              <Link
                href="/surveys/create"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Survey
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            <span className="block">Customer Feedback &</span>
            <span className="block text-indigo-600">Survey Tools</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-8">
            Create beautiful surveys, collect valuable feedback, and gain actionable insights. 
            The modern platform for understanding your customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/surveys/create"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Create Your First Survey
            </Link>
            <Link
              href="/surveys"
              className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border border-indigo-200 dark:border-gray-600"
            >
              View Sample Surveys
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create Surveys</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Build professional surveys with multiple question types including ratings, NPS, multiple choice, and open-ended questions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Collect Responses</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share surveys easily and collect responses in real-time. Track completion rates and monitor incoming feedback.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analyze Results</h3>
            <p className="text-gray-600 dark:text-gray-300">
              View detailed analytics, charts, and insights from your survey data. Make data-driven decisions with confidence.
            </p>
          </div>
        </div>

        {/* Question Types Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Powerful Question Types
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Rating Scale', icon: '⭐', desc: 'Star ratings from 1-5' },
              { name: 'NPS Score', icon: '📊', desc: 'Net Promoter Score 0-10' },
              { name: 'Multiple Choice', icon: '🔘', desc: 'Single selection options' },
              { name: 'Checkboxes', icon: '☑️', desc: 'Multiple selections' },
              { name: 'Short Text', icon: '📝', desc: 'Brief text answers' },
              { name: 'Long Text', icon: '📄', desc: 'Detailed responses' },
            ].map((type) => (
              <div
                key={type.name}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-100 dark:border-gray-700 flex items-center gap-4"
              >
                <span className="text-3xl">{type.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{type.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 FeedbackFlow - Customer Feedback & Survey Tools</p>
            <p className="mt-2 text-sm">Built with Next.js and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

