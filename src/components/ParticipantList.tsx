'use client';

import React from 'react';
import { useVideoChat } from '@/contexts/VideoChatContext';

export function ParticipantList() {
  const { roomState, localUserId, localUserName } = useVideoChat();
  const { participants, isAudioMuted, isVideoMuted } = roomState;

  return (
    <div className="bg-gray-800 rounded-xl p-4 w-full md:w-64 max-h-96 overflow-y-auto">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <UsersIcon className="w-5 h-5" />
        Participants ({participants.length + 1})
      </h3>
      
      <ul className="space-y-2">
        {/* Local user */}
        <li className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {(localUserName || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="text-white text-sm font-medium truncate max-w-24">
              {localUserName || `User ${localUserId.slice(0, 6)}`} (You)
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isAudioMuted ? (
              <MicOffIcon className="w-4 h-4 text-red-400" />
            ) : (
              <MicIcon className="w-4 h-4 text-green-400" />
            )}
            {isVideoMuted ? (
              <VideoOffIcon className="w-4 h-4 text-red-400" />
            ) : (
              <VideoIcon className="w-4 h-4 text-green-400" />
            )}
          </div>
        </li>

        {/* Remote participants */}
        {participants.map((participant) => (
          <li 
            key={participant.id}
            className="flex items-center justify-between p-2 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm font-medium truncate max-w-24">
                {participant.name}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {participant.isAudioMuted ? (
                <MicOffIcon className="w-4 h-4 text-red-400" />
              ) : (
                <MicIcon className="w-4 h-4 text-green-400" />
              )}
              {participant.isVideoMuted ? (
                <VideoOffIcon className="w-4 h-4 text-red-400" />
              ) : (
                <VideoIcon className="w-4 h-4 text-green-400" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
      />
    </svg>
  );
}

function MicOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}

function VideoOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
    </svg>
  );
}
