import * as ftp from 'basic-ftp';
import { FTPConfig, FTPFile } from '@/types/ftp';

export async function createFTPClient(config: FTPConfig): Promise<ftp.Client> {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  
  // By default, enforce SSL certificate validation for security
  // Users can explicitly disable this for self-signed certificates
  const rejectUnauthorized = config.rejectUnauthorized !== false;
  
  await client.access({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    secure: config.secure,
    secureOptions: config.secure ? { rejectUnauthorized } : undefined,
  });
  
  return client;
}

export function mapFileInfo(fileInfo: ftp.FileInfo): FTPFile {
  return {
    name: fileInfo.name,
    type: fileInfo.isDirectory ? 'directory' : 'file',
    size: fileInfo.size,
    modifiedAt: fileInfo.modifiedAt?.toISOString() || new Date().toISOString(),
    permissions: fileInfo.permissions?.user ? 
      `${fileInfo.permissions.user}${fileInfo.permissions.group}${fileInfo.permissions.world}` : 
      undefined,
  };
}
