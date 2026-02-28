// ═══════════════════════════════════════════════
// API Route: Live Train Status
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { simulateLiveStatus } from '@/lib/live-tracker';

const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY || '';
const RAILWAY_API_HOST = process.env.RAILWAY_API_HOST || 'irctc1.p.rapidapi.com';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const trainNumber = searchParams.get('trainNumber');

    if (!trainNumber) {
        return NextResponse.json({ error: 'trainNumber is required' }, { status: 400 });
    }

    // Try external API first
    if (RAILWAY_API_KEY) {
        try {
            const res = await fetch(
                `https://${RAILWAY_API_HOST}/api/v3/getLiveTrainStatus?trainNo=${trainNumber}`,
                {
                    headers: {
                        'X-RapidAPI-Key': RAILWAY_API_KEY,
                        'X-RapidAPI-Host': RAILWAY_API_HOST,
                    },
                    next: { revalidate: 60 }, // Edge cache 60s
                }
            );

            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data, {
                    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
                });
            }
        } catch {
            // Fall through to mock
        }
    }

    // Fallback: mock simulation
    const mockData = simulateLiveStatus(trainNumber);
    if (!mockData) {
        return NextResponse.json({ error: 'Train not found' }, { status: 404 });
    }

    return NextResponse.json(mockData, {
        headers: { 'Cache-Control': 'public, s-maxage=30' },
    });
}
