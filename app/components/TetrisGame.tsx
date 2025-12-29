'use client';

import React, { useState } from 'react';
import { useTetris, GameSettings } from '../hooks/useTetris';
import GameBoard from './GameBoard';
import NextPiece from './NextPiece';
import ScoreBoard from './ScoreBoard';
import Controls from './Controls';
import GameSettingsComponent from './GameSettings';
import GameOverlay from './GameOverlay';

export default function TetrisGame() {
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    ghostPieceEnabled: true,
    startLevel: 0,
  });
  const [hasStarted, setHasStarted] = useState(false);

  const {
    gameState,
    startGame,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    togglePause,
    ghostPieceEnabled,
  } = useTetris(settings);

  const handleStartGame = () => {
    startGame();
    setHasStarted(true);
  };

  const handleTogglePause = () => {
    if (!hasStarted) {
      handleStartGame();
    } else {
      togglePause();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">TETRIS</h1>
      <p className="text-gray-400 text-sm mb-6">Stack blocks, clear lines, beat your high score!</p>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left panel - Settings (desktop only) */}
        <div className="hidden lg:flex flex-col gap-4 w-48">
          <GameSettingsComponent
            soundEnabled={settings.soundEnabled}
            onSoundToggle={() =>
              setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
            }
            ghostPieceEnabled={settings.ghostPieceEnabled}
            onGhostPieceToggle={() =>
              setSettings((s) => ({ ...s, ghostPieceEnabled: !s.ghostPieceEnabled }))
            }
            startLevel={settings.startLevel}
            onStartLevelChange={(level) =>
              setSettings((s) => ({ ...s, startLevel: level }))
            }
            isGameActive={hasStarted && !gameState.isGameOver}
          />
        </div>

        {/* Main game board */}
        <div className="relative">
          <GameBoard
            board={gameState.board}
            currentPiece={gameState.currentPiece}
            ghostPieceEnabled={ghostPieceEnabled}
          />
          <GameOverlay
            isGameOver={gameState.isGameOver}
            isPaused={gameState.isPaused}
            score={gameState.score}
            onRestart={gameState.isPaused && hasStarted ? togglePause : handleStartGame}
            hasStarted={hasStarted}
          />
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4 w-48">
          <NextPiece type={gameState.nextPiece} />
          <ScoreBoard
            score={gameState.score}
            level={gameState.level}
            linesCleared={gameState.linesCleared}
          />
          <div className="lg:hidden">
            <GameSettingsComponent
              soundEnabled={settings.soundEnabled}
              onSoundToggle={() =>
                setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
              }
              ghostPieceEnabled={settings.ghostPieceEnabled}
              onGhostPieceToggle={() =>
                setSettings((s) => ({ ...s, ghostPieceEnabled: !s.ghostPieceEnabled }))
              }
              startLevel={settings.startLevel}
              onStartLevelChange={(level) =>
                setSettings((s) => ({ ...s, startLevel: level }))
              }
              isGameActive={hasStarted && !gameState.isGameOver}
            />
          </div>
          <Controls
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
            onRotate={rotate}
            onSoftDrop={softDrop}
            onHardDrop={hardDrop}
            onPause={handleTogglePause}
            isPaused={gameState.isPaused}
            isGameOver={gameState.isGameOver}
          />
        </div>
      </div>

      <footer className="mt-8 text-gray-500 text-sm text-center">
        <p>Use keyboard or touch controls to play</p>
        <p className="mt-1">Built with Next.js and React</p>
      </footer>
    </div>
  );
}
