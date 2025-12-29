export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  questions: Question[];
}

export interface QuizData {
  quizzes: Quiz[];
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface QuizResult {
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: UserAnswer[];
}
