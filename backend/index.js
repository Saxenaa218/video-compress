const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

// Initialize database
const Database = require('better-sqlite3');
const db = new Database('./chat.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    senderId TEXT NOT NULL,
    receiverId TEXT NOT NULL,
    content TEXT,
    fileUrl TEXT,
    fileName TEXT,
    fileType TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users(id),
    FOREIGN KEY (receiverId) REFERENCES users(id)
  );
  
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user1Id TEXT NOT NULL,
    user2Id TEXT NOT NULL,
    lastMessageAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1Id) REFERENCES users(id),
    FOREIGN KEY (user2Id) REFERENCES users(id)
  );
`);

const app = express();
const server = http.createServer(app);

// CORS configuration - restrict origins in production
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:19006', 'http://localhost:8081'];

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? ALLOWED_ORIGINS : '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ALLOWED_ORIGINS : '*'
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting configuration
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' }
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many file uploads, please try again later.' }
});

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File size limit: 10MB default, configurable via environment
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10) * 1024 * 1024;

const upload = multer({ 
  storage,
  limits: { fileSize: MAX_FILE_SIZE }
});

// JWT secret - require proper configuration in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET environment variable is required in production');
  process.exit(1);
}
const jwtSecret = JWT_SECRET || 'development-secret-change-in-production';

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)').run(userId, username, hashedPassword);
    
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
    
    res.json({ token, userId, username });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
    
    res.json({ token, userId: user.id, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// User routes
app.get('/api/users', authMiddleware, (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, createdAt FROM users WHERE id != ?').all(req.userId);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

app.get('/api/users/search', authMiddleware, (req, res) => {
  try {
    const { q } = req.query;
    const users = db.prepare('SELECT id, username, createdAt FROM users WHERE username LIKE ? AND id != ?').all(`%${q}%`, req.userId);
    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Conversation routes
app.get('/api/conversations', authMiddleware, (req, res) => {
  try {
    const conversations = db.prepare(`
      SELECT c.*, 
        CASE WHEN c.user1Id = ? THEN u2.username ELSE u1.username END as otherUsername,
        CASE WHEN c.user1Id = ? THEN c.user2Id ELSE c.user1Id END as otherUserId
      FROM conversations c
      LEFT JOIN users u1 ON c.user1Id = u1.id
      LEFT JOIN users u2 ON c.user2Id = u2.id
      WHERE c.user1Id = ? OR c.user2Id = ?
      ORDER BY c.lastMessageAt DESC
    `).all(req.userId, req.userId, req.userId, req.userId);
    
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

app.post('/api/conversations', authMiddleware, (req, res) => {
  try {
    const { otherUserId } = req.body;
    
    // Check if conversation already exists
    const existingConversation = db.prepare(`
      SELECT * FROM conversations 
      WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)
    `).get(req.userId, otherUserId, otherUserId, req.userId);
    
    if (existingConversation) {
      return res.json(existingConversation);
    }
    
    const conversationId = uuidv4();
    db.prepare('INSERT INTO conversations (id, user1Id, user2Id) VALUES (?, ?, ?)').run(conversationId, req.userId, otherUserId);
    
    const conversation = db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversationId);
    res.json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Message routes
app.get('/api/messages/:otherUserId', authMiddleware, (req, res) => {
  try {
    const { otherUserId } = req.params;
    const messages = db.prepare(`
      SELECT m.*, u.username as senderUsername
      FROM messages m
      LEFT JOIN users u ON m.senderId = u.id
      WHERE (m.senderId = ? AND m.receiverId = ?) OR (m.senderId = ? AND m.receiverId = ?)
      ORDER BY m.createdAt ASC
    `).all(req.userId, otherUserId, otherUserId, req.userId);
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

app.post('/api/messages', authMiddleware, (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver and content are required' });
    }
    
    const messageId = uuidv4();
    const createdAt = new Date().toISOString();
    
    db.prepare('INSERT INTO messages (id, senderId, receiverId, content, createdAt) VALUES (?, ?, ?, ?, ?)').run(messageId, req.userId, receiverId, content, createdAt);
    
    // Update conversation timestamp
    db.prepare(`
      UPDATE conversations SET lastMessageAt = ? 
      WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)
    `).run(createdAt, req.userId, receiverId, receiverId, req.userId);
    
    const message = db.prepare('SELECT m.*, u.username as senderUsername FROM messages m LEFT JOIN users u ON m.senderId = u.id WHERE m.id = ?').get(messageId);
    
    // Emit to socket
    io.to(receiverId).emit('newMessage', message);
    
    res.json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// File upload route
app.post('/api/upload', authMiddleware, uploadLimiter, upload.single('file'), (req, res) => {
  try {
    const { receiverId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const messageId = uuidv4();
    const createdAt = new Date().toISOString();
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;
    
    db.prepare('INSERT INTO messages (id, senderId, receiverId, fileUrl, fileName, fileType, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(messageId, req.userId, receiverId, fileUrl, fileName, fileType, createdAt);
    
    // Update conversation timestamp
    db.prepare(`
      UPDATE conversations SET lastMessageAt = ? 
      WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)
    `).run(createdAt, req.userId, receiverId, receiverId, req.userId);
    
    const message = db.prepare('SELECT m.*, u.username as senderUsername FROM messages m LEFT JOIN users u ON m.senderId = u.id WHERE m.id = ?').get(messageId);
    
    // Emit to socket
    io.to(receiverId).emit('newMessage', message);
    
    res.json(message);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Socket.io connection handling
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    io.emit('userOnline', userId);
    console.log(`User ${userId} joined`);
  });
  
  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('userOffline', userId);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
  
  socket.on('typing', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('userTyping', { senderId });
  });
  
  socket.on('stopTyping', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('userStopTyping', { senderId });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
