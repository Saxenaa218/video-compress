import { NextRequest, NextResponse } from 'next/server';
import { getSurveys, createSurvey } from '@/lib/store';
import { Question } from '@/types/survey';
import { v4 as uuidv4 } from 'uuid';

// GET all surveys
export async function GET() {
  const surveys = getSurveys();
  return NextResponse.json(surveys);
}

// POST create a new survey
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    if (!body.questions || !Array.isArray(body.questions) || body.questions.length === 0) {
      return NextResponse.json(
        { error: 'At least one question is required' },
        { status: 400 }
      );
    }
    
    // Add IDs to questions if not present
    const questionsWithIds: Question[] = body.questions.map((q: Omit<Question, 'id'>) => ({
      ...q,
      id: uuidv4()
    }));
    
    const newSurvey = createSurvey({
      title: body.title,
      description: body.description || '',
      questions: questionsWithIds,
      isActive: body.isActive !== false
    });
    
    return NextResponse.json(newSurvey, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
