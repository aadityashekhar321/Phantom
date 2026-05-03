/**
 * Tests for lib/shareRevocationStore.ts
 *
 * Covers:
 *  - isValidId validation (rejects short, long, and non-string IDs)
 *  - registerShareLink stores a new record
 *  - getShareLinkStatus returns { exists: false } for unknown IDs
 *  - getShareLinkStatus returns correct fields after registration
 *  - revokeShareLink marks a record revoked and returns true
 *  - revokeShareLink returns false for unknown IDs
 *  - getShareLinkStatus.expired reflects expiry timestamp
 *  - getShareLinkStatus.revoked reflects revokedAt timestamp
 *  - pruneStore removes records that are older than RETENTION_MS
 *  - pruneStore removes records whose expiresAt is older than RETENTION_MS
 *  - registerShareLink rejects IDs that are too short
 *  - registerShareLink rejects IDs that are too long
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock `server-only` so the module can be imported outside Next.js ─────────
vi.mock('server-only', () => ({}));

// ─── In-memory filesystem mock ────────────────────────────────────────────────
// We replace `fs/promises` with an in-memory store so tests do not touch disk.

let memStore: string | null = null;

vi.mock('fs/promises', () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn().mockImplementation(async () => {
    if (memStore === null) throw new Error('ENOENT');
    return memStore;
  }),
  writeFile: vi.fn().mockImplementation(async (_path: string, data: string) => {
    memStore = data;
  }),
}));

// Import after mocks are in place
import {
  registerShareLink,
  revokeShareLink,
  getShareLinkStatus,
} from '../lib/shareRevocationStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Returns a random valid share ID (8–128 chars). */
function makeId(length = 32): string {
  return Array.from({ length }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
}

// ─── Reset in-memory store before each test ───────────────────────────────────
beforeEach(() => {
  memStore = null;
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('registerShareLink', () => {
  it('registers a link without an expiry', async () => {
    const id = makeId();
    await registerShareLink(id, null);

    const status = await getShareLinkStatus(id);
    expect(status.exists).toBe(true);
    expect(status.revoked).toBe(false);
    expect(status.expired).toBe(false);
  });

  it('registers a link with a future expiry', async () => {
    const id = makeId();
    const expiresAt = Date.now() + 60_000; // 1 minute in the future
    await registerShareLink(id, expiresAt);

    const status = await getShareLinkStatus(id);
    expect(status.exists).toBe(true);
    expect(status.expired).toBe(false);
  });

  it('registers a link with a past expiry (link is immediately expired)', async () => {
    const id = makeId();
    const expiresAt = Date.now() - 1000; // already in the past
    await registerShareLink(id, expiresAt);

    const status = await getShareLinkStatus(id);
    expect(status.exists).toBe(true);
    expect(status.expired).toBe(true);
  });

  it('throws for an ID that is too short (< 8 chars)', async () => {
    await expect(registerShareLink('short', null)).rejects.toThrow('Invalid share link id.');
  });

  it('throws for an ID that is too long (> 128 chars)', async () => {
    await expect(registerShareLink('x'.repeat(129), null)).rejects.toThrow('Invalid share link id.');
  });

  it('overwrites an existing record when re-registered', async () => {
    const id = makeId();
    await registerShareLink(id, null);
    // Re-register with an expiry
    const expiresAt = Date.now() + 999_999;
    await registerShareLink(id, expiresAt);

    const status = await getShareLinkStatus(id);
    expect(status.exists).toBe(true);
    expect(status.expired).toBe(false);
    expect(status.revoked).toBe(false);
  });

  it('accepts an ID of exactly 8 characters (minimum boundary)', async () => {
    const id = 'abcd1234'; // exactly 8 chars
    await registerShareLink(id, null);
    const status = await getShareLinkStatus(id);
    expect(status.exists).toBe(true);
  });

  it('accepts an ID of exactly 128 characters (maximum boundary)', async () => {
    const id = 'a'.repeat(128);
    await registerShareLink(id, null);
    const status = await getShareLinkStatus(id);
    expect(status.exists).toBe(true);
  });
});

describe('getShareLinkStatus', () => {
  it('returns exists=false for an unknown ID', async () => {
    const status = await getShareLinkStatus(makeId());
    expect(status).toEqual({ exists: false, revoked: false, expired: false });
  });

  it('throws for an ID that is too short', async () => {
    await expect(getShareLinkStatus('abc')).rejects.toThrow('Invalid share link id.');
  });

  it('throws for an ID that is too long', async () => {
    await expect(getShareLinkStatus('z'.repeat(200))).rejects.toThrow('Invalid share link id.');
  });
});

describe('revokeShareLink', () => {
  it('returns false when the ID does not exist', async () => {
    const revoked = await revokeShareLink(makeId());
    expect(revoked).toBe(false);
  });

  it('returns true and marks the link as revoked', async () => {
    const id = makeId();
    await registerShareLink(id, null);

    const revoked = await revokeShareLink(id);
    expect(revoked).toBe(true);

    const status = await getShareLinkStatus(id);
    expect(status.revoked).toBe(true);
    expect(status.exists).toBe(true);
  });

  it('throws for an ID that is too short', async () => {
    await expect(revokeShareLink('bad')).rejects.toThrow('Invalid share link id.');
  });

  it('throws for an ID that is too long', async () => {
    await expect(revokeShareLink('x'.repeat(200))).rejects.toThrow('Invalid share link id.');
  });

  it('can revoke a link that is already expired', async () => {
    const id = makeId();
    await registerShareLink(id, Date.now() - 1000);

    const revoked = await revokeShareLink(id);
    expect(revoked).toBe(true);

    const status = await getShareLinkStatus(id);
    expect(status.revoked).toBe(true);
    expect(status.expired).toBe(true);
  });
});

describe('store pruning', () => {
  const RETENTION_MS = 45 * 24 * 60 * 60 * 1000; // 45 days

  it('prunes records that are older than the retention window', async () => {
    const id = makeId();

    // Manually write a record with a createdAt far in the past
    const veryOld = Date.now() - RETENTION_MS - 1000;
    memStore = JSON.stringify({
      links: {
        [id]: { createdAt: veryOld, expiresAt: null, revokedAt: null },
      },
    });

    // getShareLinkStatus triggers pruneStore via readStore
    const status = await getShareLinkStatus(id);
    expect(status.exists).toBe(false);
  });

  it('preserves records that are within the retention window', async () => {
    const id = makeId();

    const recentCreatedAt = Date.now() - 1000;
    memStore = JSON.stringify({
      links: {
        [id]: { createdAt: recentCreatedAt, expiresAt: null, revokedAt: null },
      },
    });

    const status = await getShareLinkStatus(id);
    expect(status.exists).toBe(true);
  });

  it('prunes expired records that surpassed the retention window', async () => {
    const id = makeId();

    // Record that expired and is older than RETENTION_MS
    const veryOldExpiry = Date.now() - RETENTION_MS - 1000;
    memStore = JSON.stringify({
      links: {
        [id]: { createdAt: Date.now() - 100, expiresAt: veryOldExpiry, revokedAt: null },
      },
    });

    const status = await getShareLinkStatus(id);
    // Expired AND expiry is older than retention — should be pruned
    expect(status.exists).toBe(false);
  });

  it('handles a corrupted store file gracefully (returns empty store)', async () => {
    memStore = 'not-valid-json{{{';

    const id = makeId();
    const status = await getShareLinkStatus(id);
    // Should return not-found without throwing
    expect(status.exists).toBe(false);
  });

  it('handles a store file with missing links key', async () => {
    memStore = JSON.stringify({ someOtherKey: {} });

    const id = makeId();
    const status = await getShareLinkStatus(id);
    expect(status.exists).toBe(false);
  });
});
