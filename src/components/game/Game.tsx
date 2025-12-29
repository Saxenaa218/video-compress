'use client';

import React, { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameBoard from './GameBoard';
import ScoreDisplay from './ScoreDisplay';
import Controls from './Controls';

export default function Game() {
  const { gameState, startGame, restartGame, setDirection } = useGameState();

  // Handle space bar to start/restart
  useEffect(() => {
    const handleSpace = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState.isGameOver || gameState.isWin) {
          restartGame();
        } else if (gameState.isPaused) {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [gameState.isGameOver, gameState.isWin, gameState.isPaused, startGame, restartGame]);

  return (
    <div className="flex flex-col items-center">
      <ScoreDisplay
        score={gameState.score}
        lives={gameState.lives}
        level={gameState.level}
        isPowerMode={gameState.isPowerMode}
      />
      
      <GameBoard gameState={gameState} />
      
      <Controls onDirection={setDirection} />
      
      <div className="mt-4 text-center text-gray-400 text-sm">
        <p className="mb-1">
          <span className="text-yellow-400">Arrow Keys</span> or{' '}
          <span className="text-yellow-400">WASD</span> to move
        </p>
        <p className="mb-1">
          <span className="text-yellow-400">Space</span> to pause/start
        </p>
        <p>
          <span className="text-yellow-400">M</span> to toggle sound
        </p>
      </div>
      
      {(gameState.isGameOver || gameState.isWin) && (
        <button
          onClick={restartGame}
          className="mt-4 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
}
