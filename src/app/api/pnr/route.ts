// ═══════════════════════════════════════════════
// API Route: PNR Status
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY || '';
const RAILWAY_API_HOST = process.env.RAILWAY_API_HOST || 'irctc1.p.rapidapi.com';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pnr = searchParams.get('pnr');

    if (!pnr || pnr.length !== 10) {
        return NextResponse.json({ error: 'Valid 10-digit PNR number is required' }, { status: 400 });
    }

    if (RAILWAY_API_KEY) {
        try {
            const res = await fetch(
                `https://${RAILWAY_API_HOST}/api/v3/getPNRStatus?pnrNumber=${pnr}`,
                {
                    headers: {
                        'X-RapidAPI-Key': RAILWAY_API_KEY,
                        'X-RapidAPI-Host': RAILWAY_API_HOST,
                    },
                    next: { revalidate: 120 },
                }
            );

            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data, {
                    headers: { 'Cache-Control': 'public, s-maxage=120' },
                });
            }
        } catch {
            // Fall through to mock endpoint response
        }
    }

    // Return indicator that client should use mock
    return NextResponse.json(
        { useMock: true, pnr },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
}
