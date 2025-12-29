import { NextRequest, NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';

const COMPRESSED_DIR = path.join(process.cwd(), 'compressed');

async function compressVideo(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-vcodec', 'libx264',
      '-crf', '28',
      '-preset', 'medium',
      '-acodec', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-y',
      outputPath
    ]);

    ffmpeg.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on('error', (error) => {
      reject(error);
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    // Ensure compressed directory exists
    if (!existsSync(COMPRESSED_DIR)) {
      await mkdir(COMPRESSED_DIR, { recursive: true });
    }

    const { videoId } = await request.json();

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

    if (video.status === 'processing') {
      return NextResponse.json(
        { error: 'Video is already being processed' },
        { status: 400 }
      );
    }

    // Update status to processing
    video.status = 'processing';
    await video.save();

    // Generate output path
    const outputFilename = `compressed_${path.basename(video.originalPath)}`;
    const outputPath = path.join(COMPRESSED_DIR, outputFilename);

    try {
      // Compress video using FFmpeg
      await compressVideo(video.originalPath, outputPath);

      // Get compressed file size
      const { stat } = await import('fs/promises');
      const stats = await stat(outputPath);
      const compressedSize = stats.size;
      const compressionRatio = ((video.originalSize - compressedSize) / video.originalSize * 100).toFixed(2);

      // Update video record
      video.compressedPath = outputPath;
      video.compressedSize = compressedSize;
      video.compressionRatio = parseFloat(compressionRatio);
      video.status = 'completed';
      await video.save();

      return NextResponse.json({
        success: true,
        video: {
          id: video._id,
          originalName: video.originalName,
          originalSize: video.originalSize,
          compressedSize: video.compressedSize,
          compressionRatio: video.compressionRatio,
          status: video.status,
        },
      });
    } catch (compressionError) {
      video.status = 'failed';
      await video.save();
      throw compressionError;
    }
  } catch (error) {
    console.error('Compression error:', error);
    return NextResponse.json(
      { error: 'Failed to compress video' },
      { status: 500 }
    );
  }
}
