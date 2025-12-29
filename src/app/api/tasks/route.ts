import { NextResponse } from 'next/server';
import { Task } from '@/types';

// In-memory storage for server-side (for demo purposes)
// In production, this would be connected to a database
const tasks: Task[] = [];

export async function GET() {
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const task: Task = await request.json();
  tasks.push(task);
  return NextResponse.json({ task }, { status: 201 });
}
