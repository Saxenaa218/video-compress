# Chess Game

A fully-featured chess game application built with React, featuring player vs player and player vs computer modes with an AI opponent.

## Features

- **Two Game Modes**:
  - **Player vs Player (PvP)**: Play against a friend locally on the same device
  - **vs Computer**: Play against an AI opponent with adjustable difficulty

- **Chess Game Logic**:
  - Complete chess rules implementation using [chess.js](https://github.com/jhlywa/chess.js)
  - Move validation for all pieces
  - Special moves: castling, en passant, pawn promotion
  - Check, checkmate, and draw detection (stalemate, threefold repetition, insufficient material)

- **Interactive Chessboard**:
  - Beautiful chessboard UI using [react-chessboard](https://github.com/Clariity/react-chessboard)
  - Drag and drop piece movement
  - Click-to-move functionality
  - Move highlighting for legal moves
  - Check indicator (king highlighted in red when in check)

- **AI Opponent**:
  - Minimax algorithm with alpha-beta pruning
  - Three difficulty levels: Easy, Medium, Hard
  - Position evaluation based on piece values and positional bonuses
  - Option to play as White or Black

- **Game History**:
  - Full move history tracking in standard algebraic notation
  - Click on any move to review that position
  - Current position highlighting

- **Game Controls**:
  - New Game button to reset the board
  - Undo move functionality
  - Mode and difficulty switching

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── ChessGame.jsx       # Main game component
│   ├── ChessGame.css       # Game component styles
│   ├── GameHistory.jsx     # Move history display
│   ├── GameHistory.css     # History component styles
│   ├── GameControls.jsx    # Game mode and control buttons
│   └── GameControls.css    # Controls component styles
├── utils/
│   └── chessAI.js          # AI opponent implementation
├── App.jsx                 # Root component
├── App.css                 # App styles
├── index.css               # Global styles
└── main.jsx                # Application entry point
```

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **chess.js** - Chess game logic and move validation
- **react-chessboard** - Chessboard UI component

## AI Implementation

The AI uses the minimax algorithm with alpha-beta pruning for move selection. The evaluation function considers:

- **Material value**: Standard piece values (pawn=100, knight=320, bishop=330, rook=500, queen=900)
- **Positional bonuses**: Piece-square tables that encourage good piece placement

Difficulty levels control the search depth:
- Easy: Depth 1 (with occasional random moves)
- Medium: Depth 2
- Hard: Depth 3

## License

MIT
