import { generateKeyPair, encryptMessage, decryptMessage, hashMessage } from './encryption';

describe('Encryption Utils', () => {
  describe('generateKeyPair', () => {
    it('should generate a valid key pair', () => {
      const keyPair = generateKeyPair();
      
      expect(keyPair).toHaveProperty('publicKey');
      expect(keyPair).toHaveProperty('secretKey');
      expect(typeof keyPair.publicKey).toBe('string');
      expect(typeof keyPair.secretKey).toBe('string');
      expect(keyPair.publicKey.length).toBeGreaterThan(0);
      expect(keyPair.secretKey.length).toBeGreaterThan(0);
    });

    it('should generate unique key pairs', () => {
      const keyPair1 = generateKeyPair();
      const keyPair2 = generateKeyPair();
      
      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey);
      expect(keyPair1.secretKey).not.toBe(keyPair2.secretKey);
    });
  });

  describe('encryptMessage and decryptMessage', () => {
    it('should encrypt and decrypt a message successfully', () => {
      const senderKeyPair = generateKeyPair();
      const recipientKeyPair = generateKeyPair();
      const originalMessage = 'Hello, this is a secret message!';

      const encrypted = encryptMessage(
        originalMessage,
        recipientKeyPair.publicKey,
        senderKeyPair.secretKey
      );

      expect(encrypted).toHaveProperty('encryptedMessage');
      expect(encrypted).toHaveProperty('nonce');
      expect(encrypted.encryptedMessage).not.toBe(originalMessage);

      const decrypted = decryptMessage(
        encrypted.encryptedMessage,
        encrypted.nonce,
        senderKeyPair.publicKey,
        recipientKeyPair.secretKey
      );

      expect(decrypted).toBe(originalMessage);
    });

    it('should fail to decrypt with wrong keys', () => {
      const senderKeyPair = generateKeyPair();
      const recipientKeyPair = generateKeyPair();
      const wrongKeyPair = generateKeyPair();
      const originalMessage = 'Secret message';

      const encrypted = encryptMessage(
        originalMessage,
        recipientKeyPair.publicKey,
        senderKeyPair.secretKey
      );

      const decrypted = decryptMessage(
        encrypted.encryptedMessage,
        encrypted.nonce,
        wrongKeyPair.publicKey, // Wrong sender key
        recipientKeyPair.secretKey
      );

      expect(decrypted).toBeNull();
    });

    it('should handle empty messages', () => {
      const senderKeyPair = generateKeyPair();
      const recipientKeyPair = generateKeyPair();
      const originalMessage = '';

      const encrypted = encryptMessage(
        originalMessage,
        recipientKeyPair.publicKey,
        senderKeyPair.secretKey
      );

      const decrypted = decryptMessage(
        encrypted.encryptedMessage,
        encrypted.nonce,
        senderKeyPair.publicKey,
        recipientKeyPair.secretKey
      );

      expect(decrypted).toBe(originalMessage);
    });

    it('should handle unicode messages', () => {
      const senderKeyPair = generateKeyPair();
      const recipientKeyPair = generateKeyPair();
      const originalMessage = '你好世界! 🔐 Γειά σου κόσμε!';

      const encrypted = encryptMessage(
        originalMessage,
        recipientKeyPair.publicKey,
        senderKeyPair.secretKey
      );

      const decrypted = decryptMessage(
        encrypted.encryptedMessage,
        encrypted.nonce,
        senderKeyPair.publicKey,
        recipientKeyPair.secretKey
      );

      expect(decrypted).toBe(originalMessage);
    });
  });

  describe('hashMessage', () => {
    it('should generate a consistent hash for the same message', () => {
      const message = 'Test message';
      const hash1 = hashMessage(message);
      const hash2 = hashMessage(message);
      
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different messages', () => {
      const hash1 = hashMessage('Message 1');
      const hash2 = hashMessage('Message 2');
      
      expect(hash1).not.toBe(hash2);
    });
  });
});
