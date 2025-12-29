export type Direction = 'up' | 'down' | 'left' | 'right';

export type CellType = 'wall' | 'empty' | 'pellet' | 'power-pellet' | 'ghost-house';

export interface Position {
  x: number;
  y: number;
}

export interface Ghost {
  id: number;
  position: Position;
  direction: Direction;
  isScared: boolean;
  isEaten: boolean;
  color: string;
}

export interface GameState {
  pacman: Position;
  pacmanDirection: Direction;
  ghosts: Ghost[];
  score: number;
  lives: number;
  level: number;
  pelletsRemaining: number;
  isPowerMode: boolean;
  powerModeTimer: number;
  isGameOver: boolean;
  isWin: boolean;
  isPaused: boolean;
  maze: CellType[][];
}

export interface MazeCell {
  type: CellType;
  hasPellet: boolean;
  hasPowerPellet: boolean;
}
