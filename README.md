# 🎮 Pacman Game

A classic Pacman arcade game clone built with Next.js and React. Navigate the maze, collect pellets, and avoid ghosts to score points!

## Features

- **Classic Gameplay**: Navigate the maze as Pacman, collecting pellets while avoiding ghosts
- **Ghost AI**: Four unique ghosts with different AI behaviors (chase, ambush, random)
- **Power-ups**: Collect power pellets to temporarily frighten ghosts and eat them for bonus points
- **Level Progression**: Complete levels by collecting all pellets
- **Sound Effects**: Retro-style sound effects using Web Audio API
- **Responsive Controls**: Keyboard (Arrow keys/WASD) and touch controls for mobile
- **Score Tracking**: Track your score, lives, and current level

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

- **Movement**: Use Arrow Keys or WASD to move Pacman
- **Pause/Start**: Press Space to pause or start the game
- **Sound**: Press M to toggle sound on/off

### Scoring

- Regular Pellet: 10 points
- Power Pellet: 50 points
- Ghost (when frightened): 200, 400, 800, 1600 points (doubles with each consecutive ghost)

## Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Web Audio API** - Sound effects

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and animations
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main game page
├── components/
│   └── game/
│       ├── Game.tsx         # Main game container
│       ├── GameBoard.tsx    # Game board rendering
│       ├── Cell.tsx         # Maze cell rendering
│       ├── Pacman.tsx       # Pacman character
│       ├── Ghost.tsx        # Ghost characters
│       ├── Controls.tsx     # Touch controls
│       └── ScoreDisplay.tsx # Score and status display
├── hooks/
│   └── useGameState.ts  # Game state management
├── types/
│   └── game.ts          # TypeScript types
└── utils/
    ├── maze.ts          # Maze utilities and constants
    └── sounds.ts        # Sound effect manager
```

## Building for Production

```bash
npm run build
npm run start
```

## License

MIT
