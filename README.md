# Video Compressor

A full-stack web application for uploading and compressing videos, built with the MERN stack using Next.js as the primary framework.

## Features

- **Video Upload**: Drag-and-drop or click to upload video files
- **Video Compression**: Compress videos using FFmpeg with optimized settings
- **Progress Tracking**: Real-time status updates for compression progress
- **Download**: Download compressed videos directly from the browser
- **Responsive Design**: Beautiful UI that works on desktop and mobile
- **Dark Mode Support**: Automatic dark mode based on system preferences

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Video Processing**: FFmpeg (via child_process)
- **File Handling**: Next.js FormData, UUID

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [FFmpeg](https://ffmpeg.org/) (for video compression)

### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from [FFmpeg website](https://ffmpeg.org/download.html) and add to PATH.

## Getting Started

1. **Clone the repository:**
```bash
git clone <repository-url>
cd video-compress
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and configure your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/video-compress
```

4. **Start MongoDB** (if running locally):
```bash
mongod
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/       # Video upload endpoint
│   │   │   ├── compress/     # Video compression endpoint
│   │   │   ├── videos/       # List and delete videos
│   │   │   └── download/     # Download compressed videos
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── VideoUpload.tsx   # Upload component with drag-and-drop
│   │   └── VideoList.tsx     # Video list with actions
│   ├── lib/
│   │   └── mongodb.ts        # MongoDB connection utility
│   └── models/
│       └── Video.ts          # Mongoose video schema
├── uploads/                   # Uploaded videos (gitignored)
├── compressed/                # Compressed videos (gitignored)
├── .env.example               # Example environment variables
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload a video file |
| POST | `/api/compress` | Start video compression |
| GET | `/api/videos` | List all videos |
| DELETE | `/api/videos?id=<id>` | Delete a video |
| GET | `/api/download?id=<id>&type=<type>` | Download a video |

## Compression Settings

The application uses the following FFmpeg settings for compression:

- **Video Codec**: H.264 (libx264)
- **CRF (Constant Rate Factor)**: 28 (good balance between quality and size)
- **Preset**: Medium (balanced encoding speed)
- **Audio Codec**: AAC at 128kbps
- **Fast Start**: Enabled for web streaming

## Supported Formats

- MP4
- WebM
- MOV (QuickTime)
- AVI
- MKV

## File Size Limit

Maximum upload size: 500MB

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
