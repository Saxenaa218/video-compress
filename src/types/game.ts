export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface GameSettings {
  boardWidth: number;
  boardHeight: number;
  initialSpeed: number;
  speedIncrement: number;
  pointsPerFood: number;
  pointsForLevelUp: number;
  enableSound: boolean;
  enableAnimations: boolean;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  isGameOver: boolean;
  isPaused: boolean;
  score: number;
  level: number;
  highScore: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  boardWidth: 20,
  boardHeight: 20,
  initialSpeed: 150,
  speedIncrement: 10,
  pointsPerFood: 10,
  pointsForLevelUp: 50,
  enableSound: true,
  enableAnimations: true,
};

export const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export const INITIAL_DIRECTION: Direction = 'RIGHT';
