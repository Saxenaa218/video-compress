// Game board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;

// Tetromino shapes
export const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0', // Cyan
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000', // Yellow
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a000f0', // Purple
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00f000', // Green
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f00000', // Red
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000f0', // Blue
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f0a000', // Orange
  },
};

export type TetrominoType = keyof typeof TETROMINOES;

// Game speeds (ms between drops) per level
export const LEVEL_SPEEDS = [
  1000, 900, 800, 700, 600, 500, 450, 400, 350, 300,
  250, 200, 175, 150, 125, 100, 90, 80, 70, 60,
];

// Points per line cleared
export const POINTS_PER_LINE = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 lines

// Lines needed to advance to the next level
export const LINES_PER_LEVEL = 10;

// Default tetromino for SSR (deterministic)
export const DEFAULT_TETROMINO: TetrominoType = 'T';
