'use client';

import React from 'react';
import { Ghost as GhostType } from '@/types/game';
import { CELL_SIZE } from '@/utils/maze';

interface GhostProps {
  ghost: GhostType;
  isPowerMode: boolean;
}

export default function Ghost({ ghost, isPowerMode }: GhostProps) {
  const { position, color, isScared, isEaten } = ghost;

  // Determine ghost color
  let displayColor = color;
  if (isEaten) {
    displayColor = 'transparent';
  } else if (isScared && isPowerMode) {
    displayColor = '#0000FF'; // Blue when scared
  }

  return (
    <div
      className={`absolute z-10 transition-all duration-100 ${isScared && isPowerMode ? 'animate-pulse' : ''}`}
      style={{
        left: position.x * CELL_SIZE,
        top: position.y * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full">
        {/* Ghost body */}
        <path
          d={`
            M 4 22
            L 4 12
            C 4 6 8 2 12 2
            C 16 2 20 6 20 12
            L 20 22
            L 17 19
            L 14 22
            L 12 20
            L 10 22
            L 7 19
            L 4 22
            Z
          `}
          fill={displayColor}
          stroke={isEaten ? '#FFFFFF' : 'none'}
          strokeWidth={isEaten ? 1 : 0}
        />
        {/* Eyes */}
        {!isEaten && (
          <>
            <ellipse cx="9" cy="10" rx="2.5" ry="3" fill="white" />
            <ellipse cx="15" cy="10" rx="2.5" ry="3" fill="white" />
            <circle cx="10" cy="10" r="1.5" fill={isScared && isPowerMode ? '#FF0000' : '#000'} />
            <circle cx="16" cy="10" r="1.5" fill={isScared && isPowerMode ? '#FF0000' : '#000'} />
          </>
        )}
        {/* Eaten ghost - just eyes */}
        {isEaten && (
          <>
            <ellipse cx="9" cy="10" rx="2" ry="2.5" fill="white" />
            <ellipse cx="15" cy="10" rx="2" ry="2.5" fill="white" />
            <circle cx="9" cy="10" r="1" fill="#000" />
            <circle cx="15" cy="10" r="1" fill="#000" />
          </>
        )}
        {/* Scared ghost face */}
        {isScared && isPowerMode && !isEaten && (
          <path
            d="M 7 15 L 9 14 L 11 15 L 13 14 L 15 15 L 17 14"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
}
