import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_URL } from '../config';
import { secureStorage } from '../utils/storage';
import { User, Conversation, Message, AuthResponse } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add auth token to requests
    this.client.interceptors.request.use(async (config) => {
      const token = await secureStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async register(username: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/register', {
      username,
      password
    });
    return response.data;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/login', {
      username,
      password
    });
    return response.data;
  }

  // User endpoints
  async getCurrentUser(): Promise<{ user: User }> {
    const response = await this.client.get<{ user: User }>('/api/users/me');
    return response.data;
  }

  async searchUsers(query: string): Promise<{ users: User[] }> {
    const response = await this.client.get<{ users: User[] }>('/api/users/search', {
      params: { q: query }
    });
    return response.data;
  }

  async getUserById(id: string): Promise<{ user: User }> {
    const response = await this.client.get<{ user: User }>(`/api/users/${id}`);
    return response.data;
  }

  // Conversation endpoints
  async getConversations(): Promise<{ conversations: Conversation[] }> {
    const response = await this.client.get<{ conversations: Conversation[] }>('/api/conversations');
    return response.data;
  }

  async createConversation(userId: string): Promise<{ conversation: { id: string; otherUser: User } }> {
    const response = await this.client.post<{ conversation: { id: string; otherUser: User } }>('/api/conversations', {
      userId
    });
    return response.data;
  }

  async getConversation(id: string): Promise<{ conversation: { id: string; otherUser: User } }> {
    const response = await this.client.get<{ conversation: { id: string; otherUser: User } }>(`/api/conversations/${id}`);
    return response.data;
  }

  // Message endpoints
  async getMessages(conversationId: string, cursor?: string): Promise<{ messages: Message[]; nextCursor: string | null }> {
    const response = await this.client.get<{ messages: Message[]; nextCursor: string | null }>(
      `/api/messages/conversation/${conversationId}`,
      { params: { cursor } }
    );
    return response.data;
  }

  async sendMessage(
    conversationId: string,
    receiverId: string,
    encryptedContent: string,
    nonce: string
  ): Promise<{ message: Message }> {
    const response = await this.client.post<{ message: Message }>('/api/messages', {
      conversationId,
      receiverId,
      encryptedContent,
      nonce
    });
    return response.data;
  }
}

export const api = new ApiService();
