'use client';

import React from 'react';

interface GameOverOverlayProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  score,
  highScore,
  isNewHighScore,
  onPlayAgain,
}) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg animate-fade-in">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl border border-red-500/50">
        <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h2>
        
        <div className="space-y-2 mb-6">
          <p className="text-xl text-white">
            Final Score: <span className="text-green-400 font-bold">{score}</span>
          </p>
          {isNewHighScore && (
            <p className="text-lg text-yellow-400 animate-pulse">
              🎉 New High Score! 🎉
            </p>
          )}
          <p className="text-gray-400">
            Best Score: <span className="text-purple-400">{highScore}</span>
          </p>
        </div>

        <button
          onClick={onPlayAgain}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
        >
          Play Again
        </button>
        
        <p className="mt-4 text-gray-500 text-sm">Press Enter to restart</p>
      </div>
    </div>
  );
};

export default GameOverOverlay;
