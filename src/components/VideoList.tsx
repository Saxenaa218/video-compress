'use client';

import React, { useState } from 'react';

interface Video {
  id: string;
  originalName: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt?: string;
}

interface VideoListProps {
  videos: Video[];
  onCompress: (videoId: string) => Promise<void>;
  onDelete: (videoId: string) => Promise<void>;
  onRefresh: () => void;
}

export default function VideoList({ videos, onCompress, onDelete, onRefresh }: VideoListProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCompress = async (videoId: string) => {
    setProcessingIds((prev) => new Set(prev).add(videoId));
    try {
      await onCompress(videoId);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(videoId);
        return next;
      });
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    setDeletingIds((prev) => new Set(prev).add(videoId));
    try {
      await onDelete(videoId);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(videoId);
        return next;
      });
    }
  };

  const getStatusBadge = (status: Video['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    const labels = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400">No videos uploaded yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Upload a video to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Your Videos ({videos.length})
        </h2>
        <button
          onClick={onRefresh}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                    {video.originalName}
                  </h3>
                  {getStatusBadge(video.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Original Size</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {formatFileSize(video.originalSize)}
                    </p>
                  </div>

                  {video.compressedSize && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Compressed Size</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        {formatFileSize(video.compressedSize)}
                      </p>
                    </div>
                  )}

                  {video.compressionRatio !== undefined && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Saved</p>
                      <p className="font-medium text-green-600 dark:text-green-400">
                        {video.compressionRatio.toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {video.status === 'pending' && (
                  <button
                    onClick={() => handleCompress(video.id)}
                    disabled={processingIds.has(video.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {processingIds.has(video.id) ? 'Compressing...' : 'Compress'}
                  </button>
                )}

                {video.status === 'processing' && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm">Processing</span>
                  </div>
                )}

                {video.status === 'completed' && (
                  <a
                    href={`/api/download?id=${video.id}&type=compressed`}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download
                  </a>
                )}

                {video.status === 'failed' && (
                  <button
                    onClick={() => handleCompress(video.id)}
                    disabled={processingIds.has(video.id)}
                    className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                  >
                    Retry
                  </button>
                )}

                <button
                  onClick={() => handleDelete(video.id)}
                  disabled={deletingIds.has(video.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 transition-colors"
                  title="Delete"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
