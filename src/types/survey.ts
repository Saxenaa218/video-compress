// Survey and Question Types for the Customer Feedback & Survey Platform

export type QuestionType = 
  | 'text'
  | 'textarea'
  | 'rating'
  | 'multiple_choice'
  | 'checkbox'
  | 'nps';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: string[]; // For multiple choice and checkbox questions
  min?: number; // For rating questions
  max?: number; // For rating questions
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  responseCount: number;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Answer[];
  submittedAt: string;
  respondentEmail?: string;
}

export interface CreateSurveyRequest {
  title: string;
  description: string;
  questions: Omit<Question, 'id'>[];
}

export interface SubmitResponseRequest {
  surveyId: string;
  answers: Answer[];
  respondentEmail?: string;
}

// Analytics types
export interface QuestionAnalytics {
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  totalResponses: number;
  // For rating/NPS questions
  averageScore?: number;
  distribution?: Record<string, number>;
  // For text questions
  responses?: string[];
}

export interface SurveyAnalytics {
  surveyId: string;
  surveyTitle: string;
  totalResponses: number;
  completionRate: number;
  questionAnalytics: QuestionAnalytics[];
}
