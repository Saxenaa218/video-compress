export interface Participant {
  id: string;
  name: string;
  stream: MediaStream | null;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
}

export interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'user-joined' | 'user-left';
  from: string;
  to?: string;
  payload: unknown;
}

export interface RoomState {
  roomId: string;
  participants: Participant[];
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  isConnected: boolean;
}

export interface CallControlsState {
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
}

export interface MediaConstraints {
  audio: MediaTrackConstraints | boolean;
  video: MediaTrackConstraints | boolean;
}

export interface ICEServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}
