import { Question, Quiz } from '@/types/quiz';
import quizData from '@/data/quiz.json';

export function getAllQuizzes(): Quiz[] {
  return quizData.quizzes;
}

export function getQuizById(id: number): Quiz | undefined {
  return quizData.quizzes.find(quiz => quiz.id === id);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function randomizeQuestions(questions: Question[]): Question[] {
  return shuffleArray(questions);
}

export function shuffleQuestionOptions(question: Question): Question {
  const optionsWithIndex = question.options.map((option, index) => ({
    option,
    originalIndex: index,
  }));
  
  const shuffled = shuffleArray(optionsWithIndex);
  
  const newOptions = shuffled.map(item => item.option);
  const newCorrectAnswer = shuffled.findIndex(
    item => item.originalIndex === question.correctAnswer
  );
  
  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectAnswer,
  };
}

export function prepareQuizQuestions(quiz: Quiz, shouldRandomize: boolean = true): Question[] {
  let questions = shouldRandomize ? randomizeQuestions(quiz.questions) : [...quiz.questions];
  questions = questions.map(q => shuffleQuestionOptions(q));
  return questions;
}

export function calculateScore(questions: Question[], userAnswers: Map<number, number>): number {
  let correct = 0;
  questions.forEach(question => {
    const userAnswer = userAnswers.get(question.id);
    if (userAnswer === question.correctAnswer) {
      correct++;
    }
  });
  return correct;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
