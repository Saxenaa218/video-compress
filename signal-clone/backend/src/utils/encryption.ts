import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

/**
 * Encryption utilities using TweetNaCl for end-to-end encryption
 */

export interface KeyPair {
  publicKey: string;
  secretKey: string;
}

/**
 * Generate a new key pair for encryption
 */
export const generateKeyPair = (): KeyPair => {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    secretKey: naclUtil.encodeBase64(keyPair.secretKey)
  };
};

/**
 * Encrypt a message using the recipient's public key and sender's secret key
 */
export const encryptMessage = (
  message: string,
  recipientPublicKey: string,
  senderSecretKey: string
): { encryptedMessage: string; nonce: string } => {
  const messageUint8 = naclUtil.decodeUTF8(message);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const recipientPublicKeyUint8 = naclUtil.decodeBase64(recipientPublicKey);
  const senderSecretKeyUint8 = naclUtil.decodeBase64(senderSecretKey);

  const encryptedMessage = nacl.box(
    messageUint8,
    nonce,
    recipientPublicKeyUint8,
    senderSecretKeyUint8
  );

  return {
    encryptedMessage: naclUtil.encodeBase64(encryptedMessage),
    nonce: naclUtil.encodeBase64(nonce)
  };
};

/**
 * Decrypt a message using the sender's public key and recipient's secret key
 */
export const decryptMessage = (
  encryptedMessage: string,
  nonce: string,
  senderPublicKey: string,
  recipientSecretKey: string
): string | null => {
  const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage);
  const nonceUint8 = naclUtil.decodeBase64(nonce);
  const senderPublicKeyUint8 = naclUtil.decodeBase64(senderPublicKey);
  const recipientSecretKeyUint8 = naclUtil.decodeBase64(recipientSecretKey);

  const decrypted = nacl.box.open(
    encryptedMessageUint8,
    nonceUint8,
    senderPublicKeyUint8,
    recipientSecretKeyUint8
  );

  if (!decrypted) {
    return null;
  }

  return naclUtil.encodeUTF8(decrypted);
};

/**
 * Generate a hash for verifying message integrity
 */
export const hashMessage = (message: string): string => {
  const messageUint8 = naclUtil.decodeUTF8(message);
  const hash = nacl.hash(messageUint8);
  return naclUtil.encodeBase64(hash);
};
