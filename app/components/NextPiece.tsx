'use client';

import React from 'react';
import { TETROMINOES, TetrominoType } from '../lib/constants';

interface NextPieceProps {
  type: TetrominoType;
}

export default function NextPiece({ type }: NextPieceProps) {
  const tetromino = TETROMINOES[type];
  const shape = tetromino.shape;
  const cellSize = 24;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-sm font-semibold mb-2 text-center">NEXT</h3>
      <div
        className="flex items-center justify-center"
        style={{
          width: 4 * cellSize,
          height: 4 * cellSize,
        }}
      >
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${shape[0].length}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${shape.length}, ${cellSize}px)`,
          }}
        >
          {shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ? tetromino.color : 'transparent',
                  boxShadow: cell
                    ? 'inset 0 0 8px rgba(255,255,255,0.3), inset 2px 2px 3px rgba(255,255,255,0.2)'
                    : 'none',
                  borderRadius: cell ? '2px' : '0',
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
