# Tetris Game

A classic Tetris game clone built with Next.js and React. Stack blocks, clear lines, and beat your high score!

## Features

- **Classic Gameplay**: Rotate and drop falling tetrominoes to complete rows and score points
- **Score Tracking**: Keep track of your score, level, and lines cleared
- **Level Progression**: Game speeds up as you advance through levels
- **Ghost Piece**: See where your piece will land with the ghost piece feature
- **Sound Effects**: Audio feedback for moves, rotations, line clears, and more
- **Customizable Settings**: Toggle sound and ghost piece, choose starting level
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Controls**: On-screen buttons for mobile play
- **Keyboard Controls**:
  - ← / A: Move left
  - → / D: Move right
  - ↑ / W: Rotate
  - ↓ / S: Soft drop
  - Space: Hard drop
  - P / Esc: Pause

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## How to Play

1. Press START GAME or ENTER to begin
2. Use arrow keys or WASD to move and rotate pieces
3. Stack pieces to complete horizontal lines
4. Completed lines are cleared and add to your score
5. Game ends when pieces stack to the top
6. Clear more lines at once for bonus points!

## Scoring

- 1 line: 100 × (level + 1)
- 2 lines: 300 × (level + 1)
- 3 lines: 500 × (level + 1)
- 4 lines (Tetris!): 800 × (level + 1)
- Soft drop: +1 per cell
- Hard drop: +2 per cell

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- Web Audio API - Sound effects

## Project Structure

```
app/
├── components/
│   ├── Controls.tsx       # Touch/button controls
│   ├── GameBoard.tsx      # Main game grid
│   ├── GameOverlay.tsx    # Start/pause/game over screens
│   ├── GameSettings.tsx   # Settings panel
│   ├── NextPiece.tsx      # Next piece preview
│   ├── ScoreBoard.tsx     # Score display
│   └── TetrisGame.tsx     # Main game component
├── hooks/
│   └── useTetris.ts       # Game state and logic hook
├── lib/
│   ├── constants.ts       # Game constants
│   ├── gameLogic.ts       # Core game logic
│   └── sounds.ts          # Sound manager
├── layout.tsx
├── page.tsx
└── globals.css
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
