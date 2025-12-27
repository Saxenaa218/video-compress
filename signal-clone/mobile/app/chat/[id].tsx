import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/services/api';
import { socketService } from '../../src/services/socket';
import { secureStorage } from '../../src/utils/storage';
import { encryptMessage, decryptMessage } from '../../src/utils/encryption';
import { Message, User } from '../../src/types';

interface DecryptedMessage extends Message {
  decryptedContent: string | null;
}

export default function ChatScreen() {
  const { id: conversationId, username } = useLocalSearchParams<{ id: string; username: string }>();
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (username) {
      navigation.setOptions({ title: username });
    }
  }, [username, navigation]);

  useEffect(() => {
    loadData();
    
    return () => {
      if (conversationId) {
        socketService.leaveConversation(conversationId);
      }
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    socketService.joinConversation(conversationId);

    const unsubscribeMessage = socketService.onMessage(conversationId, async (message) => {
      const decryptedContent = await decryptMessageContent(message);
      setMessages((prev) => [...prev, { ...message, decryptedContent }]);
    });

    const unsubscribeTypingStart = socketService.onTypingStart((data) => {
      if (data.conversationId === conversationId && data.userId !== user?.id) {
        setIsTyping(true);
      }
    });

    const unsubscribeTypingStop = socketService.onTypingStop((data) => {
      if (data.conversationId === conversationId && data.userId !== user?.id) {
        setIsTyping(false);
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTypingStart();
      unsubscribeTypingStop();
    };
  }, [conversationId, user?.id, secretKey, otherUser?.publicKey]);

  const loadData = async () => {
    try {
      // Get secret key from secure storage
      const storedSecretKey = await secureStorage.getSecretKey();
      setSecretKey(storedSecretKey);

      // Get conversation details
      const { conversation } = await api.getConversation(conversationId!);
      setOtherUser(conversation.otherUser);

      // Load messages
      const { messages: loadedMessages } = await api.getMessages(conversationId!);
      
      // Decrypt messages
      const decryptedMessages = await Promise.all(
        loadedMessages.map(async (msg) => {
          const decryptedContent = await decryptMessageContentWithKey(
            msg,
            storedSecretKey,
            conversation.otherUser.publicKey
          );
          return { ...msg, decryptedContent };
        })
      );
      
      setMessages(decryptedMessages);
    } catch (error) {
      console.error('Failed to load chat data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const decryptMessageContent = async (message: Message): Promise<string | null> => {
    if (!secretKey || !otherUser) return null;
    return decryptMessageContentWithKey(message, secretKey, otherUser.publicKey);
  };

  const decryptMessageContentWithKey = async (
    message: Message,
    key: string | null,
    senderPublicKey: string
  ): Promise<string | null> => {
    if (!key) return null;

    try {
      // Determine who sent the message to use the correct public key
      const publicKeyToUse = message.senderId === user?.id ? senderPublicKey : message.sender?.publicKey || senderPublicKey;
      
      return decryptMessage(
        message.encryptedContent,
        message.nonce,
        publicKeyToUse,
        key
      );
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !otherUser || !secretKey || !conversationId) return;

    setIsSending(true);
    try {
      // Encrypt the message
      const { encryptedMessage, nonce } = encryptMessage(
        newMessage,
        otherUser.publicKey,
        secretKey
      );

      // Send via socket for real-time delivery
      socketService.sendMessage({
        conversationId,
        receiverId: otherUser.id,
        encryptedContent: encryptedMessage,
        nonce
      });

      // Optimistically add the message to the list
      const optimisticMessage: DecryptedMessage = {
        id: Date.now().toString(),
        conversationId,
        senderId: user!.id,
        receiverId: otherUser.id,
        encryptedContent: encryptedMessage,
        nonce,
        createdAt: new Date().toISOString(),
        decryptedContent: newMessage
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTextChange = (text: string) => {
    setNewMessage(text);
    
    if (text.length > 0 && conversationId) {
      socketService.startTyping(conversationId);
    } else if (conversationId) {
      socketService.stopTyping(conversationId);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: DecryptedMessage }) => {
    const isOwnMessage = item.senderId === user?.id;
    
    return (
      <View style={[styles.messageBubble, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
        <Text style={[styles.messageText, isOwnMessage ? styles.ownMessageText : styles.otherMessageText]}>
          {item.decryptedContent || '🔒 Unable to decrypt'}
        </Text>
        <Text style={[styles.messageTime, isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime]}>
          {formatTime(item.createdAt)}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2C6BED" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.encryptionBanner}>
        <Text style={styles.encryptionText}>🔐 Messages are end-to-end encrypted</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>{username} is typing...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={newMessage}
          onChangeText={handleTextChange}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!newMessage.trim() || isSending) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!newMessage.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  encryptionBanner: {
    backgroundColor: '#e8f5e9',
    padding: 8,
    alignItems: 'center',
  },
  encryptionText: {
    fontSize: 12,
    color: '#2e7d32',
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2C6BED',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: '#999',
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#2C6BED',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 8,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CB8F0',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
