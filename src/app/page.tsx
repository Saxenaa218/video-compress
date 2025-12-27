'use client';

import { useState } from 'react';
import AudioUploader from '@/components/AudioUploader';
import AudioEditor from '@/components/AudioEditor';

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setAudioFile(file);
  };

  const handleBack = () => {
    setAudioFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="w-full py-6 px-8 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Audio Editor
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload, Edit & Export Audio
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {!audioFile ? (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Upload Your Audio File
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Drag and drop your audio file or click to browse. Supports all major formats including MP3, WAV, AAC, FLAC, OGG, and more.
              </p>
            </div>
            <AudioUploader onFileSelect={handleFileSelect} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                  </svg>
                }
                title="Multiple Formats"
                description="Support for MP3, WAV, AAC, FLAC, OGG, WebM, and M4A audio formats."
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121" />
                  </svg>
                }
                title="Trim & Cut"
                description="Select any portion of your audio and trim it to create clips."
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                  </svg>
                }
                title="Playback Control"
                description="Adjust volume, change playback speed, and navigate easily."
              />
            </div>
          </div>
        ) : (
          <AudioEditor audioFile={audioFile} onBack={handleBack} />
        )}
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        Audio Editor - Upload and edit your audio files in the browser
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
