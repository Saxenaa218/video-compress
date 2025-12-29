export interface SurveyOption {
  id: string;
  text: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  options: SurveyOption[];
}

export interface Survey {
  id: string;
  title: string;
  questions: SurveyQuestion[];
  status: 'draft' | 'open' | 'closed';
  createdAt: string;
  responses: SurveyResponse[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, string>; // questionId -> optionId
  submittedAt: string;
}

export interface User {
  id: string;
  username: string;
  role: 'coordinator' | 'respondent';
}
