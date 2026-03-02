// ═══════════════════════════════════════════════
// API Route: Seat Availability
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { TrainClass } from '@/lib/types';
import { getAvailability } from '@/lib/availability';

const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY || '';
const RAILWAY_API_HOST = process.env.RAILWAY_API_HOST || 'irctc1.p.rapidapi.com';

// Transform availability API response
function transformAvailabilityResponse(apiData: any) {
    if (!apiData || !apiData.data) return null;

    const data = apiData.data;

    try {
        return {
            trainNumber: data.TrainNo || data.trainNumber,
            trainName: data.TrainName || data.trainName,
            travelDate: data.TravelDate || data.date,
            availability: (data.AvailabilityDetails || data.availability || []).map((cls: any) => ({
                class: cls.Class || cls.class,
                available: parseInt(cls.Available || cls.available || '0'),
                total: parseInt(cls.Total || cls.total || '100'),
                waitlist: parseInt(cls.Waitlist || cls.waitlist || '0'),
                price: parseInt(cls.Price || cls.price || '0'),
                status: cls.Status || cls.status || 'Available',
            })),
        };
    } catch (e) {
        console.error('Error transforming availability response:', e);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const train = searchParams.get('train');
    const date = searchParams.get('date');
    const cls = searchParams.get('class') as TrainClass | null;

    if (!train || !date || !cls) {
        return NextResponse.json({ error: 'train, date, and class are required' }, { status: 400 });
    }

    if (process.env.RAILWAY_API_KEY) {
        try {
            const res = await fetch(
                `https://${RAILWAY_API_HOST}/api/v3/checkSeatAvailability?trainNo=${train}&date=${date}&classType=${cls}`,
                {
                    headers: {
                        'X-RapidAPI-Key': process.env.RAILWAY_API_KEY,
                        'X-RapidAPI-Host': RAILWAY_API_HOST,
                    },
                    next: { revalidate: 300 },
                }
            );

            if (res.ok) {
                const apiResponse = await res.json();
                
                // Check if API returned success
                if (apiResponse.status === true && apiResponse.data) {
                    const transformed = transformAvailabilityResponse(apiResponse);
                    if (transformed) {
                        return NextResponse.json(transformed, {
                            headers: { 'Cache-Control': 'public, s-maxage=300' },
                        });
                    }
                }
            }
        } catch (e) {
            console.error('Railway availability API error:', e);
            // Fall through to mock
        }
    }

    // Mock fallback
    try {
        const availability = getAvailability(train, date, cls);
        return NextResponse.json(
            { availability },
            { headers: { 'Cache-Control': 'public, s-maxage=60' } }
        );
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to get availability' },
            { status: 500 }
        );
    }
}
