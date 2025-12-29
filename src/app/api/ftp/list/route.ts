import { NextRequest, NextResponse } from 'next/server';
import { createFTPClient, mapFileInfo } from '@/lib/ftp-client';
import { FTPConfig, FTPFile, FTPResponse } from '@/types/ftp';

export async function POST(request: NextRequest) {
  let client = null;
  
  try {
    const body = await request.json();
    const { config, path }: { config: FTPConfig; path?: string } = body;
    
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

    const targetPath = path || '/';
    const fileList = await client.list(targetPath);
    const files: FTPFile[] = fileList.map(mapFileInfo);
    
    // Sort: directories first, then files, alphabetically
    files.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json<FTPResponse<{ files: FTPFile[]; path: string }>>({
      success: true,
      data: { files, path: targetPath },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list files';
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
