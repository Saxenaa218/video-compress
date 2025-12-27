import { io } from 'socket.io-client';
import { API_URL } from './api';

let socket = null;

export const socketService = {
  connect(userId) {
    if (socket?.connected) {
      return socket;
    }

    socket = io(API_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  onNewMessage(callback) {
    if (socket) {
      socket.on('newMessage', callback);
    }
  },

  offNewMessage(callback) {
    if (socket) {
      socket.off('newMessage', callback);
    }
  },

  onUserOnline(callback) {
    if (socket) {
      socket.on('userOnline', callback);
    }
  },

  onUserOffline(callback) {
    if (socket) {
      socket.on('userOffline', callback);
    }
  },

  onUserTyping(callback) {
    if (socket) {
      socket.on('userTyping', callback);
    }
  },

  onUserStopTyping(callback) {
    if (socket) {
      socket.on('userStopTyping', callback);
    }
  },

  emitTyping(senderId, receiverId) {
    if (socket) {
      socket.emit('typing', { senderId, receiverId });
    }
  },

  emitStopTyping(senderId, receiverId) {
    if (socket) {
      socket.emit('stopTyping', { senderId, receiverId });
    }
  },

  getSocket() {
    return socket;
  },
};

export default socketService;
