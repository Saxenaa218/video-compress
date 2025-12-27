import { NextRequest, NextResponse } from 'next/server';
import { getSurveyById, updateSurvey, deleteSurvey, getResponsesBySurveyId } from '@/lib/store';
import { QuestionAnalytics, SurveyAnalytics } from '@/types/survey';

type RouteParams = Promise<{ id: string }>;

// GET a specific survey
export async function GET(
  request: NextRequest,
  context: { params: RouteParams }
) {
  const { id } = await context.params;
  const survey = getSurveyById(id);
  
  if (!survey) {
    return NextResponse.json(
      { error: 'Survey not found' },
      { status: 404 }
    );
  }
  
  // Check if analytics are requested
  const searchParams = request.nextUrl.searchParams;
  if (searchParams.get('analytics') === 'true') {
    const responses = getResponsesBySurveyId(id);
    
    const questionAnalytics: QuestionAnalytics[] = survey.questions.map(question => {
      const questionResponses = responses
        .map(r => r.answers.find(a => a.questionId === question.id)?.value)
        .filter(v => v !== undefined);
      
      const analytics: QuestionAnalytics = {
        questionId: question.id,
        questionText: question.text,
        questionType: question.type,
        totalResponses: questionResponses.length
      };
      
      if (question.type === 'rating' || question.type === 'nps') {
        const numericResponses = questionResponses
          .map(v => Number(v))
          .filter(v => !isNaN(v));
        
        if (numericResponses.length > 0) {
          analytics.averageScore = numericResponses.reduce((a, b) => a + b, 0) / numericResponses.length;
          analytics.distribution = {};
          numericResponses.forEach(v => {
            const key = v.toString();
            analytics.distribution![key] = (analytics.distribution![key] || 0) + 1;
          });
        }
      } else if (question.type === 'multiple_choice') {
        analytics.distribution = {};
        questionResponses.forEach(v => {
          const key = String(v);
          analytics.distribution![key] = (analytics.distribution![key] || 0) + 1;
        });
      } else if (question.type === 'checkbox') {
        analytics.distribution = {};
        questionResponses.forEach(v => {
          const values = Array.isArray(v) ? v : [v];
          values.forEach(val => {
            analytics.distribution![String(val)] = (analytics.distribution![String(val)] || 0) + 1;
          });
        });
      } else if (question.type === 'text' || question.type === 'textarea') {
        analytics.responses = questionResponses.map(v => String(v));
      }
      
      return analytics;
    });
    
    const surveyAnalytics: SurveyAnalytics = {
      surveyId: survey.id,
      surveyTitle: survey.title,
      totalResponses: responses.length,
      completionRate: responses.length > 0 ? 100 : 0, // Simplified for now
      questionAnalytics
    };
    
    return NextResponse.json(surveyAnalytics);
  }
  
  return NextResponse.json(survey);
}

// PUT update a survey
export async function PUT(
  request: NextRequest,
  context: { params: RouteParams }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const updatedSurvey = updateSurvey(id, body);
    
    if (!updatedSurvey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedSurvey);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE a survey
export async function DELETE(
  _request: NextRequest,
  context: { params: RouteParams }
) {
  const { id } = await context.params;
  const deleted = deleteSurvey(id);
  
  if (!deleted) {
    return NextResponse.json(
      { error: 'Survey not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ message: 'Survey deleted successfully' });
}
