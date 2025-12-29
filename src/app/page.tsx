'use client';

import { useState, useEffect, useCallback } from 'react';
import VideoUpload from '@/components/VideoUpload';
import VideoList from '@/components/VideoList';

interface Video {
  id: string;
  originalName: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt?: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleUploadSuccess = (video: { id: string; originalName: string; originalSize: number; status: string }) => {
    setVideos((prev) => [
      {
        ...video,
        status: video.status as Video['status'],
      },
      ...prev,
    ]);
  };

  const handleCompress = async (videoId: string) => {
    try {
      // Update local state to show processing
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, status: 'processing' as const } : v))
      );

      const response = await fetch('/api/compress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (data.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId
              ? {
                  ...v,
                  ...data.video,
                }
              : v
          )
        );
      } else {
        setVideos((prev) =>
          prev.map((v) => (v.id === videoId ? { ...v, status: 'failed' as const } : v))
        );
      }
    } catch (error) {
      console.error('Compression failed:', error);
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, status: 'failed' as const } : v))
      );
    }
  };

  const handleDelete = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos?id=${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== videoId));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Video Compressor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your videos and compress them to reduce file size while maintaining quality.
            Fast, easy, and secure.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <VideoUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Videos List */}
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
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
            </div>
          ) : (
            <VideoList
              videos={videos}
              onCompress={handleCompress}
              onDelete={handleDelete}
              onRefresh={fetchVideos}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, MongoDB, and FFmpeg</p>
        </div>
      </div>
    </div>
  );
}
