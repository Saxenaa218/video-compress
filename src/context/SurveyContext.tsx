'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Survey, SurveyResponse, User } from '@/types/survey';

interface SurveyContextType {
  surveys: Survey[];
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createSurvey: (survey: Omit<Survey, 'id' | 'createdAt' | 'responses' | 'status'>) => Survey;
  updateSurveyStatus: (surveyId: string, status: 'open' | 'closed') => void;
  submitResponse: (surveyId: string, answers: Record<string, string>) => boolean;
  getSurveyById: (surveyId: string) => Survey | undefined;
  getOpenSurveys: () => Survey[];
  getClosedSurveys: () => Survey[];
  getDraftSurveys: () => Survey[];
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

// Pre-defined coordinator credentials
const COORDINATOR_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const STORAGE_KEY = 'survey_app_data';

interface StoredData {
  surveys: Survey[];
  currentUser: User | null;
}

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitializedRef = useRef(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        try {
          const parsed: StoredData = JSON.parse(storedData);
          setSurveys(parsed.surveys || []);
          setCurrentUser(parsed.currentUser || null);
        } catch {
          console.error('Failed to parse stored data');
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      const data: StoredData = { surveys, currentUser };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [surveys, currentUser, isLoading]);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === COORDINATOR_CREDENTIALS.username && password === COORDINATOR_CREDENTIALS.password) {
      const user: User = {
        id: 'coordinator-1',
        username: 'admin',
        role: 'coordinator'
      };
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createSurvey = (surveyData: Omit<Survey, 'id' | 'createdAt' | 'responses' | 'status'>): Survey => {
    const newSurvey: Survey = {
      ...surveyData,
      id: `survey-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      responses: []
    };
    setSurveys(prev => [...prev, newSurvey]);
    return newSurvey;
  };

  const updateSurveyStatus = (surveyId: string, status: 'open' | 'closed') => {
    setSurveys(prev => 
      prev.map(survey => 
        survey.id === surveyId ? { ...survey, status } : survey
      )
    );
  };

  const submitResponse = (surveyId: string, answers: Record<string, string>): boolean => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey || survey.status !== 'open') return false;

    const response: SurveyResponse = {
      id: `response-${Date.now()}`,
      surveyId,
      answers,
      submittedAt: new Date().toISOString()
    };

    setSurveys(prev =>
      prev.map(s =>
        s.id === surveyId ? { ...s, responses: [...s.responses, response] } : s
      )
    );
    return true;
  };

  const getSurveyById = (surveyId: string) => surveys.find(s => s.id === surveyId);
  const getOpenSurveys = () => surveys.filter(s => s.status === 'open');
  const getClosedSurveys = () => surveys.filter(s => s.status === 'closed');
  const getDraftSurveys = () => surveys.filter(s => s.status === 'draft');

  return (
    <SurveyContext.Provider value={{
      surveys,
      currentUser,
      isLoading,
      login,
      logout,
      createSurvey,
      updateSurveyStatus,
      submitResponse,
      getSurveyById,
      getOpenSurveys,
      getClosedSurveys,
      getDraftSurveys
    }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
