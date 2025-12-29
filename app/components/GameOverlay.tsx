'use client';

import React from 'react';

interface GameOverlayProps {
  isGameOver: boolean;
  isPaused: boolean;
  score: number;
  onRestart: () => void;
  hasStarted: boolean;
}

export default function GameOverlay({
  isGameOver,
  isPaused,
  score,
  onRestart,
  hasStarted,
}: GameOverlayProps) {
  if (!isGameOver && !isPaused && hasStarted) return null;

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 rounded-lg">
      <div className="text-center p-6">
        {isGameOver ? (
          <>
            <h2 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h2>
            <p className="text-white text-xl mb-6">
              Final Score: <span className="text-yellow-400 font-bold">{score.toLocaleString()}</span>
            </p>
          </>
        ) : isPaused ? (
          <h2 className="text-4xl font-bold text-yellow-400 mb-6">PAUSED</h2>
        ) : (
          <>
            <h2 className="text-4xl font-bold text-white mb-4">TETRIS</h2>
            <p className="text-gray-400 mb-6">Classic Block Puzzle Game</p>
          </>
        )}
        
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-lg transition-colors"
        >
          {isGameOver ? 'PLAY AGAIN' : isPaused ? 'RESUME' : 'START GAME'}
        </button>
        
        {!hasStarted && (
          <p className="text-gray-500 text-sm mt-4">Press ENTER to start</p>
        )}
      </div>
    </div>
  );
}
