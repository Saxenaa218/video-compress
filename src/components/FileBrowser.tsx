'use client';

import { useState, useRef } from 'react';
import { FTPFile, FTPConfig } from '@/types/ftp';

interface FileBrowserProps {
  files: FTPFile[];
  currentPath: string;
  config: FTPConfig;
  onNavigate: (path: string) => void;
  onRefresh: () => void;
  onUpload: (file: File) => void;
  onDownload: (path: string) => void;
  onDelete: (path: string, isDirectory: boolean) => void;
  onRename: (oldPath: string, newName: string) => void;
  onCreateFolder: (name: string) => void;
  isLoading: boolean;
}

export default function FileBrowser({
  files,
  currentPath,
  onNavigate,
  onRefresh,
  onUpload,
  onDownload,
  onDelete,
  onRename,
  onCreateFolder,
  isLoading,
}: FileBrowserProps) {
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleFileClick = (file: FTPFile) => {
    if (file.type === 'directory') {
      const newPath = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
      onNavigate(newPath);
    }
  };

  const handleGoUp = () => {
    if (currentPath === '/') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    onNavigate(parentPath);
  };

  const handleRenameSubmit = (file: FTPFile) => {
    if (newName && newName !== file.name) {
      const oldPath = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
      onRename(oldPath, newName);
    }
    setRenamingFile(null);
    setNewName('');
  };

  const handleCreateFolder = () => {
    if (newFolderName) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFilePath = (file: FTPFile): string => {
    return currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md">
      {/* Toolbar */}
      <div className="border-b border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoUp}
              disabled={currentPath === '/' || isLoading}
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Go up"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 font-mono bg-zinc-100 dark:bg-zinc-700 px-3 py-1 rounded-md">
              {currentPath}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload
            </button>
            <button
              onClick={() => setShowNewFolderInput(true)}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              New Folder
            </button>
          </div>
        </div>
        
        {/* New Folder Input */}
        {showNewFolderInput && (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-zinc-700 dark:text-zinc-100"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') {
                  setShowNewFolderInput(false);
                  setNewFolderName('');
                }
              }}
            />
            <button
              onClick={handleCreateFolder}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewFolderInput(false);
                setNewFolderName('');
              }}
              className="px-3 py-2 bg-zinc-500 text-white rounded-md hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* File List */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            This directory is empty
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Modified
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {files.map((file) => (
                <tr key={file.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                  <td className="px-4 py-3">
                    {renamingFile === file.name ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="px-2 py-1 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm dark:bg-zinc-700 dark:text-zinc-100"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameSubmit(file);
                            if (e.key === 'Escape') {
                              setRenamingFile(null);
                              setNewName('');
                            }
                          }}
                        />
                        <button
                          onClick={() => handleRenameSubmit(file)}
                          className="text-green-600 hover:text-green-700"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => {
                            setRenamingFile(null);
                            setNewName('');
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleFileClick(file)}
                        className={`flex items-center gap-2 ${
                          file.type === 'directory' 
                            ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' 
                            : 'text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {file.type === 'directory' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                        <span>{file.name}</span>
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {file.type === 'directory' ? '-' : formatSize(file.size)}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {formatDate(file.modifiedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {file.type === 'file' && (
                        <button
                          onClick={() => onDownload(getFilePath(file))}
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Download"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setRenamingFile(file.name);
                          setNewName(file.name);
                        }}
                        className="p-1 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                        title="Rename"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
                            onDelete(getFilePath(file), file.type === 'directory');
                          }
                        }}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
