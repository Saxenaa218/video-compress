import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { db } from '@/app/lib/db';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const users = db.getAllUsers();
  
  // Return users excluding passwords and the current user
  return NextResponse.json({
    users: users
      .filter(u => u.id !== session.userId)
      .map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
      })),
  });
}
