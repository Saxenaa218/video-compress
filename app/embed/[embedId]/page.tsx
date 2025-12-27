'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';

interface VideoData {
  id: string;
  title: string;
  videoUrl: string;
  uploaderName: string;
  createdAt: string;
}

interface Props {
  params: Promise<{ embedId: string }>;
}

export default function EmbedPage({ params }: Props) {
  const { embedId } = use(params);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVideo = useCallback(async () => {
    try {
      const res = await fetch(`/api/videos/embed?embedId=${embedId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Video not found');
        return;
      }

      setVideo(data.video);
    } catch {
      setError('Failed to load video');
    } finally {
      setLoading(false);
    }
  }, [embedId]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Video Not Found</h1>
          <p className="text-gray-400">{error || 'The video you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center">
        <video
          controls
          autoPlay
          className="max-w-full max-h-[80vh] w-auto h-auto"
        >
          <source src={video.videoUrl} type="video/mp4" />
          <source src={video.videoUrl} type="video/webm" />
          <source src={video.videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Info */}
      <div className="bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-white">{video.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
            <span>Uploaded by {video.uploaderName}</span>
            <span>•</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-800 p-4 text-center">
        <Link 
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Powered by VideoShare - Upload your own videos
        </Link>
      </div>
    </div>
  );
}
