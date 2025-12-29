'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSurvey } from '@/context/SurveyContext';
import { Survey } from '@/types/survey';

interface SurveyResponseFormProps {
  survey: Survey;
}

export default function SurveyResponseForm({ survey }: SurveyResponseFormProps) {
  const router = useRouter();
  const { submitResponse } = useSurvey();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all questions are answered
    const unansweredQuestions = survey.questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions. ${unansweredQuestions.length} question(s) unanswered.`);
      return;
    }

    const success = submitResponse(survey.id, answers);
    if (success) {
      setSubmitted(true);
    } else {
      setError('Failed to submit response. The survey may have been closed.');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="text-lg mb-6">Your response has been submitted successfully.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
      <p className="text-gray-500 mb-8">Please answer all questions below</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {survey.questions.map((question, qIndex) => (
          <div key={question.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">
              {qIndex + 1}. {question.text}
              {!answers[question.id] && (
                <span className="text-red-500 ml-2">*</span>
              )}
            </h3>
            
            <div className="space-y-3">
              {question.options.map((option) => (
                <label 
                  key={option.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    answers[question.id] === option.id 
                      ? 'bg-blue-100 border-blue-500' 
                      : 'bg-white border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleOptionSelect(question.id, option.id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
        >
          Submit Response
        </button>
      </div>
    </form>
  );
}
