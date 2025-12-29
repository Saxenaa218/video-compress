# Video Chat System

A real-time video chat application built with Next.js, React, and WebRTC technology for peer-to-peer communication and media streaming.

## Features

- **Real-time Video Calls**: Make video calls with other participants using WebRTC peer-to-peer connections
- **Group Meetings**: Support for multiple participants in a single room
- **Call Controls**: Mute/unmute microphone, toggle camera on/off
- **Screen Sharing**: Share your screen with other participants
- **Adaptive Bitrate Streaming**: Adjust video quality (Low/Medium/High) based on network conditions
- **Echo Cancellation**: Built-in audio processing with echo cancellation and noise suppression
- **Network Resilience**: Automatic ICE restart on connection failure
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Architecture

- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Styling**: Tailwind CSS
- **Real-time Communication**: WebRTC for peer-to-peer video/audio
- **Signaling Server**: Socket.io for WebRTC signaling

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd video-compress
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

### Running the Application

**Start the signaling server:**
```bash
npm run server
```

**Start the Next.js development server (in a new terminal):**
```bash
npm run dev
```

**Or run both simultaneously:**
```bash
npm run dev:all
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

1. Enter your name (optional)
2. Enter a room ID or click the refresh button to generate a new one
3. Click "Join Meeting" to join the video chat
4. Share the room ID with others to invite them
5. Use the controls at the bottom to:
   - Mute/unmute your microphone
   - Toggle your camera on/off
   - Share your screen
   - Adjust video quality
   - Leave the call

## Project Structure

```
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── page.tsx          # Main page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── VideoChat.tsx     # Main video chat component
│   │   ├── VideoGrid.tsx     # Grid layout for video tiles
│   │   ├── VideoTile.tsx     # Individual video tile
│   │   ├── ParticipantList.tsx # Participant list sidebar
│   │   ├── CallControls.tsx  # Call control buttons
│   │   └── JoinRoom.tsx      # Room joining form
│   ├── contexts/             # React contexts
│   │   └── VideoChatContext.tsx # Video chat state management
│   ├── lib/                  # Utility libraries
│   │   ├── webrtc.ts         # WebRTC service
│   │   └── signaling.ts      # Socket.io signaling service
│   └── types/                # TypeScript types
│       └── index.ts
├── server/                   # Signaling server
│   └── index.js              # Socket.io server
└── package.json
```

## WebRTC Configuration

The application uses the following WebRTC features:

- **ICE Servers**: Google STUN servers for NAT traversal
- **Audio Processing**: Echo cancellation, noise suppression, auto gain control
- **Video Constraints**: Configurable resolution (360p to 1080p) and frame rate
- **Connection Resilience**: ICE restart on connection failure

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SIGNALING_SERVER` | WebSocket URL for signaling server | `ws://localhost:3001` |
| `CLIENT_URL` | Client URL for CORS (signaling server) | `http://localhost:3000` |
| `PORT` | Signaling server port | `3001` |

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy

### Vercel (Frontend)

The easiest way to deploy the Next.js frontend is to use the [Vercel Platform](https://vercel.com/new).

### Signaling Server

The signaling server can be deployed to any Node.js hosting platform like:
- Railway
- Render
- Heroku
- AWS/GCP/Azure

Make sure to update the `NEXT_PUBLIC_SIGNALING_SERVER` environment variable to point to your deployed signaling server URL.
