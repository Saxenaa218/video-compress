import { NextResponse } from 'next/server';
import { Task } from '@/types';

// This would be replaced with database operations in production
let tasks: Task[] = [];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json({ task });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();
  const taskIndex = tasks.findIndex((t) => t.id === id);
  
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
  return NextResponse.json({ task: tasks[taskIndex] });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskIndex = tasks.findIndex((t) => t.id === id);
  
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  tasks = tasks.filter((t) => t.id !== id);
  return NextResponse.json({ success: true });
}
