import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

interface JwtPayload {
  userId: string;
}

interface MessageData {
  conversationId: string;
  receiverId: string;
  encryptedContent: string;
  nonce: string;
}

// Store online users: Map<userId, socketId>
const onlineUsers = new Map<string, string>();

export const setupSocketHandlers = (io: SocketIOServer): void => {
  // Authentication middleware for Socket.io
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);
    
    if (socket.userId) {
      onlineUsers.set(socket.userId, socket.id);
      
      // Notify others that this user is online
      socket.broadcast.emit('user:online', { userId: socket.userId });
    }

    // Handle joining conversation rooms
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Handle sending messages in real-time
    socket.on('message:send', async (data: MessageData) => {
      try {
        const { conversationId, receiverId, encryptedContent, nonce } = data;

        // Verify user is part of this conversation
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId }
        });

        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        if (conversation.user1Id !== socket.userId && conversation.user2Id !== socket.userId) {
          socket.emit('error', { message: 'Not authorized' });
          return;
        }

        // Create the message
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: socket.userId!,
            receiverId,
            encryptedContent,
            nonce
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                publicKey: true
              }
            }
          }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });

        // Emit to the conversation room
        io.to(`conversation:${conversationId}`).emit('message:new', message);

        // If receiver is online but not in the conversation room, notify them
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('notification:message', {
            conversationId,
            message
          });
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:start', {
        userId: socket.userId,
        conversationId
      });
    });

    socket.on('typing:stop', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stop', {
        userId: socket.userId,
        conversationId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        
        // Notify others that this user is offline
        socket.broadcast.emit('user:offline', { userId: socket.userId });
      }
    });
  });
};

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers.keys());
};
