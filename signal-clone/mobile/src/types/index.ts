export interface User {
  id: string;
  username: string;
  publicKey: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  encryptedContent: string;
  nonce: string;
  createdAt: string;
  sender?: User;
  // Decrypted content (only available client-side after decryption)
  content?: string;
}

export interface Conversation {
  id: string;
  otherUser: User;
  lastMessage?: Message;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  secretKey?: string; // Only returned on registration
}

export interface KeyPair {
  publicKey: string;
  secretKey: string;
}
