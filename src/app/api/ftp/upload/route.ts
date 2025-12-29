import { NextRequest, NextResponse } from 'next/server';
import { createFTPClient } from '@/lib/ftp-client';
import { FTPConfig, FTPResponse } from '@/types/ftp';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  let client = null;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const configStr = formData.get('config') as string;
    const remotePath = formData.get('path') as string || '/';
    
    if (!file) {
      return NextResponse.json<FTPResponse>({
        success: false,
        error: 'No file provided',
      }, { status: 400 });
    }

    if (!configStr) {
      return NextResponse.json<FTPResponse>({
        success: false,
        error: 'No FTP configuration provided',
      }, { status: 400 });
    }

    const config: FTPConfig = JSON.parse(configStr);
    
    if (!config.host || !config.user || !config.password) {
      return NextResponse.json<FTPResponse>({
        success: false,
        error: 'Missing required fields: host, user, password',
      }, { status: 400 });
    }

    client = await createFTPClient({
      host: config.host,
      port: config.port || 21,
      user: config.user,
      password: config.password,
      secure: config.secure || false,
    });

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const readableStream = Readable.from(buffer);

    const remoteFilePath = remotePath.endsWith('/') 
      ? `${remotePath}${file.name}` 
      : `${remotePath}/${file.name}`;

    await client.uploadFrom(readableStream, remoteFilePath);

    return NextResponse.json<FTPResponse<{ message: string; path: string }>>({
      success: true,
      data: { 
        message: `File ${file.name} uploaded successfully`,
        path: remoteFilePath,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json<FTPResponse>({
      success: false,
      error: message,
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
