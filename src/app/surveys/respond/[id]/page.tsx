'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Survey, Answer } from '@/types/survey';

export default function RespondToSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer['value']>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/surveys/${resolvedParams.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Survey not found');
          }
          throw new Error('Failed to fetch survey');
        }
        const data = await response.json();
        setSurvey(data);
        
        // Initialize answers
        const initialAnswers: Record<string, Answer['value']> = {};
        data.questions.forEach((q: { id: string; type: string }) => {
          if (q.type === 'checkbox') {
            initialAnswers[q.id] = [];
          } else if (q.type === 'rating') {
            initialAnswers[q.id] = 0;
          } else if (q.type === 'nps') {
            initialAnswers[q.id] = -1;
          } else {
            initialAnswers[q.id] = '';
          }
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [resolvedParams.id]);

  const updateAnswer = (questionId: string, value: Answer['value']) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const toggleCheckbox = (questionId: string, option: string) => {
    const current = (answers[questionId] as string[]) || [];
    if (current.includes(option)) {
      updateAnswer(questionId, current.filter(o => o !== option));
    } else {
      updateAnswer(questionId, [...current, option]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!survey) return;

    // Validate required questions
    for (const question of survey.questions) {
      if (question.required) {
        const answer = answers[question.id];
        if (
          answer === undefined ||
          answer === '' ||
          (Array.isArray(answer) && answer.length === 0) ||
          (question.type === 'rating' && answer === 0) ||
          (question.type === 'nps' && answer === -1)
        ) {
          setError(`Please answer the required question: "${question.text}"`);
          return;
        }
      }
    }

    setError(null);
    setSubmitting(true);

    try {
      const formattedAnswers: Answer[] = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value
      }));

      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: survey.id,
          answers: formattedAnswers,
          respondentEmail: email || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit response');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !survey) {
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your response has been submitted successfully. We appreciate your feedback!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/surveys"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View More Surveys
            </Link>
            <Link
              href="/"
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!survey) return null;

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
              href="/surveys"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              All Surveys
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Survey Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{survey.title}</h1>
          {survey.description && (
            <p className="text-gray-600 dark:text-gray-300">{survey.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Questions */}
          {survey.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-2 mb-4">
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {question.text}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                </div>
              </div>

              {/* Text Input */}
              {question.type === 'text' && (
                <input
                  type="text"
                  value={answers[question.id] as string}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your answer..."
                />
              )}

              {/* Textarea */}
              {question.type === 'textarea' && (
                <textarea
                  value={answers[question.id] as string}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your answer..."
                />
              )}

              {/* Rating */}
              {question.type === 'rating' && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => updateAnswer(question.id, rating)}
                      className={`w-12 h-12 rounded-lg text-2xl transition-colors ${
                        (answers[question.id] as number) >= rating
                          ? 'bg-yellow-400 text-yellow-900'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              )}

              {/* NPS */}
              {question.type === 'nps' && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => updateAnswer(question.id, score)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          answers[question.id] === score
                            ? score <= 6
                              ? 'bg-red-500 text-white'
                              : score <= 8
                              ? 'bg-yellow-500 text-white'
                              : 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Not at all likely</span>
                    <span>Extremely likely</span>
                  </div>
                </div>
              )}

              {/* Multiple Choice */}
              {question.type === 'multiple_choice' && (
                <div className="space-y-2">
                  {question.options?.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        answers[question.id] === option
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={answers[question.id] === option}
                        onChange={() => updateAnswer(question.id, option)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Checkbox */}
              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {question.options?.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        (answers[question.id] as string[])?.includes(option)
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={(answers[question.id] as string[])?.includes(option)}
                        onChange={() => toggleCheckbox(question.id, option)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                      />
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Optional Email */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="your@email.com"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Leave your email if you&apos;d like us to follow up with you.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Response'}
          </button>
        </form>
      </main>
    </div>
  );
}
