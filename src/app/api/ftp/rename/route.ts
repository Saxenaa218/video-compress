import { NextRequest, NextResponse } from 'next/server';
import { createFTPClient } from '@/lib/ftp-client';
import { FTPConfig, FTPResponse } from '@/types/ftp';

export async function POST(request: NextRequest) {
  let client = null;
  
  try {
    const body = await request.json();
    const { config, oldPath, newPath }: { config: FTPConfig; oldPath: string; newPath: string } = body;
    
    if (!config.host || !config.user || !config.password) {
      return NextResponse.json<FTPResponse>({
        success: false,
        error: 'Missing required fields: host, user, password',
      }, { status: 400 });
    }

    if (!oldPath || !newPath) {
      return NextResponse.json<FTPResponse>({
        success: false,
        error: 'Both old and new paths are required',
      }, { status: 400 });
    }

    client = await createFTPClient({
      host: config.host,
      port: config.port || 21,
      user: config.user,
      password: config.password,
      secure: config.secure || false,
    });

    await client.rename(oldPath, newPath);

    return NextResponse.json<FTPResponse<{ message: string }>>({
      success: true,
      data: { message: `Renamed ${oldPath} to ${newPath}` },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to rename';
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
