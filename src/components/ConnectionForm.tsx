'use client';

import { useState } from 'react';
import { FTPConfig } from '@/types/ftp';

interface ConnectionFormProps {
  onConnect: (config: FTPConfig) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  isLoading: boolean;
}

export default function ConnectionForm({ onConnect, onDisconnect, isConnected, isLoading }: ConnectionFormProps) {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('21');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(false);
  const [rejectUnauthorized, setRejectUnauthorized] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect({
      host,
      port: parseInt(port, 10),
      user,
      password,
      secure,
      rejectUnauthorized,
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
        FTP Server Configuration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="host" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Host
            </label>
            <input
              type="text"
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="ftp.example.com"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
              disabled={isConnected || isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="port" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Port
            </label>
            <input
              type="number"
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="21"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
              disabled={isConnected || isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="username"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
              disabled={isConnected || isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
              disabled={isConnected || isLoading}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="secure"
              checked={secure}
              onChange={(e) => setSecure(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded"
              disabled={isConnected || isLoading}
            />
            <label htmlFor="secure" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
              Use FTPS (Secure FTP)
            </label>
          </div>
          {secure && (
            <div className="ml-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rejectUnauthorized"
                  checked={!rejectUnauthorized}
                  onChange={(e) => setRejectUnauthorized(!e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-zinc-300 rounded"
                  disabled={isConnected || isLoading}
                />
                <label htmlFor="rejectUnauthorized" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                  Allow self-signed certificates
                </label>
              </div>
              {!rejectUnauthorized && (
                <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                  ⚠️ Warning: Disabling certificate validation may expose your connection to security risks.
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {!isConnected ? (
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onDisconnect}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
