'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Question, UserAnswer } from '@/types/quiz';
import { formatTime } from '@/lib/quiz-utils';

interface QuizResults {
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: UserAnswer[];
  questions: Question[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [results] = useState<QuizResults | null>(() => {
    if (typeof window !== 'undefined') {
      const storedResults = sessionStorage.getItem('quizResults');
      if (storedResults) {
        return JSON.parse(storedResults);
      }
    }
    return null;
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!results) {
      router.push('/');
    }
  }, [results, router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading results...</div>
      </div>
    );
  }

  const percentage = Math.round((results.score / results.totalQuestions) * 100);
  const passed = percentage >= 60;

  const shareOnTwitter = () => {
    const text = `I just scored ${results.score}/${results.totalQuestions} (${percentage}%) on "${results.quizTitle}"! 🎯`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Results Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 text-center">
          <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
          }`}>
            {passed ? (
              <svg className="w-16 h-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-16 h-16 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Completed!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {results.quizTitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {percentage}%
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">Score</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {results.score}/{results.totalQuestions}
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">Correct Answers</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">Time Spent</div>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Your Results
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-2 px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </button>
              <button
                onClick={shareOnFacebook}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
            </div>
          </div>
        </div>

        {/* Review Answers Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-left"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Review Answers
            </h2>
            <svg
              className={`w-6 h-6 text-gray-600 dark:text-gray-300 transition-transform ${
                showDetails ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDetails && (
            <div className="mt-6 space-y-6">
              {results.questions.map((question, index) => {
                const userAnswer = results.answers.find(a => a.questionId === question.id);
                const isCorrect = userAnswer?.isCorrect ?? false;
                const selectedAnswerIndex = userAnswer?.selectedAnswer ?? -1;

                return (
                  <div key={question.id} className="border-t border-gray-200 dark:border-gray-700 pt-6 first:border-t-0 first:pt-0">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                      }`}>
                        {isCorrect ? (
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Question {index + 1}: {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => {
                            const isUserAnswer = selectedAnswerIndex === optionIndex;
                            const isCorrectAnswer = question.correctAnswer === optionIndex;

                            return (
                              <div
                                key={optionIndex}
                                className={`p-3 rounded-lg border-2 ${
                                  isCorrectAnswer
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                    : isUserAnswer
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-900 dark:text-white">{option}</span>
                                  {isCorrectAnswer && (
                                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                                      Correct Answer
                                    </span>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                                      Your Answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Explanation: </span>
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            Take Another Quiz
          </Link>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
}
