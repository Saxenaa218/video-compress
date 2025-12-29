'use client';

import React from 'react';

interface GameSettingsProps {
  soundEnabled: boolean;
  onSoundToggle: () => void;
  ghostPieceEnabled: boolean;
  onGhostPieceToggle: () => void;
  startLevel: number;
  onStartLevelChange: (level: number) => void;
  isGameActive: boolean;
}

export default function GameSettings({
  soundEnabled,
  onSoundToggle,
  ghostPieceEnabled,
  onGhostPieceToggle,
  startLevel,
  onStartLevelChange,
  isGameActive,
}: GameSettingsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-sm font-semibold mb-3 text-center">SETTINGS</h3>
      
      <div className="space-y-3">
        {/* Sound toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Sound</span>
          <button
            onClick={onSoundToggle}
            className={`w-12 h-6 rounded-full transition-colors ${
              soundEnabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
            aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Ghost piece toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Ghost Piece</span>
          <button
            onClick={onGhostPieceToggle}
            className={`w-12 h-6 rounded-full transition-colors ${
              ghostPieceEnabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
            aria-label={ghostPieceEnabled ? 'Disable ghost piece' : 'Enable ghost piece'}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                ghostPieceEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Start level selector */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Start Level</span>
          <select
            value={startLevel}
            onChange={(e) => onStartLevelChange(parseInt(e.target.value))}
            disabled={isGameActive}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 disabled:opacity-50"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
