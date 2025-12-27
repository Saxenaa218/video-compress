import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const SECRET_KEY = 'encryption_secret_key';

/**
 * Storage utilities for secure and persistent data storage
 */

// Secure storage for sensitive data
export const secureStorage = {
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  },

  async setSecretKey(secretKey: string): Promise<void> {
    await SecureStore.setItemAsync(SECRET_KEY, secretKey);
  },

  async getSecretKey(): Promise<string | null> {
    return await SecureStore.getItemAsync(SECRET_KEY);
  },

  async removeSecretKey(): Promise<void> {
    await SecureStore.deleteItemAsync(SECRET_KEY);
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(AUTH_TOKEN_KEY),
      SecureStore.deleteItemAsync(SECRET_KEY)
    ]);
  }
};

// Regular storage for non-sensitive data
export const storage = {
  async setUser(user: object): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  }
};
