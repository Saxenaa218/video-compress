import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { db } from '@/app/lib/db';
import { unlink } from 'fs/promises';
import path from 'path';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const videos = db.getVideosByUserId(session.userId);
  
  return NextResponse.json({
    videos: videos.map(v => ({
      id: v.id,
      title: v.title,
      embedId: v.embedId,
      embedUrl: `/embed/${v.embedId}`,
      createdAt: v.createdAt,
    })),
  });
}

export async function DELETE(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('id');

  if (!videoId) {
    return NextResponse.json(
      { error: 'Video ID is required' },
      { status: 400 }
    );
  }

  const video = db.getVideoById(videoId);
  
  if (!video) {
    return NextResponse.json(
      { error: 'Video not found' },
      { status: 404 }
    );
  }

  if (video.userId !== session.userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  }

  // Delete the file
  try {
    const filepath = path.join(process.cwd(), 'public', 'uploads', video.filename);
    await unlink(filepath);
  } catch (err) {
    console.error('Failed to delete video file:', err);
  }

  db.deleteVideo(videoId);

  return NextResponse.json({ success: true });
}
