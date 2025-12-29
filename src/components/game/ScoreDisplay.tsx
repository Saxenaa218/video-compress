'use client';

import React from 'react';

interface ScoreDisplayProps {
  score: number;
  lives: number;
  level: number;
  isPowerMode: boolean;
}

export default function ScoreDisplay({ score, lives, level, isPowerMode }: ScoreDisplayProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-4 w-full max-w-md px-4">
      <div className="text-center">
        <p className="text-gray-400 text-xs uppercase">Score</p>
        <p className="text-yellow-400 text-2xl font-bold font-mono">{score.toString().padStart(6, '0')}</p>
      </div>
      
      <div className="text-center">
        <p className="text-gray-400 text-xs uppercase">Level</p>
        <p className="text-cyan-400 text-2xl font-bold">{level}</p>
      </div>
      
      <div className="text-center">
        <p className="text-gray-400 text-xs uppercase">Lives</p>
        <div className="flex gap-1">
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i} className="text-xl">🟡</span>
          ))}
          {Array.from({ length: 3 - lives }).map((_, i) => (
            <span key={i + lives} className="text-xl opacity-30">⚫</span>
          ))}
        </div>
      </div>
      
      {isPowerMode && (
        <div className="w-full text-center">
          <p className="text-blue-400 font-bold animate-pulse">⚡ POWER MODE ⚡</p>
        </div>
      )}
    </div>
  );
}
