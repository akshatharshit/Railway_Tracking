// ═══════════════════════════════════════════════
// API Route: List Available Trains
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { trains } from '@/data/trains';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100);

    let filtered = [...trains];

    // Filter by departure and arrival stations
    if (from) {
        filtered = filtered.filter(t => t.from.toUpperCase().includes(from.toUpperCase()));
    }

    if (to) {
        filtered = filtered.filter(t => t.to.toUpperCase().includes(to.toUpperCase()));
    }

    // Filter by search query (train name or number)
    if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.number.includes(q)
        );
    }

    // Limit and return
    const result = filtered.slice(0, limit).map(t => ({
        number: t.number,
        name: t.name,
        from: t.from,
        to: t.to,
        fromName: t.fromName,
        toName: t.toName,
        departureTime: t.stops[0]?.departureTime || '--',
        arrivalTime: t.stops[t.stops.length - 1]?.arrivalTime || '--',
        duration: t.duration,
        type: t.type,
    }));

    return NextResponse.json(
        { total: filtered.length, count: result.length, trains: result },
        { headers: { 'Cache-Control': 'public, s-maxage=3600' } }
    );
}
