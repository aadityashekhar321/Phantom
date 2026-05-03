/**
 * Tests for lib/crypto.ts
 *
 * Covers:
 *  - encryptMessage / decryptMessage round-trip
 *  - Wrong password raises an error
 *  - Tampered ciphertext raises an error
 *  - Empty string content
 *  - Unicode / multi-byte content
 *  - encryptDuoMessage with both main and decoy passwords
 *  - deobfuscateTokens: new compact (PHMX) format
 *  - deobfuscateTokens: legacy multi-line block format
 *  - deobfuscateTokens: invalid format raises an error
 *  - Ciphertext too short raises an error
 */

import { describe, it, expect } from 'vitest';
import { encryptMessage, decryptMessage, encryptDuoMessage } from '../lib/crypto';

describe('encryptMessage / decryptMessage', () => {
  it('round-trips a plain ASCII message', async () => {
    const original = 'Hello, Phantom!';
    const password = 'super-secret-password';

    const cipher = await encryptMessage(original, password);
    const plain = await decryptMessage(cipher, password);

    expect(plain).toBe(original);
  });

  it('round-trips an empty string', async () => {
    const cipher = await encryptMessage('', 'password123');
    const plain = await decryptMessage(cipher, 'password123');

    expect(plain).toBe('');
  });

  it('round-trips a unicode / multi-byte string', async () => {
    const original = '日本語テスト 🔐 émoji';
    const cipher = await encryptMessage(original, 'unicodePass');
    const plain = await decryptMessage(cipher, 'unicodePass');

    expect(plain).toBe(original);
  });

  it('round-trips a long message', async () => {
    const original = 'A'.repeat(10_000);
    const cipher = await encryptMessage(original, 'longPass');
    const plain = await decryptMessage(cipher, 'longPass');

    expect(plain).toBe(original);
  });

  it('produces different ciphertexts for the same input (random salt/IV)', async () => {
    const text = 'determinism test';
    const pass = 'same-password';

    const c1 = await encryptMessage(text, pass);
    const c2 = await encryptMessage(text, pass);

    // Output should differ because salt and IV are random
    expect(c1).not.toBe(c2);
  });

  it('ciphertext starts with the PHMX prefix', async () => {
    const cipher = await encryptMessage('test', 'pass');
    expect(cipher.startsWith('PHMX')).toBe(true);
  });

  it('throws when decrypting with the wrong password', async () => {
    const cipher = await encryptMessage('secret', 'correct-pass');

    await expect(decryptMessage(cipher, 'wrong-pass')).rejects.toThrow();
  });

  it('throws when ciphertext is tampered', async () => {
    const cipher = await encryptMessage('tamper me', 'pass');

    // Flip a character in the middle of the ciphertext body
    const mid = Math.floor(cipher.length / 2);
    const tampered = cipher.slice(0, mid) + (cipher[mid] === 'A' ? 'B' : 'A') + cipher.slice(mid + 1);

    await expect(decryptMessage(tampered, 'pass')).rejects.toThrow();
  });

  it('throws on ciphertext that is too short', async () => {
    // PHMX + reversed base64 of fewer than 28 bytes → will be too short
    const tooShort = 'PHMXdGVzdA=='; // reversed base64 of "dGVzdA==" which decodes to 4 bytes

    await expect(decryptMessage(tooShort, 'pass')).rejects.toThrow();
  });

  it('throws on a completely invalid ciphertext', async () => {
    await expect(decryptMessage('not-a-valid-cipher', 'pass')).rejects.toThrow();
  });
});

describe('encryptDuoMessage / decryptMessage', () => {
  it('decrypts with the main password and returns main text', async () => {
    const mainText = 'Main secret message';
    const mainPass = 'main-password';
    const decoyText = 'This is the decoy';
    const decoyPass = 'decoy-password';

    const duo = await encryptDuoMessage(mainText, mainPass, decoyText, decoyPass);

    expect(duo.startsWith('PHMD')).toBe(true);
    expect(duo.includes('DUO')).toBe(true);

    const result = await decryptMessage(duo, mainPass);
    expect(result).toBe(mainText);
  });

  it('decrypts with the decoy password and returns decoy text', async () => {
    const mainText = 'Main secret message';
    const mainPass = 'main-password';
    const decoyText = 'Innocent decoy text';
    const decoyPass = 'decoy-password';

    const duo = await encryptDuoMessage(mainText, mainPass, decoyText, decoyPass);
    const result = await decryptMessage(duo, decoyPass);

    expect(result).toBe(decoyText);
  });

  it('throws when neither password matches in a DUO message', async () => {
    const duo = await encryptDuoMessage('main', 'pass1', 'decoy', 'pass2');

    await expect(decryptMessage(duo, 'wrong-password')).rejects.toThrow();
  });

  it('round-trips unicode in both slots', async () => {
    const main = '🔐 Main: こんにちは';
    const decoy = '🌸 Decoy: güd';

    const duo = await encryptDuoMessage(main, 'mp', decoy, 'dp');

    expect(await decryptMessage(duo, 'mp')).toBe(main);
    expect(await decryptMessage(duo, 'dp')).toBe(decoy);
  });
});

describe('deobfuscateTokens — legacy multi-line block format', () => {
  /**
   * Build a legacy PHANTOM SECURE BLOCK payload from raw base64.
   * The old format reverses the base64, then wraps it between header/footer.
   */
  function buildLegacyBlock(rawBase64: string): string {
    const reversed = rawBase64.split('').reverse().join('');
    const header = '--- PHANTOM SECURE BLOCK REVISION 1 ---';
    const footer = '--- END OF SECURE BLOCK ---';
    return `${header}\n${reversed}\n${footer}`;
  }

  it('decrypts a ciphertext wrapped in the legacy block format', async () => {
    // Encrypt normally (produces PHMX format)
    const cipher = await encryptMessage('legacy round-trip', 'leg-pass');

    // Extract the raw base64 by reversing the PHMX obfuscation
    const reversedPart = cipher.slice(4); // strip "PHMX"
    const rawBase64 = reversedPart.split('').reverse().join('');

    // Re-wrap in legacy format
    const legacy = buildLegacyBlock(rawBase64);

    // decryptMessage should handle the legacy block transparently
    const plain = await decryptMessage(legacy, 'leg-pass');
    expect(plain).toBe('legacy round-trip');
  });

  it('throws when the legacy block header is malformed', async () => {
    // Include "PHANTOM SECURE BLOCK" text but with wrong header/footer —
    // decryptMessage wraps all internal errors with a generic message.
    const broken = 'PHANTOM SECURE BLOCK corrupted payload';
    await expect(decryptMessage(broken, 'any')).rejects.toThrow(
      'Decryption failed. Incorrect password or modified ciphertext.'
    );
  });

  it('throws when the ciphertext has an unknown format', async () => {
    // decryptMessage wraps deobfuscateTokens errors with a generic message.
    await expect(decryptMessage('UNKNOWNFORMAT', 'any')).rejects.toThrow(
      'Decryption failed. Incorrect password or modified ciphertext.'
    );
  });
});
