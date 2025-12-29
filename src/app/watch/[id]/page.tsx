import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import { getMovieDetails } from '@/lib/tmdb';
import { getStreamForMovie } from '@/lib/streams';

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(parseInt(id, 10));
  
  return {
    title: movie ? `Watch ${movie.title} - Streamix` : 'Watch - Streamix',
    description: movie?.overview || 'Stream movies on Streamix',
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  
  if (isNaN(movieId)) {
    notFound();
  }

  const movie = await getMovieDetails(movieId);
  
  if (!movie) {
    notFound();
  }

  const stream = getStreamForMovie(movieId);

  return (
    <div className="min-h-screen bg-black">
      <VideoPlayer
        src={stream.url}
        title={movie.title}
      />
    </div>
  );
}
