import './GameHistory.css';

const GameHistory = ({ history, onMoveClick, currentFen }) => {
  // Group moves by move number (each move number has white and black moves)
  const groupedMoves = [];
  
  for (let i = 0; i < history.length; i += 2) {
    const whiteMove = history[i];
    const blackMove = history[i + 1];
    
    groupedMoves.push({
      moveNumber: whiteMove?.moveNumber || Math.floor(i / 2) + 1,
      white: whiteMove,
      black: blackMove
    });
  }

  return (
    <div className="game-history">
      <h3>Move History</h3>
      
      {history.length === 0 ? (
        <p className="no-moves">No moves yet. Start playing!</p>
      ) : (
        <div className="moves-container">
          <table className="moves-table">
            <thead>
              <tr>
                <th>#</th>
                <th>White</th>
                <th>Black</th>
              </tr>
            </thead>
            <tbody>
              {groupedMoves.map((group, index) => (
                <tr key={index}>
                  <td className="move-number">{group.moveNumber}.</td>
                  <td>
                    {group.white && (
                      <button
                        className={`move-btn ${group.white.fen === currentFen ? 'current' : ''}`}
                        onClick={() => onMoveClick(group.white.fen)}
                      >
                        {group.white.move}
                      </button>
                    )}
                  </td>
                  <td>
                    {group.black && (
                      <button
                        className={`move-btn ${group.black.fen === currentFen ? 'current' : ''}`}
                        onClick={() => onMoveClick(group.black.fen)}
                      >
                        {group.black.move}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="history-info">
        <p>Click on any move to view that position</p>
      </div>
    </div>
  );
};

export default GameHistory;
