import { io, Socket } from 'socket.io-client';
import { SignalingMessage } from '@/types';

export type SignalingEventHandler = (message: SignalingMessage) => void;
export type ParticipantJoinedHandler = (participantId: string, name: string) => void;
export type ParticipantLeftHandler = (participantId: string) => void;

export class SignalingService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Set<SignalingEventHandler>> = new Map();
  private participantJoinedHandlers: Set<ParticipantJoinedHandler> = new Set();
  private participantLeftHandlers: Set<ParticipantLeftHandler> = new Set();

  connect(serverUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(serverUrl, {
          transports: ['websocket', 'polling'],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          console.log('Connected to signaling server');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        this.socket.on('offer', (data: SignalingMessage) => {
          this.emit('offer', data);
        });

        this.socket.on('answer', (data: SignalingMessage) => {
          this.emit('answer', data);
        });

        this.socket.on('ice-candidate', (data: SignalingMessage) => {
          this.emit('ice-candidate', data);
        });

        this.socket.on('user-joined', (data: { id: string; name: string }) => {
          this.participantJoinedHandlers.forEach(handler => 
            handler(data.id, data.name)
          );
        });

        this.socket.on('user-left', (data: { id: string }) => {
          this.participantLeftHandlers.forEach(handler => 
            handler(data.id)
          );
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from signaling server');
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  joinRoom(roomId: string, userId: string, userName: string): void {
    if (this.socket) {
      this.socket.emit('join-room', { roomId, userId, userName });
    }
  }

  leaveRoom(roomId: string, userId: string): void {
    if (this.socket) {
      this.socket.emit('leave-room', { roomId, userId });
    }
  }

  sendOffer(to: string, offer: RTCSessionDescriptionInit, from: string): void {
    if (this.socket) {
      this.socket.emit('offer', { to, offer, from });
    }
  }

  sendAnswer(to: string, answer: RTCSessionDescriptionInit, from: string): void {
    if (this.socket) {
      this.socket.emit('answer', { to, answer, from });
    }
  }

  sendIceCandidate(
    to: string, 
    candidate: RTCIceCandidateInit, 
    from: string
  ): void {
    if (this.socket) {
      this.socket.emit('ice-candidate', { to, candidate, from });
    }
  }

  on(event: string, handler: SignalingEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  off(event: string, handler: SignalingEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  onParticipantJoined(handler: ParticipantJoinedHandler): void {
    this.participantJoinedHandlers.add(handler);
  }

  offParticipantJoined(handler: ParticipantJoinedHandler): void {
    this.participantJoinedHandlers.delete(handler);
  }

  onParticipantLeft(handler: ParticipantLeftHandler): void {
    this.participantLeftHandlers.add(handler);
  }

  offParticipantLeft(handler: ParticipantLeftHandler): void {
    this.participantLeftHandlers.delete(handler);
  }

  private emit(event: string, data: SignalingMessage): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.eventHandlers.clear();
    this.participantJoinedHandlers.clear();
    this.participantLeftHandlers.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const signalingService = new SignalingService();
