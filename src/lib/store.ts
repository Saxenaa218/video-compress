// In-memory store for surveys and responses
// In a production app, this would be replaced with a database

import { Survey, SurveyResponse } from '@/types/survey';
import { v4 as uuidv4 } from 'uuid';

// In-memory stores
let surveys: Survey[] = [];
let responses: SurveyResponse[] = [];

// Initialize with sample data
const initSampleData = () => {
  if (surveys.length === 0) {
    surveys = [
      {
        id: 'sample-survey-1',
        title: 'Customer Satisfaction Survey',
        description: 'Help us improve our products and services by sharing your feedback.',
        questions: [
          {
            id: 'q1',
            type: 'rating',
            text: 'How satisfied are you with our product overall?',
            required: true,
            min: 1,
            max: 5
          },
          {
            id: 'q2',
            type: 'nps',
            text: 'How likely are you to recommend us to a friend or colleague?',
            required: true,
            min: 0,
            max: 10
          },
          {
            id: 'q3',
            type: 'multiple_choice',
            text: 'How did you hear about us?',
            required: true,
            options: ['Search Engine', 'Social Media', 'Friend/Colleague', 'Advertisement', 'Other']
          },
          {
            id: 'q4',
            type: 'checkbox',
            text: 'Which features do you use most often?',
            required: false,
            options: ['Dashboard', 'Reports', 'Analytics', 'Integrations', 'API']
          },
          {
            id: 'q5',
            type: 'textarea',
            text: 'What improvements would you like to see?',
            required: false
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        responseCount: 0
      },
      {
        id: 'sample-survey-2',
        title: 'Website Feedback Form',
        description: 'Share your thoughts about our website experience.',
        questions: [
          {
            id: 'q1',
            type: 'rating',
            text: 'How easy was it to navigate our website?',
            required: true,
            min: 1,
            max: 5
          },
          {
            id: 'q2',
            type: 'multiple_choice',
            text: 'What was the primary purpose of your visit today?',
            required: true,
            options: ['Learn about products', 'Make a purchase', 'Get support', 'Find contact information', 'Other']
          },
          {
            id: 'q3',
            type: 'text',
            text: 'Did you find what you were looking for?',
            required: true
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        responseCount: 0
      }
    ];
  }
};

// Initialize sample data
initSampleData();

// Survey operations
export const getSurveys = (): Survey[] => {
  return surveys;
};

export const getSurveyById = (id: string): Survey | undefined => {
  return surveys.find(s => s.id === id);
};

export const createSurvey = (surveyData: Omit<Survey, 'id' | 'createdAt' | 'updatedAt' | 'responseCount'>): Survey => {
  const newSurvey: Survey = {
    ...surveyData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    responseCount: 0
  };
  surveys.push(newSurvey);
  return newSurvey;
};

export const updateSurvey = (id: string, updates: Partial<Survey>): Survey | null => {
  const index = surveys.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  surveys[index] = {
    ...surveys[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return surveys[index];
};

export const deleteSurvey = (id: string): boolean => {
  const index = surveys.findIndex(s => s.id === id);
  if (index === -1) return false;
  
  surveys.splice(index, 1);
  // Also delete associated responses
  responses = responses.filter(r => r.surveyId !== id);
  return true;
};

// Response operations
export const getResponsesBySurveyId = (surveyId: string): SurveyResponse[] => {
  return responses.filter(r => r.surveyId === surveyId);
};

export const createResponse = (responseData: Omit<SurveyResponse, 'id' | 'submittedAt'>): SurveyResponse => {
  const newResponse: SurveyResponse = {
    ...responseData,
    id: uuidv4(),
    submittedAt: new Date().toISOString()
  };
  responses.push(newResponse);
  
  // Update response count on survey
  const surveyIndex = surveys.findIndex(s => s.id === responseData.surveyId);
  if (surveyIndex !== -1) {
    surveys[surveyIndex].responseCount += 1;
  }
  
  return newResponse;
};

export const getResponseById = (id: string): SurveyResponse | undefined => {
  return responses.find(r => r.id === id);
};
