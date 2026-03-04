// ═══════════════════════════════════════════════
// API Route: Live Train Status
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { simulateLiveStatus } from '@/lib/live-tracker';

const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY || '';
const RAILWAY_API_HOST = process.env.RAILWAY_API_HOST || 'irctc1.p.rapidapi.com';

// Transform live status API response to expected format
function transformLiveStatusResponse(apiData: any) {
    if (!apiData || !apiData.data) return null;

    const data = apiData.data;

    try {
        return {
            
            trainNumber: data.TrainNo || data.trainNumber,
            trainName: data.TrainName || data.trainName,
            status: data.Status ? data.Status.toLowerCase().replace(' ', '-') : 'on-time',
            delay: parseInt(data.Delay || data.delay || '0'),
            currentStation: data.CurrentStation || data.currentStation || 'Unknown',
            currentLat: parseFloat(data.CurrentLat || data.latitude || '0'),
            currentLng: parseFloat(data.CurrentLng || data.longitude || '0'),
            lastStop: data.LastStop || data.lastStop || 'N/A',
            nextStop: data.NextStop || data.nextStop || 'N/A',
            lastStopDepartureTime: data.LastDepartureTime || data.lastDepartureTime || '--',
            nextStopArrivalTime: data.NextArrivalTime || data.nextArrivalTime || '--',
            distanceCovered: parseInt(data.DistanceCovered || data.distanceCovered || '0'),
            totalDistance: parseInt(data.TotalDistance || data.totalDistance || '100'),
            currentSpeed: parseInt(data.CurrentSpeed || data.currentSpeed || '0'),
            journeyCompleted: parseInt(data.JourneyCompleted || data.journeyCompleted || '0'),
        };
    } catch (e) {
        console.error('Error transforming live status response:', e);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const trainNumber = searchParams.get('trainNumber');

    if (!trainNumber) {
        return NextResponse.json({ error: 'trainNumber is required' }, { status: 400 });
    }

    // Try external API first
    if (process.env.RAILWAY_API_KEY) {
        try {
            const res = await fetch(
                `https://${RAILWAY_API_HOST}/api/v3/getLiveTrainStatus?trainNo=${trainNumber}`,
                {
                    headers: {
                        'X-RapidAPI-Key': process.env.RAILWAY_API_KEY,
                        'X-RapidAPI-Host': RAILWAY_API_HOST,
                    },
                    next: { revalidate: 60 },
                }
            );

            if (res.ok) {
                const apiResponse = await res.json();

                // Check if API returned success
                if (apiResponse.status === true && apiResponse.data) {
                    const transformed = transformLiveStatusResponse(apiResponse);
                    if (transformed) {
                        return NextResponse.json(transformed, {
                            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
                        });
                    }
                }
            }
        } catch (e) {
            console.error('Railway live status API error:', e);
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
