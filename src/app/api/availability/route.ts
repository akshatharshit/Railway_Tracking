// ═══════════════════════════════════════════════
// API Route: Seat Availability
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { TrainClass } from '@/lib/types';
import { getAvailability } from '@/lib/availability';

const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY || '';
const RAILWAY_API_HOST = process.env.RAILWAY_API_HOST || 'irctc1.p.rapidapi.com';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const train = searchParams.get('train');
    const date = searchParams.get('date');
    const cls = searchParams.get('class') as TrainClass | null;

    if (!train || !date || !cls) {
        return NextResponse.json({ error: 'train, date, and class are required' }, { status: 400 });
    }

    if (RAILWAY_API_KEY) {
        try {
            const res = await fetch(
                `https://${RAILWAY_API_HOST}/api/v3/checkSeatAvailability?trainNo=${train}&date=${date}&classType=${cls}`,
                {
                    headers: {
                        'X-RapidAPI-Key': RAILWAY_API_KEY,
                        'X-RapidAPI-Host': RAILWAY_API_HOST,
                    },
                    next: { revalidate: 300 },
                }
            );

            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data, {
                    headers: { 'Cache-Control': 'public, s-maxage=300' },
                });
            }
        } catch {
            // Fall through
        }
    }

    // Mock fallback
    const availability = getAvailability(train, date, cls);
    return NextResponse.json(
        { availability },
        { headers: { 'Cache-Control': 'public, s-maxage=60' } }
    );
}
