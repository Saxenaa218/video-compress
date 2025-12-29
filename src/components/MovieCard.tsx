'use client';

import { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/tmdb';
import { Play, Star, Info } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const posterUrl = movie.poster_path && !imageError
    ? getImageUrl(movie.poster_path, 'w500')
    : null;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  return (
    <div
      className="relative group rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 hover:scale-105 hover:z-10 shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="aspect-[2/3] relative">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-gray-500 text-lg font-medium text-center px-4">
              {movie.title}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Hover content */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
          {movie.title}
        </h3>
        {year && (
          <p className="text-gray-300 text-sm mb-3">{year}</p>
        )}
        
        <div className="flex gap-2">
          <Link
            href={`/watch/${movie.id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md transition-colors"
          >
            <Play size={16} />
            <span className="text-sm font-medium">Watch</span>
          </Link>
          <Link
            href={`/movie/${movie.id}`}
            className="flex items-center justify-center bg-gray-600/80 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
            aria-label={`More info about ${movie.title}`}
          >
            <Info size={16} />
          </Link>
        </div>
      </div>

      {/* Title for non-hover state */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-white font-medium text-sm line-clamp-1">
          {movie.title}
        </h3>
      </div>
    </div>
  );
}
