'use client';

import React, { useMemo } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from '../lib/constants';
import { Tetromino, getHardDropPosition } from '../lib/gameLogic';

interface GameBoardProps {
  board: (string | null)[][];
  currentPiece: Tetromino | null;
  ghostPieceEnabled: boolean;
}

export default function GameBoard({ board, currentPiece, ghostPieceEnabled }: GameBoardProps) {
  // Calculate ghost piece position
  const ghostPosition = useMemo(() => {
    if (!currentPiece || !ghostPieceEnabled) return null;
    const dropDistance = getHardDropPosition(board, currentPiece);
    return currentPiece.position.y + dropDistance;
  }, [board, currentPiece, ghostPieceEnabled]);

  // Merge current piece with board for rendering
  const displayBoard = useMemo(() => {
    const mergedBoard = board.map((row) => row.map((cell) => ({ color: cell, isGhost: false })));

    // Draw ghost piece first
    if (currentPiece && ghostPieceEnabled && ghostPosition !== null) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = ghostPosition + y;
            const boardX = currentPiece.position.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              mergedBoard[boardY][boardX] = { color: currentPiece.color, isGhost: true };
            }
          }
        }
      }
    }

    // Draw current piece
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              mergedBoard[boardY][boardX] = { color: currentPiece.color, isGhost: false };
            }
          }
        }
      }
    }

    return mergedBoard;
  }, [board, currentPiece, ghostPieceEnabled, ghostPosition]);

  return (
    <div
      className="relative border-4 border-gray-700 bg-gray-900 rounded-lg overflow-hidden"
      style={{
        width: BOARD_WIDTH * CELL_SIZE + 8,
        height: BOARD_HEIGHT * CELL_SIZE + 8,
      }}
    >
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
        }}
      >
        {displayBoard.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="border border-gray-800 transition-colors duration-75"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: cell.color
                  ? cell.isGhost
                    ? `${cell.color}40`
                    : cell.color
                  : '#1a1a2e',
                boxShadow: cell.color && !cell.isGhost
                  ? `inset 0 0 10px rgba(255,255,255,0.3), inset 2px 2px 4px rgba(255,255,255,0.2)`
                  : 'none',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
