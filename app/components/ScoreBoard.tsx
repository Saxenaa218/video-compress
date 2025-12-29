'use client';

import React from 'react';

interface ScoreBoardProps {
  score: number;
  level: number;
  linesCleared: number;
}

export default function ScoreBoard({ score, level, linesCleared }: ScoreBoardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="text-center">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider">Score</h3>
        <p className="text-white text-2xl font-bold font-mono">{score.toLocaleString()}</p>
      </div>
      <div className="text-center">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider">Level</h3>
        <p className="text-green-400 text-2xl font-bold font-mono">{level}</p>
      </div>
      <div className="text-center">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider">Lines</h3>
        <p className="text-blue-400 text-2xl font-bold font-mono">{linesCleared}</p>
      </div>
    </div>
  );
}
