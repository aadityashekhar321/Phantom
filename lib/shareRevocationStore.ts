import 'server-only';

import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

type ShareRecord = {
    createdAt: number;
    expiresAt: number | null;
    revokedAt: number | null;
};

type ShareStore = {
    links: Record<string, ShareRecord>;
};

const STORE_DIR = path.join(process.cwd(), '.data');
const STORE_PATH = path.join(STORE_DIR, 'share-vault.json');
const RETENTION_MS = 45 * 24 * 60 * 60 * 1000;

function isValidId(id: string) {
    return typeof id === 'string' && id.length >= 8 && id.length <= 128;
}

async function ensureStore(): Promise<void> {
    await mkdir(STORE_DIR, { recursive: true });
}

async function readStore(): Promise<ShareStore> {
    await ensureStore();

    try {
        const raw = await readFile(STORE_PATH, 'utf8');
        const parsed = JSON.parse(raw) as ShareStore;
        return parsed && typeof parsed === 'object' && parsed.links ? parsed : { links: {} };
    } catch {
        return { links: {} };
    }
}

async function writeStore(store: ShareStore): Promise<void> {
    await ensureStore();
    await writeFile(STORE_PATH, JSON.stringify(store), 'utf8');
}

function pruneStore(store: ShareStore): ShareStore {
    const now = Date.now();
    const next: ShareStore = { links: {} };

    for (const [id, record] of Object.entries(store.links)) {
        const isExpired = typeof record.expiresAt === 'number' && record.expiresAt < now - RETENTION_MS;
        const isVeryOld = record.createdAt < now - RETENTION_MS;
        if (isExpired || isVeryOld) continue;
        next.links[id] = record;
    }

    return next;
}

export async function registerShareLink(id: string, expiresAt: number | null): Promise<void> {
    if (!isValidId(id)) {
        throw new Error('Invalid share link id.');
    }

    const store = pruneStore(await readStore());
    store.links[id] = {
        createdAt: Date.now(),
        expiresAt: typeof expiresAt === 'number' ? expiresAt : null,
        revokedAt: null,
    };

    await writeStore(store);
}

export async function revokeShareLink(id: string): Promise<boolean> {
    if (!isValidId(id)) {
        throw new Error('Invalid share link id.');
    }

    const store = pruneStore(await readStore());
    const record = store.links[id];
    if (!record) {
        return false;
    }

    store.links[id] = {
        ...record,
        revokedAt: Date.now(),
    };

    await writeStore(store);
    return true;
}

export async function getShareLinkStatus(id: string): Promise<{ exists: boolean; revoked: boolean; expired: boolean }> {
    if (!isValidId(id)) {
        throw new Error('Invalid share link id.');
    }

    const store = pruneStore(await readStore());
    const record = store.links[id];
    if (!record) {
        return { exists: false, revoked: false, expired: false };
    }

    const now = Date.now();
    const expired = typeof record.expiresAt === 'number' ? now > record.expiresAt : false;
    const revoked = typeof record.revokedAt === 'number';

    return {
        exists: true,
        revoked,
        expired,
    };
}
