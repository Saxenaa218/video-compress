'use client';

import React from 'react';
import { Direction } from '@/types/game';

interface GameControlsProps {
  isPaused: boolean;
  isGameOver: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDirectionChange: (direction: Direction) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  isPaused,
  isGameOver,
  onStart,
  onPause,
  onReset,
  onDirectionChange,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Action Buttons */}
      <div className="flex gap-4">
        {isGameOver ? (
          <button
            onClick={onReset}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            Play Again
          </button>
        ) : isPaused ? (
          <button
            onClick={onStart}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            Start
          </button>
        ) : (
          <button
            onClick={onPause}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            Pause
          </button>
        )}
        <button
          onClick={onReset}
          className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          Reset
        </button>
      </div>

      {/* Mobile Controls */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        <button
          onClick={() => onDirectionChange('UP')}
          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-2xl font-bold shadow-lg active:scale-95 transition-transform"
          aria-label="Move Up"
        >
          ↑
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onDirectionChange('LEFT')}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-2xl font-bold shadow-lg active:scale-95 transition-transform"
            aria-label="Move Left"
          >
            ←
          </button>
          <button
            onClick={() => onDirectionChange('DOWN')}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-2xl font-bold shadow-lg active:scale-95 transition-transform"
            aria-label="Move Down"
          >
            ↓
          </button>
          <button
            onClick={() => onDirectionChange('RIGHT')}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-2xl font-bold shadow-lg active:scale-95 transition-transform"
            aria-label="Move Right"
          >
            →
          </button>
        </div>
      </div>

      {/* Keyboard Instructions */}
      <div className="hidden md:block text-center text-gray-400 text-sm">
        <p>Use Arrow Keys or WASD to move</p>
        <p>Space to pause • Enter to start/restart</p>
      </div>
    </div>
  );
};

export default GameControls;
