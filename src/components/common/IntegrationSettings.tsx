'use client';

import React, { useState, useEffect } from 'react';
import { IntegrationConfig } from '@/types';

const INTEGRATIONS_KEY = 'task_manager_integrations';

interface IntegrationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultIntegrations: IntegrationConfig[] = [
  { type: 'trello', enabled: false },
  { type: 'asana', enabled: false },
];

function getStoredIntegrations(): IntegrationConfig[] {
  if (typeof window === 'undefined') return defaultIntegrations;
  const stored = localStorage.getItem(INTEGRATIONS_KEY);
  return stored ? JSON.parse(stored) : defaultIntegrations;
}

function setStoredIntegrations(integrations: IntegrationConfig[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INTEGRATIONS_KEY, JSON.stringify(integrations));
}

export default function IntegrationSettings({ isOpen, onClose }: IntegrationSettingsProps) {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(defaultIntegrations);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    const storedIntegrations = getStoredIntegrations();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIntegrations(storedIntegrations);
  }, []);

  const handleToggle = (type: 'trello' | 'asana') => {
    setIntegrations((prev) => {
      const updated = prev.map((i) =>
        i.type === type ? { ...i, enabled: !i.enabled } : i
      );
      setStoredIntegrations(updated);
      return updated;
    });
  };

  const handleApiKeyChange = (type: 'trello' | 'asana', apiKey: string) => {
    setIntegrations((prev) => {
      const updated = prev.map((i) => (i.type === type ? { ...i, apiKey } : i));
      setStoredIntegrations(updated);
      return updated;
    });
  };

  const handleBoardIdChange = (type: 'trello' | 'asana', boardId: string) => {
    setIntegrations((prev) => {
      const updated = prev.map((i) =>
        i.type === type ? { ...i, boardId: type === 'trello' ? boardId : undefined, projectId: type === 'asana' ? boardId : undefined } : i
      );
      setStoredIntegrations(updated);
      return updated;
    });
  };

  const handleSync = async (type: 'trello' | 'asana') => {
    setSyncing(type);
    // Simulate sync with API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSyncing(null);
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} sync completed! (This is a demo)`);
  };

  const trelloConfig = integrations.find((i) => i.type === 'trello') || defaultIntegrations[0];
  const asanaConfig = integrations.find((i) => i.type === 'asana') || defaultIntegrations[1];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Trello Integration */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H5V7h7v10zm8 0h-7V7h7v10z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Trello</h3>
                  <p className="text-sm text-gray-500">Sync tasks with Trello boards</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={trelloConfig.enabled}
                  onChange={() => handleToggle('trello')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {trelloConfig.enabled && (
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={trelloConfig.apiKey || ''}
                    onChange={(e) => handleApiKeyChange('trello', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your Trello API key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Board ID
                  </label>
                  <input
                    type="text"
                    value={trelloConfig.boardId || ''}
                    onChange={(e) => handleBoardIdChange('trello', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your Trello board ID"
                  />
                </div>
                <button
                  onClick={() => handleSync('trello')}
                  disabled={syncing === 'trello'}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {syncing === 'trello' ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Syncing...
                    </>
                  ) : (
                    'Sync Now'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Asana Integration */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="6" r="4"/>
                    <circle cx="5" cy="16" r="4"/>
                    <circle cx="19" cy="16" r="4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Asana</h3>
                  <p className="text-sm text-gray-500">Sync tasks with Asana projects</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={asanaConfig.enabled}
                  onChange={() => handleToggle('asana')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {asanaConfig.enabled && (
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Access Token
                  </label>
                  <input
                    type="password"
                    value={asanaConfig.apiKey || ''}
                    onChange={(e) => handleApiKeyChange('asana', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your Asana access token"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project ID
                  </label>
                  <input
                    type="text"
                    value={asanaConfig.projectId || ''}
                    onChange={(e) => handleBoardIdChange('asana', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your Asana project ID"
                  />
                </div>
                <button
                  onClick={() => handleSync('asana')}
                  disabled={syncing === 'asana'}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {syncing === 'asana' ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Syncing...
                    </>
                  ) : (
                    'Sync Now'
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            Note: Integration sync is a demo feature. In production, connect to actual Trello/Asana APIs.
          </p>
        </div>
      </div>
    </div>
  );
}
