import { NextResponse } from 'next/server';
import { getShareLinkStatus } from '@/lib/shareRevocationStore';

export const runtime = 'nodejs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ ok: false, error: 'Missing share id.' }, { status: 400 });
        }

        const status = await getShareLinkStatus(id);
        return NextResponse.json({ ok: true, ...status });
    } catch {
        return NextResponse.json({ ok: false, error: 'Failed to check link status.' }, { status: 500 });
    }
}
