'use client';

import React from 'react';
import { Direction } from '@/types/game';

interface ControlsProps {
  onDirection: (dir: Direction) => void;
  onPause?: () => void;
}

export default function Controls({ onDirection }: ControlsProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2 md:hidden">
      <h3 className="text-white text-sm mb-2">Touch Controls</h3>
      <div className="grid grid-cols-3 gap-2">
        <div /> {/* Empty cell */}
        <button
          onClick={() => onDirection('up')}
          className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center text-white text-2xl hover:bg-gray-600 active:bg-gray-500 transition-colors"
          aria-label="Move up"
        >
          ↑
        </button>
        <div /> {/* Empty cell */}
        
        <button
          onClick={() => onDirection('left')}
          className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center text-white text-2xl hover:bg-gray-600 active:bg-gray-500 transition-colors"
          aria-label="Move left"
        >
          ←
        </button>
        <button
          onClick={() => onDirection('down')}
          className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center text-white text-2xl hover:bg-gray-600 active:bg-gray-500 transition-colors"
          aria-label="Move down"
        >
          ↓
        </button>
        <button
          onClick={() => onDirection('right')}
          className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center text-white text-2xl hover:bg-gray-600 active:bg-gray-500 transition-colors"
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  );
}
