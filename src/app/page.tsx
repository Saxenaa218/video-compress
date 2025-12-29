import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';
import {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from '@/lib/tmdb';

export default async function Home() {
  const [popular, trending, topRated, nowPlaying, upcoming] = await Promise.all([
    getPopularMovies(),
    getTrendingMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
  ]);

  // Use trending movies for the hero banner
  const heroMovies = trending.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main>
        {/* Hero Banner */}
        <HeroBanner movies={heroMovies} />

        {/* Movie Rows */}
        <div className="-mt-32 relative z-10">
          <section id="trending">
            <MovieRow title="Trending Now" movies={trending} />
          </section>
          
          <section id="movies">
            <MovieRow title="Popular on Streamix" movies={popular} />
          </section>
          
          <MovieRow title="Top Rated" movies={topRated} />
          
          <section id="new">
            <MovieRow title="Now Playing" movies={nowPlaying} />
          </section>
          
          <MovieRow title="Coming Soon" movies={upcoming} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
