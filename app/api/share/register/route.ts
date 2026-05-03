import { NextResponse } from 'next/server';
import { registerShareLink } from '@/lib/shareRevocationStore';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { id?: string; expiresAt?: number | null };
        const id = body.id;
        const expiresAt = typeof body.expiresAt === 'number' ? body.expiresAt : null;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ ok: false, error: 'Missing share id.' }, { status: 400 });
        }

        await registerShareLink(id, expiresAt);
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false, error: 'Failed to register link.' }, { status: 500 });
    }
}
