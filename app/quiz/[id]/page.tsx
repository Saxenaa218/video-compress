import { notFound } from 'next/navigation';
import { getQuizById, prepareQuizQuestions } from '@/lib/quiz-utils';
import QuizInterface from '@/components/QuizInterface';

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quizId = parseInt(id);
  
  if (isNaN(quizId)) {
    notFound();
  }

  const quiz = getQuizById(quizId);
  
  if (!quiz) {
    notFound();
  }

  const preparedQuestions = prepareQuizQuestions(quiz, true);

  return (
    <QuizInterface
      quizId={quiz.id}
      quizTitle={quiz.title}
      questions={preparedQuestions}
      timeLimit={quiz.timeLimit}
    />
  );
}
