import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Play, Star, Clock, Calendar, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieRow from '@/components/MovieRow';
import { getMovieDetails, getPopularMovies, getBackdropUrl, getImageUrl } from '@/lib/tmdb';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(parseInt(id, 10));
  
  return {
    title: movie ? `${movie.title} - Streamix` : 'Movie - Streamix',
    description: movie?.overview || 'Watch movies on Streamix',
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  
  if (isNaN(movieId)) {
    notFound();
  }

  const [movie, similarMovies] = await Promise.all([
    getMovieDetails(movieId),
    getPopularMovies(),
  ]);
  
  if (!movie) {
    notFound();
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const runtime = movie.runtime 
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` 
    : '';

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Hero section with backdrop */}
      <div className="relative h-[70vh] md:h-[80vh]">
        {/* Background */}
        <div className="absolute inset-0">
          {movie.backdrop_path ? (
            <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent" />
        </div>

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-20 left-4 md:left-12 z-20 flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>

        {/* Content */}
        <div className="absolute bottom-12 left-4 md:left-12 right-4 md:right-12 z-10 flex gap-8">
          {/* Poster */}
          <div className="hidden md:block flex-shrink-0 w-64">
            {movie.poster_path ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-center px-4">{movie.title}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-gray-300 text-lg italic mb-4">
                &quot;{movie.tagline}&quot;
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
              {year && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{year}</span>
                </div>
              )}
              {runtime && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{runtime}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
                <span className="text-gray-500">({movie.vote_count} votes)</span>
              </div>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-700/80 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-gray-200 text-lg mb-8 line-clamp-4 md:line-clamp-none">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href={`/watch/${movie.id}`}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Play size={20} className="fill-white" />
                Play Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Similar movies */}
      <div className="mt-8">
        <MovieRow
          title="More Like This"
          movies={similarMovies.filter((m) => m.id !== movieId).slice(0, 10)}
        />
      </div>

      <Footer />
    </div>
  );
}
