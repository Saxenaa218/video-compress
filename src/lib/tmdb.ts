import { Movie, MovieDetails, MovieResponse } from '@/types/movie';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

async function fetchFromTMDB<T>(endpoint: string): Promise<T | null> {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured, using mock data');
    return null;
  }
  
  try {
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return null;
  }
}

// Mock movie data for when TMDB API is not configured
const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Big Buck Bunny',
    overview: 'A large and lovable bunny deals with three bullying rodents who are determined to squash his happiness.',
    poster_path: null,
    backdrop_path: null,
    release_date: '2008-04-10',
    vote_average: 7.5,
    vote_count: 1200,
    genre_ids: [16, 35, 10751],
    original_language: 'en',
    popularity: 85.5,
    adult: false
  },
  {
    id: 2,
    title: 'Sintel',
    overview: 'A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. But when the dragon is snatched by an adult dragon, Sintel decides to embark on a dangerous quest to find her lost friend.',
    poster_path: null,
    backdrop_path: null,
    release_date: '2010-09-30',
    vote_average: 7.8,
    vote_count: 980,
    genre_ids: [16, 14, 18],
    original_language: 'en',
    popularity: 72.3,
    adult: false
  },
  {
    id: 3,
    title: 'Tears of Steel',
    overview: 'A group of warriors and scientists, led by a man haunted by his past, engage in a battle with robots threatening to destroy what remains of the human race.',
    poster_path: null,
    backdrop_path: null,
    release_date: '2012-09-26',
    vote_average: 6.9,
    vote_count: 650,
    genre_ids: [28, 878, 18],
    original_language: 'en',
    popularity: 65.8,
    adult: false
  },
  {
    id: 4,
    title: 'Elephants Dream',
    overview: 'Friends Proog and Emo journey inside the fantastic and surreal confines of a machine which is their own universe.',
    poster_path: null,
    backdrop_path: null,
    release_date: '2006-03-24',
    vote_average: 6.5,
    vote_count: 520,
    genre_ids: [16, 878],
    original_language: 'en',
    popularity: 58.2,
    adult: false
  },
  {
    id: 5,
    title: 'Caminandes: Llama Drama',
    overview: 'A stubborn llama attempts to cross a road while a car is approaching.',
    poster_path: null,
    backdrop_path: null,
    release_date: '2013-11-11',
    vote_average: 7.2,
    vote_count: 380,
    genre_ids: [16, 35],
    original_language: 'en',
    popularity: 45.6,
    adult: false
  },
  {
    id: 6,
    title: 'Cosmos Laundromat',
    overview: 'On a deserted island, a suicidal sheep named Franck meets a stranger who tells him about a machine that offers free passes to parallel universes.',
    poster_path: null,
    backdrop_path: null,
    release_date: '2015-08-10',
    vote_average: 7.4,
    vote_count: 290,
    genre_ids: [16, 14, 18],
    original_language: 'en',
    popularity: 42.1,
    adult: false
  }
];

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<MovieResponse>('/movie/popular');
  return data?.results || mockMovies;
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<MovieResponse>('/trending/movie/week');
  return data?.results || mockMovies;
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<MovieResponse>('/movie/top_rated');
  return data?.results || mockMovies;
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<MovieResponse>('/movie/upcoming');
  return data?.results || mockMovies;
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<MovieResponse>('/movie/now_playing');
  return data?.results || mockMovies;
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails | null> {
  const data = await fetchFromTMDB<MovieDetails>(`/movie/${movieId}`);
  if (data) return data;
  
  // Return mock details for mock movies
  const mockMovie = mockMovies.find(m => m.id === movieId);
  if (mockMovie) {
    return {
      ...mockMovie,
      runtime: 120,
      genres: [{ id: 16, name: 'Animation' }],
      tagline: 'Experience the story',
      status: 'Released',
      budget: 0,
      revenue: 0,
      production_companies: []
    };
  }
  
  return null;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    return mockMovies.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.overview.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
      { next: { revalidate: 300 } }
    );
    
    if (!response.ok) throw new Error('Search failed');
    
    const data: MovieResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
