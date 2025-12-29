import { ICEServer, MediaConstraints } from '@/types';

// ICE servers for NAT traversal
const DEFAULT_ICE_SERVERS: ICEServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

// Default media constraints with echo cancellation and noise suppression
const DEFAULT_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 48000,
};

const DEFAULT_VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 1280, max: 1920 },
  height: { ideal: 720, max: 1080 },
  frameRate: { ideal: 30, max: 60 },
};

export class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;

  constructor(private iceServers: ICEServer[] = DEFAULT_ICE_SERVERS) {}

  // Get user media with optimal settings for video chat
  async getUserMedia(constraints?: MediaConstraints): Promise<MediaStream> {
    const finalConstraints: MediaStreamConstraints = {
      audio: constraints?.audio ?? DEFAULT_AUDIO_CONSTRAINTS,
      video: constraints?.video ?? DEFAULT_VIDEO_CONSTRAINTS,
    };

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(finalConstraints);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  // Get screen share stream
  async getScreenShare(): Promise<MediaStream> {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      return this.screenStream;
    } catch (error) {
      console.error('Error getting screen share:', error);
      throw error;
    }
  }

  // Stop screen sharing
  stopScreenShare(): void {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
  }

  // Create a new peer connection
  createPeerConnection(
    peerId: string,
    onIceCandidate: (candidate: RTCIceCandidate) => void,
    onTrack: (stream: MediaStream) => void,
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void
  ): RTCPeerConnection {
    const config: RTCConfiguration = {
      iceServers: this.iceServers,
      iceCandidatePoolSize: 10,
    };

    const peerConnection = new RTCPeerConnection(config);

    // Add local stream tracks to the connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        onIceCandidate(event.candidate);
      }
    };

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      onTrack(event.streams[0]);
    };

    // Handle connection state changes for network resilience
    peerConnection.onconnectionstatechange = () => {
      onConnectionStateChange?.(peerConnection.connectionState);
      
      // Handle reconnection on failure
      if (peerConnection.connectionState === 'failed') {
        console.warn('Connection failed, attempting to restart ICE');
        peerConnection.restartIce();
      }
    };

    // Monitor ICE connection state for adaptive behavior
    peerConnection.oniceconnectionstatechange = () => {
      console.log(`ICE connection state: ${peerConnection.iceConnectionState}`);
    };

    this.peerConnections.set(peerId, peerConnection);
    return peerConnection;
  }

  // Create and return an offer
  async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) {
      throw new Error(`No peer connection found for ${peerId}`);
    }

    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await peerConnection.setLocalDescription(offer);
    return offer;
  }

  // Create and return an answer
  async createAnswer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) {
      throw new Error(`No peer connection found for ${peerId}`);
    }

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  }

  // Set remote description
  async setRemoteDescription(
    peerId: string,
    description: RTCSessionDescriptionInit
  ): Promise<void> {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) {
      throw new Error(`No peer connection found for ${peerId}`);
    }

    await peerConnection.setRemoteDescription(description);
  }

  // Add ICE candidate
  async addIceCandidate(
    peerId: string,
    candidate: RTCIceCandidateInit
  ): Promise<void> {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) {
      throw new Error(`No peer connection found for ${peerId}`);
    }

    await peerConnection.addIceCandidate(candidate);
  }

  // Toggle audio mute
  toggleAudio(muted: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
  }

  // Toggle video
  toggleVideo(disabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = !disabled;
      });
    }
  }

  // Replace video track with screen share or camera
  async replaceVideoTrack(newStream: MediaStream): Promise<void> {
    const newVideoTrack = newStream.getVideoTracks()[0];
    if (!newVideoTrack) return;
    
    const replacePromises: Promise<void>[] = [];
    
    this.peerConnections.forEach((peerConnection) => {
      const sender = peerConnection.getSenders().find(
        s => s.track?.kind === 'video'
      );
      if (sender) {
        replacePromises.push(sender.replaceTrack(newVideoTrack));
      }
    });
    
    await Promise.all(replacePromises);
  }

  // Close a specific peer connection
  closePeerConnection(peerId: string): void {
    const peerConnection = this.peerConnections.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(peerId);
    }
  }

  // Close all connections and cleanup
  closeAllConnections(): void {
    this.peerConnections.forEach((connection, peerId) => {
      connection.close();
      this.peerConnections.delete(peerId);
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    this.stopScreenShare();
  }

  // Get local stream
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  // Get peer connection
  getPeerConnection(peerId: string): RTCPeerConnection | undefined {
    return this.peerConnections.get(peerId);
  }

  // Adaptive bitrate - adjust video constraints based on network conditions
  async adjustVideoQuality(quality: 'low' | 'medium' | 'high'): Promise<void> {
    if (!this.localStream) return;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (!videoTrack) return;

    const constraints: MediaTrackConstraints = {
      width: quality === 'low' ? 640 : quality === 'medium' ? 1280 : 1920,
      height: quality === 'low' ? 360 : quality === 'medium' ? 720 : 1080,
      frameRate: quality === 'low' ? 15 : quality === 'medium' ? 24 : 30,
    };

    try {
      await videoTrack.applyConstraints(constraints);
    } catch (error) {
      console.error('Error adjusting video quality:', error);
    }
  }
}

export const webRTCService = new WebRTCService();
