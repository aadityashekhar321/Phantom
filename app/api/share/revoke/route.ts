import { NextResponse } from 'next/server';
import { revokeShareLink } from '@/lib/shareRevocationStore';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { id?: string };
        const id = body.id;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ ok: false, error: 'Missing share id.' }, { status: 400 });
        }

        const revoked = await revokeShareLink(id);
        return NextResponse.json({ ok: true, revoked });
    } catch {
        return NextResponse.json({ ok: false, error: 'Failed to revoke link.' }, { status: 500 });
    }
}
