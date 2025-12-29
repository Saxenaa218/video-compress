'use client';

import { useState, useCallback } from 'react';
import ConnectionForm from '@/components/ConnectionForm';
import FileBrowser from '@/components/FileBrowser';
import StatusBar from '@/components/StatusBar';
import { FTPConfig, FTPFile, FTPResponse } from '@/types/ftp';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<FTPConfig | null>(null);
  const [files, setFiles] = useState<FTPFile[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' | 'warning' }>({
    message: '',
    type: 'info',
  });

  const showStatus = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setStatus({ message, type });
    if (type === 'success' || type === 'info') {
      setTimeout(() => setStatus({ message: '', type: 'info' }), 3000);
    }
  };

  const listFiles = useCallback(async (ftpConfig: FTPConfig, path: string = '/') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ftp/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: ftpConfig, path }),
      });
      
      const data: FTPResponse<{ files: FTPFile[]; path: string }> = await response.json();
      
      if (data.success && data.data) {
        setFiles(data.data.files);
        setCurrentPath(data.data.path);
      } else {
        showStatus(data.error || 'Failed to list files', 'error');
      }
    } catch {
      showStatus('Failed to list files', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConnect = async (ftpConfig: FTPConfig) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ftp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ftpConfig),
      });
      
      const data: FTPResponse = await response.json();
      
      if (data.success) {
        setIsConnected(true);
        setConfig(ftpConfig);
        showStatus(`Connected to ${ftpConfig.host}`, 'success');
        await listFiles(ftpConfig);
      } else {
        showStatus(data.error || 'Connection failed', 'error');
      }
    } catch {
      showStatus('Connection failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConfig(null);
    setFiles([]);
    setCurrentPath('/');
    showStatus('Disconnected', 'info');
  };

  const handleNavigate = async (path: string) => {
    if (config) {
      await listFiles(config, path);
    }
  };

  const handleRefresh = async () => {
    if (config) {
      await listFiles(config, currentPath);
    }
  };

  const handleUpload = async (file: File) => {
    if (!config) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('config', JSON.stringify(config));
      formData.append('path', currentPath);
      
      const response = await fetch('/api/ftp/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data: FTPResponse = await response.json();
      
      if (data.success) {
        showStatus(`Uploaded ${file.name}`, 'success');
        await listFiles(config, currentPath);
      } else {
        showStatus(data.error || 'Upload failed', 'error');
      }
    } catch {
      showStatus('Upload failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (path: string) => {
    if (!config) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ftp/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, path }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const filename = path.split('/').pop() || 'download';
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showStatus(`Downloaded ${filename}`, 'success');
      } else {
        const data = await response.json();
        showStatus(data.error || 'Download failed', 'error');
      }
    } catch {
      showStatus('Download failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (path: string, isDirectory: boolean) => {
    if (!config) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ftp/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, path, isDirectory }),
      });
      
      const data: FTPResponse = await response.json();
      
      if (data.success) {
        showStatus(`Deleted ${path}`, 'success');
        await listFiles(config, currentPath);
      } else {
        showStatus(data.error || 'Delete failed', 'error');
      }
    } catch {
      showStatus('Delete failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = async (oldPath: string, newName: string) => {
    if (!config) return;
    
    setIsLoading(true);
    try {
      const directory = oldPath.split('/').slice(0, -1).join('/') || '/';
      const newPath = directory === '/' ? `/${newName}` : `${directory}/${newName}`;
      
      const response = await fetch('/api/ftp/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, oldPath, newPath }),
      });
      
      const data: FTPResponse = await response.json();
      
      if (data.success) {
        showStatus(`Renamed to ${newName}`, 'success');
        await listFiles(config, currentPath);
      } else {
        showStatus(data.error || 'Rename failed', 'error');
      }
    } catch {
      showStatus('Rename failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async (name: string) => {
    if (!config) return;
    
    setIsLoading(true);
    try {
      const path = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
      
      const response = await fetch('/api/ftp/mkdir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, path }),
      });
      
      const data: FTPResponse = await response.json();
      
      if (data.success) {
        showStatus(`Created folder ${name}`, 'success');
        await listFiles(config, currentPath);
      } else {
        showStatus(data.error || 'Create folder failed', 'error');
      }
    } catch {
      showStatus('Create folder failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <header className="bg-white dark:bg-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              Simple FTP Client
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {status.message && (
            <StatusBar message={status.message} type={status.type} />
          )}

          <ConnectionForm
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            isLoading={isLoading}
          />

          {isConnected && config && (
            <FileBrowser
              files={files}
              currentPath={currentPath}
              config={config}
              onNavigate={handleNavigate}
              onRefresh={handleRefresh}
              onUpload={handleUpload}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onRename={handleRename}
              onCreateFolder={handleCreateFolder}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>

      <footer className="bg-white dark:bg-zinc-800 shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Simple FTP Client - Built with Next.js and basic-ftp
          </p>
        </div>
      </footer>
    </div>
  );
}
