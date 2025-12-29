import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINOES,
  TetrominoType,
  LEVEL_SPEEDS,
  POINTS_PER_LINE,
  LINES_PER_LEVEL,
  DEFAULT_TETROMINO,
} from './constants';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  position: Position;
  color: string;
}

export interface GameState {
  board: (string | null)[][];
  currentPiece: Tetromino | null;
  nextPiece: TetrominoType;
  score: number;
  level: number;
  linesCleared: number;
  isGameOver: boolean;
  isPaused: boolean;
}

// Create empty board
export function createEmptyBoard(): (string | null)[][] {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

// Get random tetromino type
export function getRandomTetromino(): TetrominoType {
  const types = Object.keys(TETROMINOES) as TetrominoType[];
  return types[Math.floor(Math.random() * types.length)];
}

// Create a new tetromino piece
export function createTetromino(type: TetrominoType): Tetromino {
  const tetromino = TETROMINOES[type];
  return {
    type,
    shape: tetromino.shape.map((row) => [...row]),
    position: {
      x: Math.floor((BOARD_WIDTH - tetromino.shape[0].length) / 2),
      y: 0,
    },
    color: tetromino.color,
  };
}

// Check if position is valid
export function isValidPosition(
  board: (string | null)[][],
  piece: Tetromino,
  offsetX = 0,
  offsetY = 0
): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;

        // Check bounds
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }

        // Check collision with other pieces (only if within board)
        if (newY >= 0 && board[newY][newX] !== null) {
          return false;
        }
      }
    }
  }
  return true;
}

// Rotate piece clockwise
export function rotatePiece(piece: Tetromino): number[][] {
  const n = piece.shape.length;
  const rotated: number[][] = Array.from({ length: n }, () =>
    Array(n).fill(0)
  );

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      rotated[x][n - 1 - y] = piece.shape[y][x];
    }
  }

  return rotated;
}

// Wall kick offsets for rotation
const WALL_KICKS = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -2, y: 0 },
  { x: 2, y: 0 },
];

// Try to rotate piece with wall kicks
export function tryRotate(
  board: (string | null)[][],
  piece: Tetromino
): Tetromino | null {
  const rotated = rotatePiece(piece);
  const testPiece: Tetromino = { ...piece, shape: rotated };

  for (const kick of WALL_KICKS) {
    if (isValidPosition(board, testPiece, kick.x, kick.y)) {
      return {
        ...testPiece,
        position: {
          x: piece.position.x + kick.x,
          y: piece.position.y + kick.y,
        },
      };
    }
  }

  return null;
}

// Lock piece on the board
export function lockPiece(
  board: (string | null)[][],
  piece: Tetromino
): (string | null)[][] {
  const newBoard = board.map((row) => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }

  return newBoard;
}

// Clear completed lines
export function clearLines(
  board: (string | null)[][]
): { newBoard: (string | null)[][]; linesCleared: number } {
  const newBoard = board.filter((row) => row.some((cell) => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;

  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { newBoard, linesCleared };
}

// Calculate score
export function calculateScore(linesCleared: number, level: number): number {
  return POINTS_PER_LINE[linesCleared] * (level + 1);
}

// Get drop speed for level
export function getDropSpeed(level: number): number {
  return LEVEL_SPEEDS[Math.min(level, LEVEL_SPEEDS.length - 1)];
}

// Calculate level from total lines cleared
export function calculateLevel(linesCleared: number): number {
  return Math.floor(linesCleared / LINES_PER_LEVEL);
}

// Calculate hard drop position
export function getHardDropPosition(
  board: (string | null)[][],
  piece: Tetromino
): number {
  let dropDistance = 0;
  while (isValidPosition(board, piece, 0, dropDistance + 1)) {
    dropDistance++;
  }
  return dropDistance;
}

// Initial game state (deterministic for SSR)
export function createInitialState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: DEFAULT_TETROMINO,
    score: 0,
    level: 0,
    linesCleared: 0,
    isGameOver: false,
    isPaused: false,
  };
}

// Create game state with random pieces (client-side only)
export function createGameState(): GameState {
  const firstPiece = getRandomTetromino();
  return {
    board: createEmptyBoard(),
    currentPiece: createTetromino(firstPiece),
    nextPiece: getRandomTetromino(),
    score: 0,
    level: 0,
    linesCleared: 0,
    isGameOver: false,
    isPaused: false,
  };
}
