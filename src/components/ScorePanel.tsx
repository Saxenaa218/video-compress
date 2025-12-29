'use client';

import React from 'react';

interface ScorePanelProps {
  score: number;
  level: number;
  highScore: number;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ score, level, highScore }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-md bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="text-center">
        <p className="text-gray-400 text-sm uppercase tracking-wide">Score</p>
        <p className="text-2xl font-bold text-green-400">{score}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-400 text-sm uppercase tracking-wide">Level</p>
        <p className="text-2xl font-bold text-yellow-400">{level}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-400 text-sm uppercase tracking-wide">High Score</p>
        <p className="text-2xl font-bold text-purple-400">{highScore}</p>
      </div>
    </div>
  );
};

export default ScorePanel;
