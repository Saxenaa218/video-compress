import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your server IP address when testing on device
const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  async register(username, password) {
    const response = await api.post('/api/auth/register', { username, password });
    const { token, userId } = response.data;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('username', username);
    return response.data;
  },

  async login(username, password) {
    const response = await api.post('/api/auth/login', { username, password });
    const { token, userId } = response.data;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('username', username);
    return response.data;
  },

  async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
  },

  async getStoredAuth() {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    const username = await AsyncStorage.getItem('username');
    return { token, userId, username };
  },
};

// User services
export const userService = {
  async getUsers() {
    const response = await api.get('/api/users');
    return response.data;
  },

  async searchUsers(query) {
    const response = await api.get(`/api/users/search?q=${query}`);
    return response.data;
  },
};

// Conversation services
export const conversationService = {
  async getConversations() {
    const response = await api.get('/api/conversations');
    return response.data;
  },

  async createConversation(otherUserId) {
    const response = await api.post('/api/conversations', { otherUserId });
    return response.data;
  },
};

// Message services
export const messageService = {
  async getMessages(otherUserId) {
    const response = await api.get(`/api/messages/${otherUserId}`);
    return response.data;
  },

  async sendMessage(receiverId, content) {
    const response = await api.post('/api/messages', { receiverId, content });
    return response.data;
  },

  async uploadFile(receiverId, fileUri, fileName, fileType) {
    const formData = new FormData();
    formData.append('receiverId', receiverId);
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: fileType,
    });

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export { API_URL };
export default api;
