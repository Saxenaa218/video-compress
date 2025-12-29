import { NextRequest, NextResponse } from 'next/server';
import { existsSync, statSync } from 'fs';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');
    const type = searchParams.get('type') || 'compressed';

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const video = await Video.findById(videoId);

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const filePath = type === 'original' ? video.originalPath : video.compressedPath;

    if (!filePath || !existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const stat = statSync(filePath);
    const filename = type === 'original' 
      ? video.originalName 
      : `compressed_${video.originalName}`;

    // Read file and return as response
    const { readFile } = await import('fs/promises');
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': stat.size.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download video' },
      { status: 500 }
    );
  }
}
