import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import { searchMovies, getPopularMovies } from '@/lib/tmdb';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  
  return {
    title: query ? `Search: ${query} - Streamix` : 'Search - Streamix',
    description: query 
      ? `Search results for "${query}" on Streamix` 
      : 'Search movies on Streamix',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  
  const movies = query 
    ? await searchMovies(query)
    : await getPopularMovies();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            {query ? `Search Results for "${query}"` : 'Browse All Movies'}
          </h1>
          
          <p className="text-gray-400 mb-8">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'} found
          </p>

          {movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">
                No movies found for &quot;{query}&quot;
              </p>
              <p className="text-gray-500">
                Try searching for something else
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
