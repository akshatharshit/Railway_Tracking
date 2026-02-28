// ═══════════════════════════════════════════════
// API Route: Station Metadata
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { stations } from '@/data/stations';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const query = searchParams.get('q');

    if (code) {
        const station = stations.find(s => s.code === code.toUpperCase());
        if (!station) {
            return NextResponse.json({ error: 'Station not found' }, { status: 404 });
        }
        return NextResponse.json(station, {
            headers: { 'Cache-Control': 'public, s-maxage=3600' },
        });
    }

    if (query) {
        const q = query.toLowerCase();
        const results = stations
            .filter(s =>
                s.code.toLowerCase().includes(q) ||
                s.name.toLowerCase().includes(q) ||
                s.city.toLowerCase().includes(q)
            )
            .slice(0, 15);
        return NextResponse.json(results, {
            headers: { 'Cache-Control': 'public, s-maxage=3600' },
        });
    }

    return NextResponse.json(
        { total: stations.length, stations: stations.slice(0, 50) },
        { headers: { 'Cache-Control': 'public, s-maxage=3600' } }
    );
}
