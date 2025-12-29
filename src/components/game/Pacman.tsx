'use client';

import React from 'react';
import { Position, Direction } from '@/types/game';
import { CELL_SIZE } from '@/utils/maze';

interface PacmanProps {
  position: Position;
  direction: Direction;
}

export default function Pacman({ position, direction }: PacmanProps) {
  const rotation = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  };

  return (
    <div
      className="absolute z-10 transition-all duration-100"
      style={{
        left: position.x * CELL_SIZE,
        top: position.y * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
        transform: `rotate(${rotation[direction]}deg)`,
      }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full animate-chomp">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="#FACC15"
        />
        {/* Mouth */}
        <path
          d="M12 12 L24 4 L24 20 Z"
          fill="black"
          className="origin-center"
        />
        {/* Eye */}
        <circle cx="12" cy="7" r="2" fill="black" />
      </svg>
    </div>
  );
}
