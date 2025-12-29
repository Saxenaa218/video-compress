export interface FTPConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
  rejectUnauthorized?: boolean; // Whether to reject unauthorized SSL certificates (default: true for security)
}

export interface FTPFile {
  name: string;
  type: 'file' | 'directory';
  size: number;
  modifiedAt: string;
  permissions?: string;
}

export interface FTPResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ConnectionStatus {
  connected: boolean;
  host?: string;
  user?: string;
}
