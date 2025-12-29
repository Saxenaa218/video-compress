import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { getBestMove } from '../utils/chessAI';
import GameHistory from './GameHistory';
import GameControls from './GameControls';
import './ChessGame.css';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [gameHistory, setGameHistory] = useState([]);
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'ai'
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [playerColor, setPlayerColor] = useState('w');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const isAIMovePending = useRef(false);

  // Compute status as derived state
  const status = useMemo(() => {
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      return `Checkmate! ${winner} wins!`;
    } else if (game.isDraw()) {
      if (game.isStalemate()) {
        return 'Draw by stalemate!';
      } else if (game.isThreefoldRepetition()) {
        return 'Draw by threefold repetition!';
      } else if (game.isInsufficientMaterial()) {
        return 'Draw by insufficient material!';
      } else {
        return 'Draw!';
      }
    } else if (game.isCheck()) {
      return `${game.turn() === 'w' ? 'White' : 'Black'} is in check!`;
    } else {
      return `${game.turn() === 'w' ? 'White' : 'Black'}'s turn`;
    }
  }, [game]);

  // AI move logic
  useEffect(() => {
    if (gameMode === 'ai' && game.turn() !== playerColor && !game.isGameOver() && !isAIMovePending.current) {
      isAIMovePending.current = true;
      
      // Use a short timeout to set thinking state (avoids synchronous setState in effect)
      const thinkingTimeoutId = setTimeout(() => {
        setIsThinking(true);
      }, 0);
      
      // Use setTimeout to allow UI to update before AI thinks
      const moveTimeoutId = setTimeout(() => {
        const aiMove = getBestMove(game, aiDifficulty);
        if (aiMove) {
          const gameCopy = new Chess(game.fen());
          const move = gameCopy.move(aiMove);
          if (move) {
            setGameHistory(prev => [...prev, {
              moveNumber: Math.ceil(gameCopy.history().length / 2),
              move: move.san,
              color: move.color === 'w' ? 'White' : 'Black',
              fen: gameCopy.fen()
            }]);
            setGame(gameCopy);
          }
        }
        setIsThinking(false);
        isAIMovePending.current = false;
      }, 500);
      return () => {
        clearTimeout(thinkingTimeoutId);
        clearTimeout(moveTimeoutId);
        isAIMovePending.current = false;
      };
    }
  }, [game, gameMode, playerColor, aiDifficulty]);

  // Handle piece drop (drag and drop)
  const onDrop = useCallback((sourceSquare, targetSquare) => {
    // Don't allow moves if AI is thinking or game is over
    if (isThinking || game.isGameOver()) return false;

    // In AI mode, only allow player's color to move
    if (gameMode === 'ai' && game.turn() !== playerColor) return false;

    try {
      const gameCopy = new Chess(game.fen());
      
      // Try to make the move
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });

      if (move === null) return false;

      // Update history
      setGameHistory(prev => [...prev, {
        moveNumber: Math.ceil(gameCopy.history().length / 2),
        move: move.san,
        color: move.color === 'w' ? 'White' : 'Black',
        fen: gameCopy.fen()
      }]);

      setGame(gameCopy);
      setSelectedSquare(null);
      setPossibleMoves([]);
      return true;
    } catch {
      return false;
    }
  }, [game, gameMode, playerColor, isThinking]);

  // Handle square click (for click-to-move)
  const onSquareClick = useCallback((square) => {
    if (isThinking || game.isGameOver()) return;
    if (gameMode === 'ai' && game.turn() !== playerColor) return;

    // If a square is already selected
    if (selectedSquare) {
      // Try to make the move
      const result = onDrop(selectedSquare, square);
      if (!result) {
        // If move failed, check if clicking on own piece to select it
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          const moves = game.moves({ square, verbose: true });
          setPossibleMoves(moves.map(m => m.to));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // Select the square if it has a piece of current turn
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map(m => m.to));
      }
    }
  }, [game, selectedSquare, gameMode, playerColor, isThinking, onDrop]);

  // Reset game
  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setGameHistory([]);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setIsThinking(false);
    isAIMovePending.current = false;
  }, []);

  // Undo last move
  const undoMove = useCallback(() => {
    if (gameHistory.length === 0 || isThinking) return;
    
    const gameCopy = new Chess(game.fen());
    gameCopy.undo();
    
    // In AI mode, undo AI's move too if applicable
    if (gameMode === 'ai' && gameCopy.turn() !== playerColor && gameHistory.length > 1) {
      gameCopy.undo();
      setGameHistory(prev => prev.slice(0, -2));
    } else {
      setGameHistory(prev => prev.slice(0, -1));
    }
    
    setGame(gameCopy);
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [game, gameHistory, gameMode, playerColor, isThinking]);

  // Go to specific position in history
  const goToMove = useCallback((fen) => {
    if (isThinking) return;
    const gameCopy = new Chess(fen);
    setGame(gameCopy);
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [isThinking]);

  // Change game mode
  const handleModeChange = useCallback((mode) => {
    setGameMode(mode);
    resetGame();
  }, [resetGame]);

  // Change player color (for AI mode)
  const handleColorChange = useCallback((color) => {
    setPlayerColor(color);
    resetGame();
  }, [resetGame]);

  // Custom square styles
  const customSquareStyles = {};
  
  // Highlight selected square
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(255, 255, 0, 0.4)'
    };
  }
  
  // Highlight possible moves
  possibleMoves.forEach(square => {
    const piece = game.get(square);
    customSquareStyles[square] = {
      background: piece 
        ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
        : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
      borderRadius: piece ? '0' : '50%'
    };
  });

  // Highlight king in check
  if (game.isCheck()) {
    const kingSquare = game.board().flat().find(
      piece => piece && piece.type === 'k' && piece.color === game.turn()
    );
    if (kingSquare) {
      // Find the square
      const board = game.board();
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          if (piece && piece.type === 'k' && piece.color === game.turn()) {
            const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            const square = files[j] + (8 - i);
            customSquareStyles[square] = {
              ...customSquareStyles[square],
              backgroundColor: 'rgba(255, 0, 0, 0.4)'
            };
          }
        }
      }
    }
  }

  return (
    <div className="chess-game">
      <h1>Chess Game</h1>
      
      <div className="game-container">
        <div className="board-section">
          <div className="status-bar">
            <span className={`status ${game.isCheckmate() ? 'checkmate' : game.isCheck() ? 'check' : ''}`}>
              {status}
            </span>
            {isThinking && <span className="thinking">AI is thinking...</span>}
          </div>
          
          <div className="chessboard-wrapper">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              boardOrientation={gameMode === 'ai' && playerColor === 'b' ? 'black' : 'white'}
              customSquareStyles={customSquareStyles}
              animationDuration={200}
              arePiecesDraggable={!isThinking && !game.isGameOver()}
              boardWidth={480}
            />
          </div>
          
          <GameControls
            gameMode={gameMode}
            aiDifficulty={aiDifficulty}
            playerColor={playerColor}
            onModeChange={handleModeChange}
            onDifficultyChange={setAiDifficulty}
            onColorChange={handleColorChange}
            onReset={resetGame}
            onUndo={undoMove}
            canUndo={gameHistory.length > 0 && !isThinking}
          />
        </div>
        
        <div className="history-section">
          <GameHistory 
            history={gameHistory} 
            onMoveClick={goToMove}
            currentFen={game.fen()}
          />
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
