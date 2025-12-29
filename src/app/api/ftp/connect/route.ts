import { NextRequest, NextResponse } from 'next/server';
import { createFTPClient } from '@/lib/ftp-client';
import { FTPConfig, FTPResponse } from '@/types/ftp';

export async function POST(request: NextRequest) {
  try {
    const config: FTPConfig = await request.json();
    
    if (!config.host || !config.user || !config.password) {
      return NextResponse.json<FTPResponse>({
        success: false,
        error: 'Missing required fields: host, user, password',
      }, { status: 400 });
    }

    const client = await createFTPClient({
      host: config.host,
      port: config.port || 21,
      user: config.user,
      password: config.password,
      secure: config.secure || false,
    });
    
    await client.close();
    
    return NextResponse.json<FTPResponse<{ message: string }>>({
      success: true,
      data: { message: 'Connection successful' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect';
    return NextResponse.json<FTPResponse>({
      success: false,
      error: message,
    }, { status: 500 });
  }
}
