# Audio Editor

A web-based audio editor built with Next.js that allows users to upload, play, and edit audio files directly in the browser.

## Features

- **Audio Upload**: Drag and drop or click to upload audio files
- **Multiple Format Support**: MP3, WAV, AAC, FLAC, OGG, WebM, M4A
- **Waveform Visualization**: Visual representation of audio using wavesurfer.js
- **Playback Controls**: Play, pause, skip forward/backward
- **Volume Control**: Adjustable volume slider
- **Playback Speed**: Change playback speed (0.5x - 2x)
- **Audio Selection**: Create regions on the waveform for editing
- **Trim & Export**: Trim selected portions and download as WAV

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Upload Audio**: Drag and drop an audio file onto the upload area, or click to browse
2. **Play Audio**: Use the play/pause button to control playback
3. **Adjust Settings**: Use the volume slider and speed buttons to customize playback
4. **Create Selection**: Click "Create Selection" to add a region on the waveform
5. **Edit Region**: Drag the region edges to adjust the selection
6. **Export**: Click "Trim & Download" to export the selected portion as a WAV file

## Tech Stack

- [Next.js 16](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [wavesurfer.js](https://wavesurfer.xyz) - Audio visualization and editing

## Build for Production

```bash
npm run build
npm start
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
