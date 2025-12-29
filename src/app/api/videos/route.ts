import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      videos: videos.map((video) => ({
        id: video._id,
        originalName: video.originalName,
        originalSize: video.originalSize,
        compressedSize: video.compressedSize,
        compressionRatio: video.compressionRatio,
        status: video.status,
        createdAt: video.createdAt,
      })),
    });
  } catch (error) {
    console.error('Fetch videos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');

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

    // Delete files
    const { unlink } = await import('fs/promises');
    const { existsSync } = await import('fs');

    if (video.originalPath && existsSync(video.originalPath)) {
      await unlink(video.originalPath);
    }

    if (video.compressedPath && existsSync(video.compressedPath)) {
      await unlink(video.compressedPath);
    }

    // Delete database record
    await Video.findByIdAndDelete(videoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
