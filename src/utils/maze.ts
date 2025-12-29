import { CellType, Position, Direction, Ghost } from '@/types/game';

// Maze dimensions
export const MAZE_WIDTH = 19;
export const MAZE_HEIGHT = 21;
export const CELL_SIZE = 24;

// Game constants
export const INITIAL_LIVES = 3;
export const PELLET_SCORE = 10;
export const POWER_PELLET_SCORE = 50;
export const GHOST_SCORE = 200;
export const POWER_MODE_DURATION = 10000; // 10 seconds
export const GAME_SPEED = 150; // ms between updates
export const GHOST_SPEED_MULTIPLIER = 1.1;

// Ghost colors
export const GHOST_COLORS = ['#FF0000', '#00FFFF', '#FFB8FF', '#FFB852'];

// Initial maze layout
// W = wall, . = pellet, o = power pellet, E = empty, G = ghost house
export const INITIAL_MAZE: CellType[][] = [
  ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],
  ['wall','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','wall','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','wall'],
  ['wall','power-pellet','wall','wall','pellet','wall','wall','wall','pellet','wall','pellet','wall','wall','wall','pellet','wall','wall','power-pellet','wall'],
  ['wall','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','wall'],
  ['wall','pellet','wall','wall','pellet','wall','pellet','wall','wall','wall','wall','wall','pellet','wall','pellet','wall','wall','pellet','wall'],
  ['wall','pellet','pellet','pellet','pellet','wall','pellet','pellet','pellet','wall','pellet','pellet','pellet','wall','pellet','pellet','pellet','pellet','wall'],
  ['wall','wall','wall','wall','pellet','wall','wall','wall','empty','wall','empty','wall','wall','wall','pellet','wall','wall','wall','wall'],
  ['empty','empty','empty','wall','pellet','wall','empty','empty','empty','empty','empty','empty','empty','wall','pellet','wall','empty','empty','empty'],
  ['wall','wall','wall','wall','pellet','wall','empty','wall','wall','ghost-house','wall','wall','empty','wall','pellet','wall','wall','wall','wall'],
  ['empty','empty','empty','empty','pellet','empty','empty','wall','ghost-house','ghost-house','ghost-house','wall','empty','empty','pellet','empty','empty','empty','empty'],
  ['wall','wall','wall','wall','pellet','wall','empty','wall','wall','wall','wall','wall','empty','wall','pellet','wall','wall','wall','wall'],
  ['empty','empty','empty','wall','pellet','wall','empty','empty','empty','empty','empty','empty','empty','wall','pellet','wall','empty','empty','empty'],
  ['wall','wall','wall','wall','pellet','wall','empty','wall','wall','wall','wall','wall','empty','wall','pellet','wall','wall','wall','wall'],
  ['wall','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','wall','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','wall'],
  ['wall','pellet','wall','wall','pellet','wall','wall','wall','pellet','wall','pellet','wall','wall','wall','pellet','wall','wall','pellet','wall'],
  ['wall','power-pellet','pellet','wall','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','wall','pellet','power-pellet','wall'],
  ['wall','wall','pellet','wall','pellet','wall','pellet','wall','wall','wall','wall','wall','pellet','wall','pellet','wall','pellet','wall','wall'],
  ['wall','pellet','pellet','pellet','pellet','wall','pellet','pellet','pellet','wall','pellet','pellet','pellet','wall','pellet','pellet','pellet','pellet','wall'],
  ['wall','pellet','wall','wall','wall','wall','wall','wall','pellet','wall','pellet','wall','wall','wall','wall','wall','wall','pellet','wall'],
  ['wall','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','pellet','wall'],
  ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],
];

// Starting positions
export const PACMAN_START: Position = { x: 9, y: 15 };

export const GHOST_START_POSITIONS: Position[] = [
  { x: 9, y: 9 },  // Red ghost starts outside
  { x: 8, y: 9 },  // Cyan ghost
  { x: 9, y: 9 },  // Pink ghost
  { x: 10, y: 9 }, // Orange ghost
];

// Helper functions
export function isWall(maze: CellType[][], pos: Position): boolean {
  if (pos.x < 0 || pos.x >= MAZE_WIDTH || pos.y < 0 || pos.y >= MAZE_HEIGHT) {
    return true;
  }
  return maze[pos.y][pos.x] === 'wall';
}

export function isGhostHouse(maze: CellType[][], pos: Position): boolean {
  if (pos.x < 0 || pos.x >= MAZE_WIDTH || pos.y < 0 || pos.y >= MAZE_HEIGHT) {
    return false;
  }
  return maze[pos.y][pos.x] === 'ghost-house';
}

export function getNextPosition(pos: Position, direction: Direction): Position {
  switch (direction) {
    case 'up':
      return { x: pos.x, y: pos.y - 1 };
    case 'down':
      return { x: pos.x, y: pos.y + 1 };
    case 'left':
      // Wrap around for tunnel
      if (pos.x <= 0) return { x: MAZE_WIDTH - 1, y: pos.y };
      return { x: pos.x - 1, y: pos.y };
    case 'right':
      // Wrap around for tunnel
      if (pos.x >= MAZE_WIDTH - 1) return { x: 0, y: pos.y };
      return { x: pos.x + 1, y: pos.y };
  }
}

export function canMove(maze: CellType[][], pos: Position, direction: Direction, isGhost: boolean = false): boolean {
  const nextPos = getNextPosition(pos, direction);
  if (isWall(maze, nextPos)) return false;
  // Ghosts can enter ghost house, Pacman cannot
  if (!isGhost && isGhostHouse(maze, nextPos)) return false;
  return true;
}

export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    case 'right': return 'left';
  }
}

export function getValidDirections(maze: CellType[][], pos: Position, isGhost: boolean = false): Direction[] {
  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  return directions.filter(dir => canMove(maze, pos, dir, isGhost));
}

export function createInitialGhosts(): Ghost[] {
  return GHOST_START_POSITIONS.map((pos, index) => ({
    id: index,
    position: { ...pos },
    direction: 'up' as Direction,
    isScared: false,
    isEaten: false,
    color: GHOST_COLORS[index],
  }));
}

export function copyMaze(maze: CellType[][]): CellType[][] {
  return maze.map(row => [...row]);
}

export function countPellets(maze: CellType[][]): number {
  let count = 0;
  for (const row of maze) {
    for (const cell of row) {
      if (cell === 'pellet' || cell === 'power-pellet') {
        count++;
      }
    }
  }
  return count;
}

// Ghost AI helper - calculate Manhattan distance
export function manhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

// Get direction towards target (simple chase)
export function getDirectionToTarget(maze: CellType[][], current: Position, target: Position, currentDir: Direction): Direction {
  const validDirs = getValidDirections(maze, current, true);
  
  // Don't reverse direction unless no other choice
  const oppositeDir = getOppositeDirection(currentDir);
  const preferredDirs = validDirs.filter(d => d !== oppositeDir);
  const dirsToConsider = preferredDirs.length > 0 ? preferredDirs : validDirs;
  
  if (dirsToConsider.length === 0) return currentDir;
  
  // Choose direction that minimizes distance to target
  let bestDir = dirsToConsider[0];
  let bestDist = Infinity;
  
  for (const dir of dirsToConsider) {
    const nextPos = getNextPosition(current, dir);
    const dist = manhattanDistance(nextPos, target);
    if (dist < bestDist) {
      bestDist = dist;
      bestDir = dir;
    }
  }
  
  return bestDir;
}

// Get random direction (for scared mode)
export function getRandomDirection(maze: CellType[][], current: Position, currentDir: Direction): Direction {
  const validDirs = getValidDirections(maze, current, true);
  const oppositeDir = getOppositeDirection(currentDir);
  const preferredDirs = validDirs.filter(d => d !== oppositeDir);
  const dirsToConsider = preferredDirs.length > 0 ? preferredDirs : validDirs;
  
  if (dirsToConsider.length === 0) return currentDir;
  
  return dirsToConsider[Math.floor(Math.random() * dirsToConsider.length)];
}
