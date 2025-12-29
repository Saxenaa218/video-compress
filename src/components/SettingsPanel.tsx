'use client';

import React from 'react';
import { GameSettings } from '@/types/game';

interface SettingsPanelProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  disabled: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  disabled,
}) => {
  const handleChange = (key: keyof GameSettings, value: number | boolean) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg w-full max-w-md">
      <h3 className="text-lg font-semibold text-white mb-4">Game Settings</h3>
      
      <div className="space-y-4">
        {/* Board Size */}
        <div className="flex items-center justify-between">
          <label className="text-gray-300 text-sm">Board Size</label>
          <select
            value={settings.boardWidth}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              handleChange('boardWidth', size);
              handleChange('boardHeight', size);
            }}
            disabled={disabled}
            className="bg-gray-700 text-white rounded px-3 py-1 text-sm disabled:opacity-50"
          >
            <option value={15}>Small (15x15)</option>
            <option value={20}>Medium (20x20)</option>
            <option value={25}>Large (25x25)</option>
          </select>
        </div>

        {/* Initial Speed */}
        <div className="flex items-center justify-between">
          <label className="text-gray-300 text-sm">Initial Speed</label>
          <select
            value={settings.initialSpeed}
            onChange={(e) => handleChange('initialSpeed', parseInt(e.target.value))}
            disabled={disabled}
            className="bg-gray-700 text-white rounded px-3 py-1 text-sm disabled:opacity-50"
          >
            <option value={200}>Slow</option>
            <option value={150}>Normal</option>
            <option value={100}>Fast</option>
            <option value={75}>Very Fast</option>
          </select>
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between">
          <label className="text-gray-300 text-sm">Sound Effects</label>
          <button
            onClick={() => handleChange('enableSound', !settings.enableSound)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              settings.enableSound
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-gray-300'
            }`}
          >
            {settings.enableSound ? 'On' : 'Off'}
          </button>
        </div>

        {/* Animations */}
        <div className="flex items-center justify-between">
          <label className="text-gray-300 text-sm">Animations</label>
          <button
            onClick={() => handleChange('enableAnimations', !settings.enableAnimations)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              settings.enableAnimations
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-gray-300'
            }`}
          >
            {settings.enableAnimations ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {disabled && (
        <p className="mt-4 text-yellow-500 text-xs text-center">
          Pause or reset the game to change settings
        </p>
      )}
    </div>
  );
};

export default SettingsPanel;
