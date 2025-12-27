import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import socketService from '../services/socket';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { token, userId, username } = await authService.getStoredAuth();
      if (token && userId && username) {
        setUser({ userId, username, token });
        socketService.connect(userId);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setUser({ userId: data.userId, username: data.username, token: data.token });
    socketService.connect(data.userId);
    return data;
  };

  const register = async (username, password) => {
    const data = await authService.register(username, password);
    setUser({ userId: data.userId, username: data.username, token: data.token });
    socketService.connect(data.userId);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    socketService.disconnect();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
