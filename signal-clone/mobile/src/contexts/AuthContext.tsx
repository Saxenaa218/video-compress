import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { socketService } from '../services/socket';
import { secureStorage, storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await secureStorage.getToken();
      if (token) {
        const { user: currentUser } = await api.getCurrentUser();
        setUser(currentUser);
        socketService.connect(token);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      await secureStorage.clearAll();
      await storage.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await api.login(username, password);
    await secureStorage.setToken(response.token);
    await storage.setUser(response.user);
    setUser(response.user);
    socketService.connect(response.token);
  };

  const register = async (username: string, password: string) => {
    const response = await api.register(username, password);
    await secureStorage.setToken(response.token);
    if (response.secretKey) {
      await secureStorage.setSecretKey(response.secretKey);
    }
    await storage.setUser(response.user);
    setUser(response.user);
    socketService.connect(response.token);
  };

  const logout = async () => {
    socketService.disconnect();
    await secureStorage.clearAll();
    await storage.clearAll();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
