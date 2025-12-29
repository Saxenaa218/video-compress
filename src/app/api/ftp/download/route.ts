import { NextRequest, NextResponse } from 'next/server';
import { createFTPClient } from '@/lib/ftp-client';
import { FTPConfig, FTPResponse } from '@/types/ftp';
import { Writable } from 'stream';

export async function POST(request: NextRequest) {
  let client = null;
  
  try {
    const body = await request.json();
    const { config, path }: { config: FTPConfig; path: string } = body;
    
    if (!config.host || !config.user || !config.password) {
      return NextResponse.json<FTPResponse>({
        success: false,
        error: 'Missing required fields: host, user, password',
      }, { status: 400 });
    }

    if (!path) {
      return NextResponse.json<FTPResponse>({
        success: false,
        error: 'No file path provided',
      }, { status: 400 });
    }

    client = await createFTPClient({
      host: config.host,
      port: config.port || 21,
      user: config.user,
      password: config.password,
      secure: config.secure || false,
    });

    // Download file to buffer
    const chunks: Buffer[] = [];
    const writableStream = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    await client.downloadTo(writableStream, path);
    const buffer = Buffer.concat(chunks);

    // Get filename from path
    const filename = path.split('/').pop() || 'download';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to download file';
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
