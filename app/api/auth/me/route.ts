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

  const user = db.getUserById(session.userId);
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}
