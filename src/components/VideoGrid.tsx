'use client';

import React from 'react';
import { VideoTile } from './VideoTile';
import { useVideoChat } from '@/contexts/VideoChatContext';

export function VideoGrid() {
  const { roomState, localUserName, localUserId } = useVideoChat();
  const { localStream, participants, isAudioMuted, isVideoMuted, isScreenSharing } = roomState;

  const totalParticipants = participants.length + 1; // +1 for local user

  // Determine grid layout based on participant count
  const getGridClass = () => {
    if (totalParticipants <= 1) return 'grid-cols-1';
    if (totalParticipants === 2) return 'grid-cols-1 md:grid-cols-2';
    if (totalParticipants <= 4) return 'grid-cols-2';
    if (totalParticipants <= 6) return 'grid-cols-2 md:grid-cols-3';
    if (totalParticipants <= 9) return 'grid-cols-3';
    return 'grid-cols-3 md:grid-cols-4';
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className={`grid ${getGridClass()} gap-4 h-full`}>
        {/* Local video tile */}
        <VideoTile
          stream={isScreenSharing ? roomState.screenStream : localStream}
          name={localUserName || `User ${localUserId.slice(0, 6)}`}
          isLocal={true}
          isAudioMuted={isAudioMuted}
          isVideoMuted={isVideoMuted}
          isScreenSharing={isScreenSharing}
        />

        {/* Remote participant tiles */}
        {participants.map((participant) => (
          <VideoTile
            key={participant.id}
            stream={participant.stream}
            name={participant.name}
            isLocal={false}
            isAudioMuted={participant.isAudioMuted}
            isVideoMuted={participant.isVideoMuted}
            isScreenSharing={participant.isScreenSharing}
          />
        ))}
      </div>
    </div>
  );
}
