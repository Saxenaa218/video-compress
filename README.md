# React Native Messaging App

A real-time messaging application built with React Native (Expo) and Node.js backend, supporting text messages and file sharing.

## Features

- **User Authentication**: Register and login with username/password
- **Real-time Messaging**: Instant message delivery using WebSockets (Socket.io)
- **File Sharing**: Send and receive files of any type
- **Typing Indicators**: See when the other user is typing
- **Online Status**: Know when users are online/offline
- **Persistent Storage**: Messages and conversations are stored in SQLite database

## Tech Stack

### Frontend (Mobile)
- React Native with Expo
- React Navigation for routing
- Socket.io-client for real-time communication
- Axios for HTTP requests
- AsyncStorage for local data persistence
- Expo Document Picker for file selection

### Backend
- Node.js with Express
- Socket.io for WebSocket communication
- SQLite (better-sqlite3) for database
- Multer for file uploads
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
├── backend/
│   ├── index.js          # Express server with Socket.io
│   ├── package.json      # Backend dependencies
│   └── uploads/          # Uploaded files directory
│
├── mobile/
│   ├── App.js            # Main app entry point
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js    # Authentication context
│   │   ├── navigation/
│   │   │   └── AppNavigator.js   # Navigation configuration
│   │   ├── screens/
│   │   │   ├── LoginScreen.js         # Login screen
│   │   │   ├── RegisterScreen.js      # Registration screen
│   │   │   ├── ConversationsScreen.js # List of conversations
│   │   │   └── ChatScreen.js          # Chat/messaging screen
│   │   └── services/
│   │       ├── api.js     # API service with axios
│   │       └── socket.js  # Socket.io service
│   └── package.json       # Mobile app dependencies
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000`

### Mobile App Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Important**: Update the API URL in `src/services/api.js`:
   - For iOS Simulator: Use `http://localhost:3000`
   - For Android Emulator: Use `http://10.0.2.2:3000`
   - For physical device: Use your computer's IP address (e.g., `http://192.168.1.100:3000`)

4. Start the Expo development server:
   ```bash
   npm start
   ```

5. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search?q=query` - Search users by username

### Conversations
- `GET /api/conversations` - Get user's conversations
- `POST /api/conversations` - Create a new conversation

### Messages
- `GET /api/messages/:otherUserId` - Get messages with a user
- `POST /api/messages` - Send a text message
- `POST /api/upload` - Upload and send a file

## Socket Events

### Client → Server
- `join` - Join user's room for receiving messages
- `typing` - Notify that user is typing
- `stopTyping` - Notify that user stopped typing

### Server → Client
- `newMessage` - New message received
- `userOnline` - User came online
- `userOffline` - User went offline
- `userTyping` - Other user is typing
- `userStopTyping` - Other user stopped typing

## Environment Variables

### Backend
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens (**required** in production)
- `NODE_ENV` - Set to 'production' in production environment
- `CORS_ORIGINS` - Comma-separated list of allowed origins (required in production)
- `MAX_FILE_SIZE_MB` - Maximum file upload size in MB (default: 10)

### Mobile (Expo)
- `EXPO_PUBLIC_API_URL` - Backend API URL (e.g., 'http://192.168.1.100:3000')

## Security Considerations

For production deployment:
1. Set `JWT_SECRET` to a strong, random value (required in production)
2. Set `NODE_ENV=production` to enable production security settings
3. Configure `CORS_ORIGINS` to only allow your mobile app's origin
4. Use HTTPS for all communications
5. Implement rate limiting
6. Add input validation and sanitization
7. Use a production database (PostgreSQL, MySQL)
8. Store files in cloud storage (AWS S3, Google Cloud Storage)

## License

ISC
