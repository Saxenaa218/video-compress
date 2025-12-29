'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with game state
const Game = dynamic(() => import('@/components/game/Game'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-yellow-400 text-2xl animate-pulse">Loading Pacman...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-yellow-400 mb-2">
          🎮 PACMAN
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Eat all pellets and avoid the ghosts!
        </p>
        
        <div className="flex justify-center">
          <Game />
        </div>
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Built with Next.js and React</p>
        </footer>
      </div>
    </main>
  );
}
