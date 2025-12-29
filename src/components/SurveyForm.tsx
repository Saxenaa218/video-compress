'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSurvey } from '@/context/SurveyContext';
import { SurveyQuestion } from '@/types/survey';

interface QuestionFormData {
  text: string;
  options: { text: string }[];
}

export default function SurveyForm() {
  const router = useRouter();
  const { createSurvey } = useSurvey();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionFormData[]>([
    { text: '', options: [{ text: '' }, { text: '' }] }
  ]);
  const [error, setError] = useState('');

  const addQuestion = () => {
    if (questions.length >= 10) {
      setError('Maximum 10 questions allowed');
      return;
    }
    setQuestions([...questions, { text: '', options: [{ text: '' }, { text: '' }] }]);
    setError('');
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      setError('At least 1 question is required');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
    setError('');
  };

  const updateQuestion = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    if (questions[questionIndex].options.length >= 5) {
      setError('Maximum 5 options per question');
      return;
    }
    const updated = [...questions];
    updated[questionIndex].options.push({ text: '' });
    setQuestions(updated);
    setError('');
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    if (questions[questionIndex].options.length <= 1) {
      setError('At least 1 option is required per question');
      return;
    }
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(updated);
    setError('');
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex].text = text;
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Survey title is required');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].text.trim()) {
          setError(`Question ${i + 1}, Option ${j + 1} text is required`);
          return;
        }
      }
    }

    // Convert to proper format
    const surveyQuestions: SurveyQuestion[] = questions.map((q, qIndex) => ({
      id: `q-${qIndex}`,
      text: q.text,
      options: q.options.map((o, oIndex) => ({
        id: `q-${qIndex}-o-${oIndex}`,
        text: o.text
      }))
    }));

    createSurvey({
      title,
      questions: surveyQuestions
    });

    router.push('/surveys/manage');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Survey</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="mb-8">
        <label className="block text-lg font-semibold mb-2">Survey Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter survey title..."
        />
      </div>

      <div className="space-y-8">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <label className="block text-lg font-semibold">Question {qIndex + 1}</label>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Question
                </button>
              )}
            </div>
            
            <input
              type="text"
              value={question.text}
              onChange={(e) => updateQuestion(qIndex, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter question text..."
            />

            <div className="space-y-3">
              <label className="block font-medium text-gray-700">Options (1-5 mutually exclusive selections)</label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-3">
                  <span className="text-gray-500 w-6">{oIndex + 1}.</span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Option ${oIndex + 1}`}
                  />
                  {question.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {question.options.length < 5 && (
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  + Add Option
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {questions.length < 10 && (
        <button
          type="button"
          onClick={addQuestion}
          className="mt-6 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg transition-colors"
        >
          + Add Question
        </button>
      )}

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
          Save Survey
        </button>
      </div>
    </form>
  );
}
