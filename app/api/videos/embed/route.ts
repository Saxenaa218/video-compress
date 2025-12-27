import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const embedId = searchParams.get('embedId');

  if (!embedId) {
    return NextResponse.json(
      { error: 'Embed ID is required' },
      { status: 400 }
    );
  }

  const video = db.getVideoByEmbedId(embedId);
  
  if (!video) {
    return NextResponse.json(
      { error: 'Video not found' },
      { status: 404 }
    );
  }

  // Get the uploader info
  const user = db.getUserById(video.userId);

  return NextResponse.json({
    video: {
      id: video.id,
      title: video.title,
      videoUrl: `/uploads/${video.filename}`,
      uploaderName: user?.name || 'Unknown',
      createdAt: video.createdAt,
    },
  });
}
