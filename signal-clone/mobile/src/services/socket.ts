import { io, Socket } from 'socket.io-client';
import { WS_URL } from '../config';
import { Message } from '../types';

type MessageCallback = (message: Message) => void;
type TypingCallback = (data: { userId: string; conversationId: string }) => void;
type UserStatusCallback = (data: { userId: string }) => void;

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: Map<string, MessageCallback[]> = new Map();
  private notificationListeners: MessageCallback[] = [];
  private typingStartListeners: TypingCallback[] = [];
  private typingStopListeners: TypingCallback[] = [];
  private userOnlineListeners: UserStatusCallback[] = [];
  private userOfflineListeners: UserStatusCallback[] = [];

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Handle new messages
    this.socket.on('message:new', (message: Message) => {
      const listeners = this.messageListeners.get(message.conversationId) || [];
      listeners.forEach((callback) => callback(message));
    });

    // Handle message notifications
    this.socket.on('notification:message', ({ message }: { conversationId: string; message: Message }) => {
      this.notificationListeners.forEach((callback) => callback(message));
    });

    // Handle typing indicators
    this.socket.on('typing:start', (data: { userId: string; conversationId: string }) => {
      this.typingStartListeners.forEach((callback) => callback(data));
    });

    this.socket.on('typing:stop', (data: { userId: string; conversationId: string }) => {
      this.typingStopListeners.forEach((callback) => callback(data));
    });

    // Handle user status
    this.socket.on('user:online', (data: { userId: string }) => {
      this.userOnlineListeners.forEach((callback) => callback(data));
    });

    this.socket.on('user:offline', (data: { userId: string }) => {
      this.userOfflineListeners.forEach((callback) => callback(data));
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId: string): void {
    this.socket?.emit('conversation:join', conversationId);
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit('conversation:leave', conversationId);
  }

  sendMessage(data: {
    conversationId: string;
    receiverId: string;
    encryptedContent: string;
    nonce: string;
  }): void {
    this.socket?.emit('message:send', data);
  }

  startTyping(conversationId: string): void {
    this.socket?.emit('typing:start', conversationId);
  }

  stopTyping(conversationId: string): void {
    this.socket?.emit('typing:stop', conversationId);
  }

  // Listener management
  onMessage(conversationId: string, callback: MessageCallback): () => void {
    const listeners = this.messageListeners.get(conversationId) || [];
    listeners.push(callback);
    this.messageListeners.set(conversationId, listeners);

    return () => {
      const currentListeners = this.messageListeners.get(conversationId) || [];
      this.messageListeners.set(
        conversationId,
        currentListeners.filter((cb) => cb !== callback)
      );
    };
  }

  onNotification(callback: MessageCallback): () => void {
    this.notificationListeners.push(callback);
    return () => {
      this.notificationListeners = this.notificationListeners.filter((cb) => cb !== callback);
    };
  }

  onTypingStart(callback: TypingCallback): () => void {
    this.typingStartListeners.push(callback);
    return () => {
      this.typingStartListeners = this.typingStartListeners.filter((cb) => cb !== callback);
    };
  }

  onTypingStop(callback: TypingCallback): () => void {
    this.typingStopListeners.push(callback);
    return () => {
      this.typingStopListeners = this.typingStopListeners.filter((cb) => cb !== callback);
    };
  }

  onUserOnline(callback: UserStatusCallback): () => void {
    this.userOnlineListeners.push(callback);
    return () => {
      this.userOnlineListeners = this.userOnlineListeners.filter((cb) => cb !== callback);
    };
  }

  onUserOffline(callback: UserStatusCallback): () => void {
    this.userOfflineListeners.push(callback);
    return () => {
      this.userOfflineListeners = this.userOfflineListeners.filter((cb) => cb !== callback);
    };
  }
}

export const socketService = new SocketService();
