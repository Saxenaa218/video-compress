'use client';

import React from 'react';
import { CellType } from '@/types/game';
import { CELL_SIZE } from '@/utils/maze';

interface CellProps {
  type: CellType;
  x: number;
  y: number;
}

export default function Cell({ type, x, y }: CellProps) {
  const style = {
    position: 'absolute' as const,
    left: x * CELL_SIZE,
    top: y * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
  };

  if (type === 'wall') {
    return (
      <div
        style={style}
        className="bg-blue-900 border border-blue-700"
      />
    );
  }

  if (type === 'pellet') {
    return (
      <div style={style} className="flex items-center justify-center">
        <div className="w-2 h-2 bg-yellow-200 rounded-full" />
      </div>
    );
  }

  if (type === 'power-pellet') {
    return (
      <div style={style} className="flex items-center justify-center">
        <div className="w-4 h-4 bg-yellow-300 rounded-full animate-pulse" />
      </div>
    );
  }

  if (type === 'ghost-house') {
    return (
      <div
        style={style}
        className="bg-gray-900 border border-gray-800"
      />
    );
  }

  // Empty cell
  return <div style={style} />;
}
