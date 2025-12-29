import './GameControls.css';

const GameControls = ({
  gameMode,
  aiDifficulty,
  playerColor,
  onModeChange,
  onDifficultyChange,
  onColorChange,
  onReset,
  onUndo,
  canUndo
}) => {
  return (
    <div className="game-controls">
      <div className="control-group">
        <label>Game Mode:</label>
        <div className="button-group">
          <button
            className={gameMode === 'pvp' ? 'active' : ''}
            onClick={() => onModeChange('pvp')}
          >
            Player vs Player
          </button>
          <button
            className={gameMode === 'ai' ? 'active' : ''}
            onClick={() => onModeChange('ai')}
          >
            vs Computer
          </button>
        </div>
      </div>

      {gameMode === 'ai' && (
        <>
          <div className="control-group">
            <label>Play as:</label>
            <div className="button-group">
              <button
                className={playerColor === 'w' ? 'active' : ''}
                onClick={() => onColorChange('w')}
              >
                White
              </button>
              <button
                className={playerColor === 'b' ? 'active' : ''}
                onClick={() => onColorChange('b')}
              >
                Black
              </button>
            </div>
          </div>

          <div className="control-group">
            <label>Difficulty:</label>
            <div className="button-group difficulty">
              <button
                className={aiDifficulty === 'easy' ? 'active' : ''}
                onClick={() => onDifficultyChange('easy')}
              >
                Easy
              </button>
              <button
                className={aiDifficulty === 'medium' ? 'active' : ''}
                onClick={() => onDifficultyChange('medium')}
              >
                Medium
              </button>
              <button
                className={aiDifficulty === 'hard' ? 'active' : ''}
                onClick={() => onDifficultyChange('hard')}
              >
                Hard
              </button>
            </div>
          </div>
        </>
      )}

      <div className="control-group actions">
        <button className="action-btn reset" onClick={onReset}>
          New Game
        </button>
        <button 
          className="action-btn undo" 
          onClick={onUndo}
          disabled={!canUndo}
        >
          Undo Move
        </button>
      </div>
    </div>
  );
};

export default GameControls;
