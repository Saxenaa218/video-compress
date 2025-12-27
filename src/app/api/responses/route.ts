import { NextRequest, NextResponse } from 'next/server';
import { getSurveyById, createResponse, getResponsesBySurveyId } from '@/lib/store';

// GET all responses (optionally filtered by surveyId)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surveyId = searchParams.get('surveyId');
  
  if (!surveyId) {
    return NextResponse.json(
      { error: 'surveyId query parameter is required' },
      { status: 400 }
    );
  }
  
  const responses = getResponsesBySurveyId(surveyId);
  return NextResponse.json(responses);
}

// POST submit a response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.surveyId) {
      return NextResponse.json(
        { error: 'surveyId is required' },
        { status: 400 }
      );
    }
    
    // Check if survey exists
    const survey = getSurveyById(body.surveyId);
    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }
    
    if (!survey.isActive) {
      return NextResponse.json(
        { error: 'Survey is not active' },
        { status: 400 }
      );
    }
    
    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: 'answers array is required' },
        { status: 400 }
      );
    }
    
    // Validate required questions are answered
    const requiredQuestionIds = survey.questions
      .filter(q => q.required)
      .map(q => q.id);
    
    const answeredQuestionIds = body.answers.map((a: { questionId: string }) => a.questionId);
    
    const missingRequired = requiredQuestionIds.filter(id => !answeredQuestionIds.includes(id));
    if (missingRequired.length > 0) {
      return NextResponse.json(
        { error: 'Required questions not answered', missingQuestions: missingRequired },
        { status: 400 }
      );
    }
    
    const newResponse = createResponse({
      surveyId: body.surveyId,
      answers: body.answers,
      respondentEmail: body.respondentEmail
    });
    
    return NextResponse.json(newResponse, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
