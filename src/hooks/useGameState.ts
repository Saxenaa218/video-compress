'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Direction, Position } from '@/types/game';
import {
  INITIAL_MAZE,
  PACMAN_START,
  INITIAL_LIVES,
  PELLET_SCORE,
  POWER_PELLET_SCORE,
  GHOST_SCORE,
  POWER_MODE_DURATION,
  GAME_SPEED,
  createInitialGhosts,
  copyMaze,
  countPellets,
  isWall,
  getNextPosition,
  canMove,
  getDirectionToTarget,
  getRandomDirection,
  GHOST_START_POSITIONS,
} from '@/utils/maze';
import { soundManager } from '@/utils/sounds';

const createInitialState = (): GameState => {
  const maze = copyMaze(INITIAL_MAZE);
  return {
    pacman: { ...PACMAN_START },
    pacmanDirection: 'right',
    ghosts: createInitialGhosts(),
    score: 0,
    lives: INITIAL_LIVES,
    level: 1,
    pelletsRemaining: countPellets(maze),
    isPowerMode: false,
    powerModeTimer: 0,
    isGameOver: false,
    isWin: false,
    isPaused: true,
    maze,
  };
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [nextDirection, setNextDirection] = useState<Direction | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const powerModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let newDirection: Direction | null = null;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        newDirection = 'up';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        newDirection = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        newDirection = 'left';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        newDirection = 'right';
        break;
      case ' ':
        // Toggle pause
        setGameState(prev => {
          if (prev.isGameOver || prev.isWin) return prev;
          return { ...prev, isPaused: !prev.isPaused };
        });
        return;
      case 'm':
      case 'M':
        // Toggle mute
        soundManager?.toggleMute();
        return;
      default:
        return;
    }

    if (newDirection) {
      e.preventDefault();
      setNextDirection(newDirection);
    }
  }, []);

  // Set up keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Move ghosts
  const moveGhosts = useCallback((state: GameState): GameState => {
    const newGhosts = state.ghosts.map(ghost => {
      if (ghost.isEaten) {
        // Return to ghost house
        const distToHome = Math.abs(ghost.position.x - GHOST_START_POSITIONS[ghost.id].x) +
                          Math.abs(ghost.position.y - GHOST_START_POSITIONS[ghost.id].y);
        if (distToHome < 2) {
          return { ...ghost, isEaten: false, position: { ...GHOST_START_POSITIONS[ghost.id] } };
        }
        const dir = getDirectionToTarget(state.maze, ghost.position, GHOST_START_POSITIONS[ghost.id], ghost.direction);
        const nextPos = getNextPosition(ghost.position, dir);
        if (!isWall(state.maze, nextPos)) {
          return { ...ghost, position: nextPos, direction: dir };
        }
        return ghost;
      }

      let newDir: Direction;
      
      if (state.isPowerMode && ghost.isScared) {
        // Run away from Pacman
        newDir = getRandomDirection(state.maze, ghost.position, ghost.direction);
      } else {
        // Chase Pacman with different strategies based on ghost ID
        let target: Position;
        switch (ghost.id) {
          case 0: // Red - direct chase
            target = state.pacman;
            break;
          case 1: // Cyan - target ahead of Pacman
            target = getNextPosition(getNextPosition(state.pacman, state.pacmanDirection), state.pacmanDirection);
            break;
          case 2: // Pink - ambush from ahead
            target = getNextPosition(getNextPosition(getNextPosition(state.pacman, state.pacmanDirection), state.pacmanDirection), state.pacmanDirection);
            break;
          case 3: // Orange - random when close, chase when far
            const dist = Math.abs(ghost.position.x - state.pacman.x) + Math.abs(ghost.position.y - state.pacman.y);
            target = dist < 8 ? { x: 1, y: 19 } : state.pacman;
            break;
          default:
            target = state.pacman;
        }
        newDir = getDirectionToTarget(state.maze, ghost.position, target, ghost.direction);
      }

      const nextPos = getNextPosition(ghost.position, newDir);
      if (!isWall(state.maze, nextPos)) {
        return { ...ghost, position: nextPos, direction: newDir };
      }
      return ghost;
    });

    return { ...state, ghosts: newGhosts };
  }, []);

  // Check collisions between Pacman and ghosts
  const checkGhostCollision = useCallback((state: GameState): GameState => {
    let newState = { ...state };
    let scoreBonus = 0;

    for (let i = 0; i < newState.ghosts.length; i++) {
      const ghost = newState.ghosts[i];
      if (ghost.position.x === newState.pacman.x && ghost.position.y === newState.pacman.y) {
        if (newState.isPowerMode && ghost.isScared && !ghost.isEaten) {
          // Eat the ghost
          soundManager?.playGhostEaten();
          scoreBonus += GHOST_SCORE * Math.pow(2, newState.ghosts.filter(g => g.isEaten).length);
          const updatedGhosts = [...newState.ghosts];
          updatedGhosts[i] = { ...ghost, isEaten: true, isScared: false };
          newState = { ...newState, ghosts: updatedGhosts };
        } else if (!ghost.isEaten) {
          // Pacman dies
          soundManager?.playDeath();
          const newLives = newState.lives - 1;
          if (newLives <= 0) {
            soundManager?.playGameOver();
            return { ...newState, lives: 0, isGameOver: true };
          }
          // Reset positions
          return {
            ...newState,
            lives: newLives,
            pacman: { ...PACMAN_START },
            pacmanDirection: 'right',
            ghosts: createInitialGhosts(),
            isPowerMode: false,
            powerModeTimer: 0,
            isPaused: true,
          };
        }
      }
    }

    return { ...newState, score: newState.score + scoreBonus };
  }, []);

  // Main game update
  const updateGame = useCallback(() => {
    setGameState(prevState => {
      if (prevState.isPaused || prevState.isGameOver || prevState.isWin) {
        return prevState;
      }

      let state = { ...prevState };
      let direction = state.pacmanDirection;

      // Try to change direction if requested
      if (nextDirection && canMove(state.maze, state.pacman, nextDirection)) {
        direction = nextDirection;
        setNextDirection(null);
      }

      // Move Pacman
      if (canMove(state.maze, state.pacman, direction)) {
        const newPos = getNextPosition(state.pacman, direction);
        state = { ...state, pacman: newPos, pacmanDirection: direction };

        // Check for pellet
        const cell = state.maze[newPos.y][newPos.x];
        if (cell === 'pellet') {
          soundManager?.playChomp();
          const newMaze = copyMaze(state.maze);
          newMaze[newPos.y][newPos.x] = 'empty';
          state = {
            ...state,
            maze: newMaze,
            score: state.score + PELLET_SCORE,
            pelletsRemaining: state.pelletsRemaining - 1,
          };
        } else if (cell === 'power-pellet') {
          soundManager?.playPowerPellet();
          const newMaze = copyMaze(state.maze);
          newMaze[newPos.y][newPos.x] = 'empty';
          
          // Enable power mode
          if (powerModeTimeoutRef.current) {
            clearTimeout(powerModeTimeoutRef.current);
          }
          
          const scaredGhosts = state.ghosts.map(g => ({ ...g, isScared: !g.isEaten }));
          
          state = {
            ...state,
            maze: newMaze,
            score: state.score + POWER_PELLET_SCORE,
            pelletsRemaining: state.pelletsRemaining - 1,
            isPowerMode: true,
            powerModeTimer: POWER_MODE_DURATION,
            ghosts: scaredGhosts,
          };
        }
      }

      // Move ghosts
      state = moveGhosts(state);

      // Check collisions
      state = checkGhostCollision(state);

      // Check win condition
      if (state.pelletsRemaining === 0 && !state.isGameOver) {
        soundManager?.playLevelUp();
        // Next level
        const newMaze = copyMaze(INITIAL_MAZE);
        return {
          ...state,
          level: state.level + 1,
          maze: newMaze,
          pelletsRemaining: countPellets(newMaze),
          pacman: { ...PACMAN_START },
          pacmanDirection: 'right',
          ghosts: createInitialGhosts(),
          isPowerMode: false,
          powerModeTimer: 0,
          isPaused: true,
        };
      }

      return state;
    });
  }, [nextDirection, moveGhosts, checkGhostCollision]);

  // Power mode timer
  useEffect(() => {
    if (gameState.isPowerMode && !gameState.isPaused && !gameState.isGameOver) {
      powerModeTimeoutRef.current = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          isPowerMode: false,
          powerModeTimer: 0,
          ghosts: prev.ghosts.map(g => ({ ...g, isScared: false })),
        }));
      }, POWER_MODE_DURATION);

      return () => {
        if (powerModeTimeoutRef.current) {
          clearTimeout(powerModeTimeoutRef.current);
        }
      };
    }
  }, [gameState.isPowerMode, gameState.isPaused, gameState.isGameOver]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPaused && !gameState.isGameOver && !gameState.isWin) {
      const speed = GAME_SPEED - (gameState.level - 1) * 10; // Speed up each level
      gameLoopRef.current = setInterval(updateGame, Math.max(speed, 50));
      
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameState.isPaused, gameState.isGameOver, gameState.isWin, gameState.level, updateGame]);

  // Start game
  const startGame = useCallback(() => {
    soundManager?.playStart();
    setGameState(prev => ({ ...prev, isPaused: false }));
    setNextDirection(null);
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    if (powerModeTimeoutRef.current) {
      clearTimeout(powerModeTimeoutRef.current);
    }
    soundManager?.playStart();
    setGameState(createInitialState());
    setNextDirection(null);
  }, []);

  // Direction setter for touch/click controls
  const setDirection = useCallback((dir: Direction) => {
    setNextDirection(dir);
    if (gameState.isPaused && !gameState.isGameOver && !gameState.isWin) {
      setGameState(prev => ({ ...prev, isPaused: false }));
    }
  }, [gameState.isPaused, gameState.isGameOver, gameState.isWin]);

  return {
    gameState,
    startGame,
    restartGame,
    setDirection,
  };
}
