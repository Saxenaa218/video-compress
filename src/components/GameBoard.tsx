'use client';

import React from 'react';
import { Position, GameSettings } from '@/types/game';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  settings: GameSettings;
  isGameOver: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, settings, isGameOver }) => {
  const { boardWidth, boardHeight, enableAnimations } = settings;
  const cellSize = 20;

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
    const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    let cellClass = 'w-5 h-5 border border-gray-700/30 ';
    
    if (isSnakeHead) {
      cellClass += 'bg-green-500 rounded-sm ';
      if (enableAnimations) {
        cellClass += 'animate-pulse ';
      }
    } else if (isSnakeBody) {
      cellClass += 'bg-green-400 rounded-sm ';
    } else if (isFood) {
      cellClass += 'bg-red-500 rounded-full ';
      if (enableAnimations) {
        cellClass += 'animate-bounce ';
      }
    } else {
      cellClass += 'bg-gray-800/50 ';
    }

    if (isGameOver && (isSnakeHead || isSnakeBody)) {
      cellClass = cellClass.replace('bg-green-500', 'bg-gray-500');
      cellClass = cellClass.replace('bg-green-400', 'bg-gray-400');
    }

    return (
      <div
        key={`${x}-${y}`}
        className={cellClass}
        style={{ width: cellSize, height: cellSize }}
      />
    );
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {
        cells.push(renderCell(x, y));
      }
    }
    return cells;
  };

  return (
    <div
      className="relative border-4 border-green-600 rounded-lg bg-gray-900 shadow-lg shadow-green-500/20"
      style={{
        width: boardWidth * cellSize + 8,
        height: boardHeight * cellSize + 8,
        display: 'grid',
        gridTemplateColumns: `repeat(${boardWidth}, ${cellSize}px)`,
      }}
    >
      {renderGrid()}
    </div>
  );
};

export default GameBoard;
