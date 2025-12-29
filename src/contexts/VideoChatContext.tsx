'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Participant, RoomState, SignalingMessage } from '@/types';
import { WebRTCService } from '@/lib/webrtc';
import { SignalingService } from '@/lib/signaling';
import { v4 as uuidv4 } from 'uuid';

interface VideoChatContextType {
  roomState: RoomState;
  localUserId: string;
  localUserName: string;
  setLocalUserName: (name: string) => void;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  updateVideoQuality: (quality: 'low' | 'medium' | 'high') => Promise<void>;
  isJoining: boolean;
  error: string | null;
}

const VideoChatContext = createContext<VideoChatContextType | null>(null);

export function useVideoChat() {
  const context = useContext(VideoChatContext);
  if (!context) {
    throw new Error('useVideoChat must be used within a VideoChatProvider');
  }
  return context;
}

interface VideoChatProviderProps {
  children: React.ReactNode;
  signalingServerUrl?: string;
}

export function VideoChatProvider({ 
  children, 
  signalingServerUrl = process.env.NEXT_PUBLIC_SIGNALING_SERVER || 'ws://localhost:3001' 
}: VideoChatProviderProps) {
  const [localUserId] = useState(() => uuidv4());
  const [localUserName, setLocalUserName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [roomState, setRoomState] = useState<RoomState>({
    roomId: '',
    participants: [],
    localStream: null,
    screenStream: null,
    isAudioMuted: false,
    isVideoMuted: false,
    isScreenSharing: false,
    isConnected: false,
  });

  const webRTCRef = useRef<WebRTCService | null>(null);
  const signalingRef = useRef<SignalingService | null>(null);
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  // Keep localStreamRef in sync with roomState.localStream
  useEffect(() => {
    localStreamRef.current = roomState.localStream;
  }, [roomState.localStream]);

  // Initialize services
  useEffect(() => {
    webRTCRef.current = new WebRTCService();
    signalingRef.current = new SignalingService();

    return () => {
      webRTCRef.current?.closeAllConnections();
      signalingRef.current?.disconnect();
    };
  }, []);

  // Add remote participant with stream
  const addParticipant = useCallback((id: string, name: string, stream: MediaStream | null) => {
    setRoomState(prev => {
      const existingIndex = prev.participants.findIndex(p => p.id === id);
      const participant: Participant = {
        id,
        name,
        stream,
        isAudioMuted: false,
        isVideoMuted: false,
        isScreenSharing: false,
      };

      if (existingIndex >= 0) {
        const newParticipants = [...prev.participants];
        newParticipants[existingIndex] = { ...newParticipants[existingIndex], stream };
        return { ...prev, participants: newParticipants };
      }

      return { ...prev, participants: [...prev.participants, participant] };
    });
  }, []);

  // Remove participant
  const removeParticipant = useCallback((id: string) => {
    webRTCRef.current?.closePeerConnection(id);
    remoteStreamsRef.current.delete(id);
    setRoomState(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== id),
    }));
  }, []);

  // Handle new participant joining
  const handleParticipantJoined = useCallback(async (participantId: string, name: string) => {
    if (!webRTCRef.current || !signalingRef.current) return;

    // Create peer connection for the new participant
    webRTCRef.current.createPeerConnection(
      participantId,
      (candidate) => {
        signalingRef.current?.sendIceCandidate(participantId, candidate.toJSON(), localUserId);
      },
      (stream) => {
        remoteStreamsRef.current.set(participantId, stream);
        addParticipant(participantId, name, stream);
      }
    );

    // Create and send offer
    const offer = await webRTCRef.current.createOffer(participantId);
    signalingRef.current.sendOffer(participantId, offer, localUserId);

    // Add participant placeholder
    addParticipant(participantId, name, null);
  }, [localUserId, addParticipant]);

  // Handle signaling messages
  const handleOffer = useCallback(async (message: SignalingMessage) => {
    if (!webRTCRef.current || !signalingRef.current) return;
    
    const { from, payload } = message;
    const offer = payload as RTCSessionDescriptionInit;

    // Create peer connection if it doesn't exist
    if (!webRTCRef.current.getPeerConnection(from)) {
      webRTCRef.current.createPeerConnection(
        from,
        (candidate) => {
          signalingRef.current?.sendIceCandidate(from, candidate.toJSON(), localUserId);
        },
        (stream) => {
          remoteStreamsRef.current.set(from, stream);
          addParticipant(from, `User ${from.slice(0, 6)}`, stream);
        }
      );
    }

    await webRTCRef.current.setRemoteDescription(from, offer);
    const answer = await webRTCRef.current.createAnswer(from);
    signalingRef.current.sendAnswer(from, answer, localUserId);
  }, [localUserId, addParticipant]);

  const handleAnswer = useCallback(async (message: SignalingMessage) => {
    if (!webRTCRef.current) return;
    
    const { from, payload } = message;
    const answer = payload as RTCSessionDescriptionInit;
    await webRTCRef.current.setRemoteDescription(from, answer);
  }, []);

  const handleIceCandidate = useCallback(async (message: SignalingMessage) => {
    if (!webRTCRef.current) return;
    
    const { from, payload } = message;
    const candidate = payload as RTCIceCandidateInit;
    await webRTCRef.current.addIceCandidate(from, candidate);
  }, []);

  // Join a room
  const joinRoom = useCallback(async (roomId: string) => {
    if (!webRTCRef.current || !signalingRef.current) {
      setError('Services not initialized');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      // Get local media stream
      const localStream = await webRTCRef.current.getUserMedia();

      // Connect to signaling server
      await signalingRef.current.connect(signalingServerUrl);

      // Set up signaling event handlers
      signalingRef.current.on('offer', handleOffer);
      signalingRef.current.on('answer', handleAnswer);
      signalingRef.current.on('ice-candidate', handleIceCandidate);
      signalingRef.current.onParticipantJoined(handleParticipantJoined);
      signalingRef.current.onParticipantLeft(removeParticipant);

      // Join the room
      signalingRef.current.joinRoom(roomId, localUserId, localUserName || `User ${localUserId.slice(0, 6)}`);

      setRoomState(prev => ({
        ...prev,
        roomId,
        localStream,
        isConnected: true,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join room';
      setError(errorMessage);
      console.error('Error joining room:', err);
    } finally {
      setIsJoining(false);
    }
  }, [
    localUserId, 
    localUserName, 
    signalingServerUrl, 
    handleOffer, 
    handleAnswer, 
    handleIceCandidate, 
    handleParticipantJoined, 
    removeParticipant
  ]);

  // Leave the room
  const leaveRoom = useCallback(() => {
    if (signalingRef.current) {
      signalingRef.current.leaveRoom(roomState.roomId, localUserId);
      signalingRef.current.disconnect();
    }

    webRTCRef.current?.closeAllConnections();
    remoteStreamsRef.current.clear();

    setRoomState({
      roomId: '',
      participants: [],
      localStream: null,
      screenStream: null,
      isAudioMuted: false,
      isVideoMuted: false,
      isScreenSharing: false,
      isConnected: false,
    });
  }, [roomState.roomId, localUserId]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    const newMutedState = !roomState.isAudioMuted;
    webRTCRef.current?.toggleAudio(newMutedState);
    setRoomState(prev => ({ ...prev, isAudioMuted: newMutedState }));
  }, [roomState.isAudioMuted]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    const newDisabledState = !roomState.isVideoMuted;
    webRTCRef.current?.toggleVideo(newDisabledState);
    setRoomState(prev => ({ ...prev, isVideoMuted: newDisabledState }));
  }, [roomState.isVideoMuted]);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    if (!webRTCRef.current) return;

    try {
      if (roomState.isScreenSharing) {
        webRTCRef.current.stopScreenShare();
        if (roomState.localStream) {
          await webRTCRef.current.replaceVideoTrack(roomState.localStream);
        }
        setRoomState(prev => ({ ...prev, isScreenSharing: false, screenStream: null }));
      } else {
        const screenStream = await webRTCRef.current.getScreenShare();
        await webRTCRef.current.replaceVideoTrack(screenStream);
        
        // Handle screen share ending - use ref to avoid stale closure
        const videoTrack = screenStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.onended = () => {
            webRTCRef.current?.stopScreenShare();
            // Use ref to get the latest localStream value
            const currentLocalStream = localStreamRef.current;
            if (currentLocalStream) {
              webRTCRef.current?.replaceVideoTrack(currentLocalStream);
            }
            setRoomState(prev => ({ ...prev, isScreenSharing: false, screenStream: null }));
          };
        }

        setRoomState(prev => ({ ...prev, isScreenSharing: true, screenStream }));
      }
    } catch (err) {
      console.error('Error toggling screen share:', err);
    }
  }, [roomState.isScreenSharing, roomState.localStream]);

  // Update video quality
  const updateVideoQuality = useCallback(async (quality: 'low' | 'medium' | 'high') => {
    await webRTCRef.current?.adjustVideoQuality(quality);
  }, []);

  const value: VideoChatContextType = {
    roomState,
    localUserId,
    localUserName,
    setLocalUserName,
    joinRoom,
    leaveRoom,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    updateVideoQuality,
    isJoining,
    error,
  };

  return (
    <VideoChatContext.Provider value={value}>
      {children}
    </VideoChatContext.Provider>
  );
}
