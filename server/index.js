const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Store rooms and their participants
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle joining a room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    console.log(`User ${userName} (${userId}) joining room ${roomId}`);
    
    // Leave any previous rooms
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    // Join the new room
    socket.join(roomId);

    // Store user info
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    rooms.get(roomId).set(userId, { socketId: socket.id, userName });

    // Notify other users in the room
    socket.to(roomId).emit('user-joined', { id: userId, name: userName });

    // Send existing participants to the new user
    const existingParticipants = [];
    rooms.get(roomId).forEach((userData, oderId) => {
      if (oderId !== userId) {
        existingParticipants.push({ id: oderId, name: userData.userName });
      }
    });
    
    socket.emit('room-participants', existingParticipants);

    // Store room ID and user ID in socket data
    socket.data.roomId = roomId;
    socket.data.userId = userId;
  });

  // Handle leaving a room
  socket.on('leave-room', ({ roomId, userId }) => {
    console.log(`User ${userId} leaving room ${roomId}`);
    
    socket.leave(roomId);
    
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(userId);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }

    socket.to(roomId).emit('user-left', { id: userId });
  });

  // Handle WebRTC offer
  socket.on('offer', ({ to, offer, from }) => {
    const roomId = socket.data.roomId;
    if (roomId && rooms.has(roomId)) {
      const targetUser = rooms.get(roomId).get(to);
      if (targetUser) {
        io.to(targetUser.socketId).emit('offer', { from, payload: offer });
      }
    }
  });

  // Handle WebRTC answer
  socket.on('answer', ({ to, answer, from }) => {
    const roomId = socket.data.roomId;
    if (roomId && rooms.has(roomId)) {
      const targetUser = rooms.get(roomId).get(to);
      if (targetUser) {
        io.to(targetUser.socketId).emit('answer', { from, payload: answer });
      }
    }
  });

  // Handle ICE candidate
  socket.on('ice-candidate', ({ to, candidate, from }) => {
    const roomId = socket.data.roomId;
    if (roomId && rooms.has(roomId)) {
      const targetUser = rooms.get(roomId).get(to);
      if (targetUser) {
        io.to(targetUser.socketId).emit('ice-candidate', { from, payload: candidate });
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const roomId = socket.data.roomId;
    const userId = socket.data.userId;

    if (roomId && userId && rooms.has(roomId)) {
      rooms.get(roomId).delete(userId);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
      socket.to(roomId).emit('user-left', { id: userId });
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
