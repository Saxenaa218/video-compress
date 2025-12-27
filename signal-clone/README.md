# Signal Clone

A secure messaging application built with React Native (Expo) and Node.js, featuring end-to-end encryption using the TweetNaCl cryptography library.

## Features

- 🔐 **End-to-End Encryption**: All messages are encrypted using TweetNaCl's authenticated encryption (NaCl box)
- 👤 **User Authentication**: JWT-based authentication with secure password hashing
- 💬 **Real-time Messaging**: WebSocket-powered instant message delivery
- 📱 **Cross-Platform**: Built with React Native for iOS, Android, and Web
- ⚡ **Typing Indicators**: See when the other person is typing
- 🔒 **Secure Key Storage**: Encryption keys stored securely using Expo SecureStore

## Project Structure

```
signal-clone/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Authentication middleware
│   │   ├── utils/          # Encryption utilities
│   │   └── socket.ts       # WebSocket handlers
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── mobile/                  # React Native (Expo) frontend
│   ├── app/                # Expo Router screens
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API and Socket services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Encryption & storage utilities
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator (optional)
- Expo Go app on your mobile device (for testing)

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd signal-clone/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Create a `.env` file (or use the existing one):
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be running at `http://localhost:3000`.

### Mobile App

1. Navigate to the mobile directory:
   ```bash
   cd signal-clone/mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `src/config.ts` to point to your backend:
   ```typescript
   export const API_URL = 'http://YOUR_LOCAL_IP:3000';
   export const WS_URL = 'http://YOUR_LOCAL_IP:3000';
   ```
   > Note: Use your computer's local IP address (not localhost) when testing on a physical device.

4. Start the Expo development server:
   ```bash
   npm start
   ```

5. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users/search?q=query` - Search users by username
- `GET /api/users/:id` - Get user by ID

### Conversations
- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create or get conversation with another user
- `GET /api/conversations/:id` - Get conversation details

### Messages
- `GET /api/messages/conversation/:id` - Get messages in a conversation
- `POST /api/messages` - Send an encrypted message

## Encryption

This app uses the Signal Protocol-inspired encryption scheme:

1. **Key Generation**: Each user gets a unique public/private key pair (X25519) on registration
2. **Message Encryption**: Messages are encrypted using NaCl box (Curve25519-XSalsa20-Poly1305)
3. **Key Storage**: Private keys are stored securely on the device using Expo SecureStore
4. **Server Storage**: Only encrypted messages are stored on the server

### Encryption Flow

```
Sender                                  Server                                  Receiver
  |                                       |                                       |
  |-- Encrypt(msg, recipientPubKey) ---->|                                       |
  |                                       |-- Store encrypted msg ------------->|
  |                                       |                                       |
  |                                       |<-- Fetch encrypted msg --------------|
  |                                       |                                       |
  |                                       |                    Decrypt(msg, senderPubKey)
```

## WebSocket Events

### Client -> Server
- `conversation:join` - Join a conversation room
- `conversation:leave` - Leave a conversation room
- `message:send` - Send an encrypted message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server -> Client
- `message:new` - New message received
- `notification:message` - Message notification
- `typing:start` - Typing indicator started
- `typing:stop` - Typing indicator stopped
- `user:online` - User came online
- `user:offline` - User went offline

## Testing

### Backend Tests
```bash
cd signal-clone/backend
npm test
```

## Security Considerations

1. **Production JWT Secret**: Always use a strong, random JWT secret in production
2. **HTTPS**: Use HTTPS in production for all API and WebSocket connections
3. **Key Backup**: Consider implementing secure key backup for account recovery
4. **Message Retention**: Implement message retention policies as needed

## Technologies Used

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM with SQLite
- Socket.io for WebSockets
- TweetNaCl for encryption
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React Native with Expo
- Expo Router for navigation
- TypeScript
- Socket.io-client
- TweetNaCl for encryption
- Expo SecureStore for secure storage
- AsyncStorage for regular storage

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
