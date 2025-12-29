'use client';

import React, { useState } from 'react';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import {
  GameBoard,
  ScorePanel,
  GameControls,
  SettingsPanel,
  GameOverOverlay,
} from '@/components';
import { GameSettings, DEFAULT_SETTINGS } from '@/types/game';

const SnakeGame: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  const {
    gameState,
    changeDirection,
    startGame,
    pauseGame,
    resetGame,
  } = useSnakeGame(settings);

  const { snake, food, score, level, highScore, isGameOver, isPaused } = gameState;
  
  // New high score is when current score equals the high score and it's greater than the initial snake length * points
  // This means the player beat a previous high score
  const isNewHighScore = isGameOver && score === highScore && score > 0;

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    // Reset game if board size changes
    if (
      newSettings.boardWidth !== settings.boardWidth ||
      newSettings.boardHeight !== settings.boardHeight
    ) {
      resetGame();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 gap-6">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-green-400 tracking-wider">
        🐍 Snake Game
      </h1>

      {/* Score Panel */}
      <ScorePanel score={score} level={level} highScore={highScore} />

      {/* Game Board Container */}
      <div className="relative">
        <GameBoard
          snake={snake}
          food={food}
          settings={settings}
          isGameOver={isGameOver}
        />
        
        {/* Game Over Overlay */}
        {isGameOver && (
          <GameOverOverlay
            score={score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            onPlayAgain={resetGame}
          />
        )}

        {/* Paused Overlay */}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <p className="text-2xl text-white font-semibold mb-4">Paused</p>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
              >
                Resume
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <GameControls
        isPaused={isPaused}
        isGameOver={isGameOver}
        onStart={startGame}
        onPause={pauseGame}
        onReset={resetGame}
        onDirectionChange={changeDirection}
      />

      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="text-gray-400 hover:text-white text-sm underline transition-colors"
      >
        {showSettings ? 'Hide Settings' : 'Show Settings'}
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          disabled={!isPaused}
        />
      )}

      {/* Footer */}
      <footer className="text-gray-500 text-sm text-center mt-4">
        <p>Built with Next.js and React</p>
      </footer>
    </div>
  );
};

export default SnakeGame;
