# GitHub Compressor

A desktop application that compresses videos to 9 MB, making them perfect for GitHub file uploads.

## Features

- 🎬 Simple drag-and-click interface
- 📦 Compresses videos to ~9 MB target size
- 🚀 Supports multiple video formats (MP4, MOV, AVI, MKV, WebM, FLV, WMV)
- 📊 Real-time compression progress
- 💾 Outputs optimized MP4 files

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Saxenaa218/video-compress.git
   cd video-compress
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

## Building for Distribution

Build for your platform:

```bash
# For macOS
npm run build:mac

# For Windows
npm run build:win

# For Linux
npm run build:linux

# For all platforms
npm run build
```

The built application will be available in the `dist` folder.

## How It Works

1. **Select a Video**: Click the drop zone to select a video file from your computer
2. **Compress**: Click "Compress to 9 MB" to start compression
3. **Save**: Choose where to save the compressed video
4. **Done**: Your video is now compressed and ready for GitHub!

## Technical Details

- Built with Electron for cross-platform desktop support
- Uses FFmpeg for video compression
- Dynamically calculates bitrate based on video duration to achieve target file size
- Preserves audio quality at 128 kbps

## Why 9 MB?

GitHub has a file size limit of 25 MB for uploads via the web interface, but smaller files are easier to manage and faster to upload. 9 MB is an optimal size that:
- Fits comfortably within GitHub's limits
- Maintains reasonable video quality
- Allows for quick uploads and downloads

## License

MIT
