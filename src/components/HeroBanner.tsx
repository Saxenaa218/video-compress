'use client';

import { Movie } from '@/types/movie';
import { getBackdropUrl } from '@/lib/tmdb';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeroBannerProps {
  movies: Movie[];
}

export default function HeroBanner({ movies }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const movie = movies[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      setImageLoaded(false);
    }, 8000);

    return () => clearInterval(interval);
  }, [movies.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setImageLoaded(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setImageLoaded(false);
  };

  if (!movie) return null;

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {movie.backdrop_path ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-[15%] left-4 md:left-12 max-w-2xl z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {movie.title}
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-6 line-clamp-3 drop-shadow">
          {movie.overview}
        </p>
        <div className="flex gap-4">
          <Link
            href={`/watch/${movie.id}`}
            className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Play size={20} className="fill-black" />
            Play
          </Link>
          <Link
            href={`/movie/${movie.id}`}
            className="flex items-center gap-2 bg-gray-500/70 hover:bg-gray-500/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors backdrop-blur-sm"
          >
            <Info size={20} />
            More Info
          </Link>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
        aria-label="Previous movie"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
        aria-label="Next movie"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setImageLoaded(false);
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to movie ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
