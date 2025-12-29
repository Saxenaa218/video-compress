'use client';

import React from 'react';
import { GameState } from '@/types/game';
import { CELL_SIZE, MAZE_WIDTH, MAZE_HEIGHT } from '@/utils/maze';
import Pacman from './Pacman';
import Ghost from './Ghost';
import Cell from './Cell';

interface GameBoardProps {
  gameState: GameState;
}

export default function GameBoard({ gameState }: GameBoardProps) {
  const boardWidth = MAZE_WIDTH * CELL_SIZE;
  const boardHeight = MAZE_HEIGHT * CELL_SIZE;

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden border-4 border-blue-800"
      style={{ width: boardWidth, height: boardHeight }}
    >
      {/* Render maze cells */}
      {gameState.maze.map((row, y) =>
        row.map((cell, x) => (
          <Cell key={`${x}-${y}`} type={cell} x={x} y={y} />
        ))
      )}

      {/* Render ghosts */}
      {gameState.ghosts.map(ghost => (
        <Ghost
          key={ghost.id}
          ghost={ghost}
          isPowerMode={gameState.isPowerMode}
        />
      ))}

      {/* Render Pacman */}
      <Pacman
        position={gameState.pacman}
        direction={gameState.pacmanDirection}
      />

      {/* Pause overlay */}
      {gameState.isPaused && !gameState.isGameOver && !gameState.isWin && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 className="text-yellow-400 text-3xl font-bold mb-4 animate-pulse">
              PRESS SPACE TO START
            </h2>
            <p className="text-white text-sm">
              Use Arrow Keys or WASD to move
            </p>
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 className="text-red-500 text-4xl font-bold mb-4">GAME OVER</h2>
            <p className="text-white text-2xl mb-4">Score: {gameState.score}</p>
            <p className="text-yellow-400 animate-pulse">Press SPACE to restart</p>
          </div>
        </div>
      )}

      {/* Win overlay */}
      {gameState.isWin && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 className="text-green-400 text-4xl font-bold mb-4">YOU WIN!</h2>
            <p className="text-white text-2xl mb-4">Final Score: {gameState.score}</p>
            <p className="text-yellow-400 animate-pulse">Press SPACE to play again</p>
          </div>
        </div>
      )}
    </div>
  );
}
