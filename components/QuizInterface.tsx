'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question } from '@/types/quiz';
import { formatTime } from '@/lib/quiz-utils';

interface QuizInterfaceProps {
  quizId: number;
  quizTitle: string;
  questions: Question[];
  timeLimit: number;
}

export default function QuizInterface({ quizId, quizTitle, questions, timeLimit }: QuizInterfaceProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, number>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || timeRemaining <= 0) {
      if (timeRemaining <= 0) {
        handleSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, timeRemaining]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = new Map(userAnswers);
    newAnswers.set(currentQuestion.id, answerIndex);
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsTimerRunning(false);
    
    // Calculate results
    let correctCount = 0;
    const answers = questions.map(question => {
      const userAnswer = userAnswers.get(question.id);
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: question.id,
        selectedAnswer: userAnswer ?? -1,
        isCorrect,
      };
    });

    // Store results in sessionStorage
    const results = {
      quizId,
      quizTitle,
      score: correctCount,
      totalQuestions: questions.length,
      timeSpent: timeLimit - timeRemaining,
      answers,
      questions,
    };
    
    sessionStorage.setItem('quizResults', JSON.stringify(results));
    router.push(`/results`);
  };

  const selectedAnswer = userAnswers.get(currentQuestion.id);
  const isAnswered = selectedAnswer !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {quizTitle}
            </h1>
            <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-indigo-600'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {currentQuestion.question}
          </h2>

          {/* Answer options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'border-gray-200 hover:border-indigo-300 dark:border-gray-700 dark:hover:border-indigo-700'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="px-6 py-3 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Question navigation dots */}
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          {questions.map((q, index) => {
            const isAnsweredQ = userAnswers.has(q.id);
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-full font-semibold transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                    : isAnsweredQ
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
