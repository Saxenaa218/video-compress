'use client';

import React from 'react';

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onPause: () => void;
  isPaused: boolean;
  isGameOver: boolean;
}

export default function Controls({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onPause,
  isPaused,
  isGameOver,
}: ControlsProps) {
  const buttonClass =
    'w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-lg text-white font-bold text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-sm font-semibold mb-3 text-center">CONTROLS</h3>
      
      {/* Touch controls for mobile */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <button
          className={buttonClass}
          onClick={onRotate}
          disabled={isGameOver}
          aria-label="Rotate"
        >
          ↻
        </button>
        <div className="flex gap-2">
          <button
            className={buttonClass}
            onClick={onMoveLeft}
            disabled={isGameOver}
            aria-label="Move Left"
          >
            ←
          </button>
          <button
            className={buttonClass}
            onClick={onHardDrop}
            disabled={isGameOver}
            aria-label="Hard Drop"
          >
            ⬇
          </button>
          <button
            className={buttonClass}
            onClick={onMoveRight}
            disabled={isGameOver}
            aria-label="Move Right"
          >
            →
          </button>
        </div>
        <button
          className={`${buttonClass} w-full max-w-[180px]`}
          onClick={onSoftDrop}
          disabled={isGameOver}
          aria-label="Soft Drop"
        >
          ↓
        </button>
      </div>

      <button
        className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white font-semibold transition-colors"
        onClick={onPause}
        disabled={isGameOver}
      >
        {isPaused ? 'RESUME' : 'PAUSE'}
      </button>

      {/* Keyboard instructions */}
      <div className="mt-4 text-gray-400 text-xs space-y-1">
        <p><span className="text-gray-300">←/→ or A/D:</span> Move</p>
        <p><span className="text-gray-300">↑ or W:</span> Rotate</p>
        <p><span className="text-gray-300">↓ or S:</span> Soft Drop</p>
        <p><span className="text-gray-300">Space:</span> Hard Drop</p>
        <p><span className="text-gray-300">P/Esc:</span> Pause</p>
      </div>
    </div>
  );
}
