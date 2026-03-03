/**
 * Phantom Crypto Utilities
 * Uses Web Crypto API (AES-256-GCM, PBKDF2) for secure, client-side encryption.
 */

const ITERATIONS = 100000;
const KEY_LENGTH = 256;
const SALT_SIZE = 16;
const IV_SIZE = 12;

// Helper to convert strings to Application/UTF-8 bytes
const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Derive an AES-GCM CryptoKey from a user password using PBKDF2.
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a plaintext message with a password.
 * Structure of output buffer: [salt (16 bytes)] + [iv (12 bytes)] + [ciphertext]
 */
export async function encryptMessage(text: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));

  const key = await deriveKey(password, salt);
  const encodedData = encoder.encode(text);

  const encryptedBuf = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    encodedData
  );

  const encryptedArray = new Uint8Array(encryptedBuf);

  // Combine salt, iv, and ciphertext
  const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(encryptedArray, salt.length + iv.length);

  // Convert to Base64 and obfuscate
  const base64Str = arrayBufferToBase64(combined.buffer);
  return obfuscateTokens(base64Str);
}

/**
 * Decrypt an obfuscated Base64 encoded ciphertext using the password.
 */
export async function decryptMessage(encryptedBase64: string, password: string): Promise<string> {
  try {
    const cleanBase64 = deobfuscateTokens(encryptedBase64);
    const combinedBuffer = base64ToArrayBuffer(cleanBase64);
    const combined = new Uint8Array(combinedBuffer);

    if (combined.length < SALT_SIZE + IV_SIZE) {
      throw new Error('Invalid or corrupted cipher data.');
    }

    const salt = combined.slice(0, SALT_SIZE);
    const iv = combined.slice(SALT_SIZE, SALT_SIZE + IV_SIZE);
    const ciphertext = combined.slice(SALT_SIZE + IV_SIZE);

    const key = await deriveKey(password, salt);

    const decryptedBuf = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
      },
      key,
      ciphertext as BufferSource
    );

    return decoder.decode(decryptedBuf);
  } catch {
    throw new Error('Decryption failed. Incorrect password or modified ciphertext.');
  }
}

// Transform functions
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// Compact token obfuscation: prefix + reversed base64
// Format: PHMX<reversed_base64>
// This avoids the multi-line separator overhead that inflated large-file ciphertext by ~35%
function obfuscateTokens(base64Str: string): string {
  const reversed = base64Str.split('').reverse().join('');
  return `PHMX${reversed}`;
}

function deobfuscateTokens(obfuscatedStr: string): string {
  const trimmed = obfuscatedStr.trim();

  // Support new compact format
  if (trimmed.startsWith('PHMX')) {
    const reversed = trimmed.slice(4);
    return reversed.split('').reverse().join('');
  }

  // Backwards compatibility: support old multi-line format
  if (trimmed.includes('PHANTOM SECURE BLOCK')) {
    const header = '--- PHANTOM SECURE BLOCK REVISION 1 ---';
    const footer = '--- END OF SECURE BLOCK ---';
    const startIdx = trimmed.indexOf(header);
    const endIdx = trimmed.lastIndexOf(footer);
    if (startIdx === -1 || endIdx === -1) {
      throw new Error('Invalid cipher block structure');
    }
    const payload = trimmed.substring(startIdx + header.length, endIdx);
    const pureData = payload
      .replace(/\r?\n|\r/g, '')
      .replace(/-==-/g, '')
      .trim();
    return pureData.split('').reverse().join('');
  }

  throw new Error('Invalid code format. Ensure you paste the complete Phantom ciphertext.');
}
