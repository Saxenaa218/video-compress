'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameState,
  createInitialState,
  createGameState,
  createTetromino,
  getRandomTetromino,
  isValidPosition,
  tryRotate,
  lockPiece,
  clearLines,
  calculateScore,
  getDropSpeed,
  calculateLevel,
  getHardDropPosition,
} from '../lib/gameLogic';
import { soundManager } from '../lib/sounds';

export interface GameSettings {
  soundEnabled: boolean;
  ghostPieceEnabled: boolean;
  startLevel: number;
}

export function useTetris(settings: GameSettings) {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStartedRef = useRef(false);

  // Initialize sound manager
  useEffect(() => {
    soundManager.init();
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Start new game
  const startGame = useCallback(() => {
    const newState = createGameState();
    newState.level = settings.startLevel;
    setGameState(newState);
    gameStartedRef.current = true;
  }, [settings.startLevel]);

  // Move piece left
  const moveLeft = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      if (isValidPosition(prev.board, prev.currentPiece, -1, 0)) {
        soundManager.playMove();
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: {
              ...prev.currentPiece.position,
              x: prev.currentPiece.position.x - 1,
            },
          },
        };
      }
      return prev;
    });
  }, []);

  // Move piece right
  const moveRight = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      if (isValidPosition(prev.board, prev.currentPiece, 1, 0)) {
        soundManager.playMove();
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: {
              ...prev.currentPiece.position,
              x: prev.currentPiece.position.x + 1,
            },
          },
        };
      }
      return prev;
    });
  }, []);

  // Rotate piece
  const rotate = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      const rotated = tryRotate(prev.board, prev.currentPiece);
      if (rotated) {
        soundManager.playRotate();
        return { ...prev, currentPiece: rotated };
      }
      return prev;
    });
  }, []);

  // Soft drop (move down faster)
  const softDrop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      if (isValidPosition(prev.board, prev.currentPiece, 0, 1)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: {
              ...prev.currentPiece.position,
              y: prev.currentPiece.position.y + 1,
            },
          },
          score: prev.score + 1, // Bonus for soft drop
        };
      }
      return prev;
    });
  }, []);

  // Hard drop (instant drop)
  const hardDrop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      
      const dropDistance = getHardDropPosition(prev.board, prev.currentPiece);
      const droppedPiece = {
        ...prev.currentPiece,
        position: {
          ...prev.currentPiece.position,
          y: prev.currentPiece.position.y + dropDistance,
        },
      };
      
      soundManager.playDrop();
      
      // Lock piece and check for line clears
      let newBoard = lockPiece(prev.board, droppedPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      newBoard = clearedBoard;
      
      const newLinesCleared = prev.linesCleared + linesCleared;
      const newLevel = calculateLevel(newLinesCleared);
      const leveledUp = newLevel > prev.level;
      
      if (linesCleared > 0) {
        soundManager.playLineClear();
      }
      if (leveledUp) {
        soundManager.playLevelUp();
      }
      
      // Spawn new piece
      const newPiece = createTetromino(prev.nextPiece);
      const isGameOver = !isValidPosition(newBoard, newPiece, 0, 0);
      
      if (isGameOver) {
        soundManager.playGameOver();
      }
      
      return {
        ...prev,
        board: newBoard,
        currentPiece: isGameOver ? null : newPiece,
        nextPiece: getRandomTetromino(),
        score: prev.score + calculateScore(linesCleared, prev.level) + dropDistance * 2,
        level: newLevel,
        linesCleared: newLinesCleared,
        isGameOver,
      };
    });
  }, []);

  // Pause/unpause game
  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev.isGameOver) return prev;
      return { ...prev, isPaused: !prev.isPaused };
    });
  }, []);

  // Natural drop (called by interval)
  const drop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      
      if (isValidPosition(prev.board, prev.currentPiece, 0, 1)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: {
              ...prev.currentPiece.position,
              y: prev.currentPiece.position.y + 1,
            },
          },
        };
      }
      
      // Lock piece
      let newBoard = lockPiece(prev.board, prev.currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      newBoard = clearedBoard;
      
      const newLinesCleared = prev.linesCleared + linesCleared;
      const newLevel = calculateLevel(newLinesCleared);
      const leveledUp = newLevel > prev.level;
      
      if (linesCleared > 0) {
        soundManager.playLineClear();
      }
      if (leveledUp) {
        soundManager.playLevelUp();
      }
      
      soundManager.playDrop();
      
      // Spawn new piece
      const newPiece = createTetromino(prev.nextPiece);
      const isGameOver = !isValidPosition(newBoard, newPiece, 0, 0);
      
      if (isGameOver) {
        soundManager.playGameOver();
      }
      
      return {
        ...prev,
        board: newBoard,
        currentPiece: isGameOver ? null : newPiece,
        nextPiece: getRandomTetromino(),
        score: prev.score + calculateScore(linesCleared, prev.level),
        level: newLevel,
        linesCleared: newLinesCleared,
        isGameOver,
      };
    });
  }, []);

  // Set up drop interval
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameStartedRef.current) {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
      return;
    }

    const speed = getDropSpeed(gameState.level);
    dropIntervalRef.current = setInterval(drop, speed);

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
    };
  }, [gameState.level, gameState.isGameOver, gameState.isPaused, drop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isGameOver && e.key !== 'Enter') return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          rotate();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          softDrop();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          e.preventDefault();
          togglePause();
          break;
        case 'Enter':
          if (gameState.isGameOver || !gameStartedRef.current) {
            e.preventDefault();
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isGameOver, moveLeft, moveRight, rotate, softDrop, hardDrop, togglePause, startGame]);

  return {
    gameState,
    startGame,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    togglePause,
    ghostPieceEnabled: settings.ghostPieceEnabled,
  };
}
