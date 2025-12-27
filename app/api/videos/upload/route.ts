import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { db } from '@/app/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Allowed MIME types and their corresponding extensions
const ALLOWED_TYPES: Record<string, string[]> = {
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogg', '.ogv'],
  'video/quicktime': ['.mov'],
};

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    const title = formData.get('title') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'No title provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB' },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: mp4, webm, ogg, mov' },
        { status: 400 }
      );
    }

    // Validate file extension matches MIME type
    const fileExt = path.extname(file.name).toLowerCase();
    const allowedExtensions = ALLOWED_TYPES[file.type];
    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { error: 'File extension does not match file type' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename with validated extension
    const filename = `${uuidv4()}${fileExt}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // Create video record
    const embedId = uuidv4();
    const video = db.createVideo({
      id: uuidv4(),
      userId: session.userId,
      title,
      filename,
      embedId,
      createdAt: new Date(),
    });

    return NextResponse.json({
      video: {
        id: video.id,
        title: video.title,
        embedId: video.embedId,
        embedUrl: `/embed/${video.embedId}`,
        createdAt: video.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}
