// Sample HLS streams for demonstration purposes
// These are public test streams that support adaptive bitrate streaming

export interface StreamSource {
  id: string;
  name: string;
  url: string;
  description: string;
  thumbnail?: string;
}

// Public HLS test streams
export const HLS_STREAMS: StreamSource[] = [
  {
    id: 'bbb',
    name: 'Big Buck Bunny',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'A large and lovable bunny deals with three bullying rodents.',
    thumbnail: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png'
  },
  {
    id: 'sintel',
    name: 'Sintel',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    description: 'A lonely young woman helps and befriends a dragon.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sintel-screenshot-dragon.jpg/1200px-Sintel-screenshot-dragon.jpg'
  },
  {
    id: 'tears',
    name: 'Tears of Steel',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    description: 'Warriors and scientists battle robots in a post-apocalyptic world.',
    thumbnail: 'https://mango.blender.org/wp-content/uploads/2013/05/poster_small.jpg'
  }
];

// Map movie IDs to stream sources
// In a real application, this would be a database lookup
export function getStreamForMovie(movieId: number): StreamSource {
  // Use modulo to cycle through available streams
  const streamIndex = movieId % HLS_STREAMS.length;
  return HLS_STREAMS[streamIndex];
}

// Get all available streams
export function getAllStreams(): StreamSource[] {
  return HLS_STREAMS;
}
