'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Direction,
  Position,
  GameSettings,
  GameState,
  DEFAULT_SETTINGS,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
} from '@/types/game';

const getOppositeDirection = (direction: Direction): Direction => {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return opposites[direction];
};

const generateFood = (snake: Position[], width: number, height: number): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

const checkCollision = (head: Position, snake: Position[], width: number, height: number): boolean => {
  // Wall collision
  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
    return true;
  }
  // Self collision (excluding head)
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
};

export const useSnakeGame = (settings: GameSettings = DEFAULT_SETTINGS) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    snake: INITIAL_SNAKE,
    food: generateFood(INITIAL_SNAKE, settings.boardWidth, settings.boardHeight),
    direction: INITIAL_DIRECTION,
    isGameOver: false,
    isPaused: true,
    score: 0,
    level: 1,
    highScore: 0,
  }));

  const directionRef = useRef<Direction>(gameState.direction);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const eatSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sounds
  useEffect(() => {
    if (typeof window !== 'undefined') {
      eatSoundRef.current = new Audio('/sounds/eat.mp3');
      gameOverSoundRef.current = new Audio('/sounds/gameover.mp3');
    }
  }, []);

  const playSound = useCallback((sound: 'eat' | 'gameover') => {
    if (!settings.enableSound) return;
    
    const audio = sound === 'eat' ? eatSoundRef.current : gameOverSoundRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore audio play errors (e.g., user hasn't interacted with the page yet)
      });
    }
  }, [settings.enableSound]);

  const calculateSpeed = useCallback((level: number) => {
    return Math.max(50, settings.initialSpeed - (level - 1) * settings.speedIncrement);
  }, [settings.initialSpeed, settings.speedIncrement]);

  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      const head = prevState.snake[0];
      const direction = directionRef.current;
      
      let newHead: Position;
      switch (direction) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check for collisions
      if (checkCollision(newHead, prevState.snake, settings.boardWidth, settings.boardHeight)) {
        playSound('gameover');
        return {
          ...prevState,
          isGameOver: true,
          isPaused: true,
          highScore: Math.max(prevState.highScore, prevState.score),
        };
      }

      const newSnake = [newHead, ...prevState.snake];
      let newScore = prevState.score;
      let newLevel = prevState.level;
      let newFood = prevState.food;

      // Check if snake ate food
      if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
        playSound('eat');
        newScore += settings.pointsPerFood;
        newFood = generateFood(newSnake, settings.boardWidth, settings.boardHeight);
        
        // Level up check
        if (newScore >= newLevel * settings.pointsForLevelUp) {
          newLevel++;
        }
      } else {
        newSnake.pop(); // Remove tail if didn't eat food
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        direction,
        score: newScore,
        level: newLevel,
      };
    });
  }, [settings.boardWidth, settings.boardHeight, settings.pointsPerFood, settings.pointsForLevelUp, playSound]);

  const changeDirection = useCallback((newDirection: Direction) => {
    const currentDirection = directionRef.current;
    // Prevent reversing direction
    if (newDirection !== getOppositeDirection(currentDirection)) {
      directionRef.current = newDirection;
    }
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetGame = useCallback(() => {
    directionRef.current = INITIAL_DIRECTION;
    setGameState(prev => ({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE, settings.boardWidth, settings.boardHeight),
      direction: INITIAL_DIRECTION,
      isGameOver: false,
      isPaused: true,
      score: 0,
      level: 1,
      highScore: prev.highScore,
    }));
  }, [settings.boardWidth, settings.boardHeight]);

  // Game loop
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const speed = calculateSpeed(gameState.level);
    gameLoopRef.current = setInterval(moveSnake, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused, gameState.level, moveSnake, calculateSpeed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          event.preventDefault();
          if (!gameState.isGameOver) {
            togglePause();
          }
          break;
        case 'Enter':
          event.preventDefault();
          if (gameState.isGameOver) {
            resetGame();
          } else if (gameState.isPaused) {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, togglePause, resetGame, startGame, gameState.isGameOver, gameState.isPaused]);

  return {
    gameState,
    changeDirection,
    startGame,
    pauseGame,
    togglePause,
    resetGame,
  };
};
