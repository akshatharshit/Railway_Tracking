// ═══════════════════════════════════════════════
// API Route: PNR Status
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY || '';
const RAILWAY_API_HOST = process.env.RAILWAY_API_HOST || 'irctc1.p.rapidapi.com';

// Transform API response to expected format
function transformApiResponse(apiData: any) {
    if (!apiData || !apiData.data) return null;

    const data = apiData.data;
    
    try {
        return {
            pnrNumber: data.Pnr,
            trainNumber: data.TrainNo,
            trainName: data.TrainName,
            boardingStation: data.From,
            boardingStationName: data.BoardingStationName || data.SourceName,
            destinationStation: data.To,
            destinationStationName: data.ReservationUptoName || data.DestinationName,
            dateOfJourney: data.Doj,
            classType: data.Class,
            chartStatus: data.ChartPrepared ? 'Chart Prepared' : 'Chart Not Prepared',
            passengers: (data.PassengerStatus || []).map((p: any) => ({
                number: p.Number,
                bookingStatus: p.BookingStatus || p.BookingStatusNew,
                currentStatus: p.CurrentStatus || p.CurrentStatusNew,
                coachPosition: p.CoachPosition || p.Coach,
                berthType: p.BookingBerthCode || 'SL',
                age: p.Age,
                gender: p.Gender,
            })),
            fare: parseInt(data.BookingFare) || parseInt(data.TicketFare) || 0,
            bookingDate: data.BookingDate,
            quota: data.Quota,
        };
    } catch (e) {
        console.error('Error transforming API response:', e);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pnr = searchParams.get('pnr');

    if (!pnr || pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
        return NextResponse.json({ useMock: true, pnr: pnr || '' }, { status: 200 });
    }

    if (process.env.RAILWAY_API_KEY) {
        try {
            const res = await fetch(
                `https://${RAILWAY_API_HOST}/api/v3/getPNRStatus?pnrNumber=${pnr}`,
                {
                    headers: {
                        'X-RapidAPI-Key': process.env.RAILWAY_API_KEY,
                        'X-RapidAPI-Host': RAILWAY_API_HOST,
                    },
                    next: { revalidate: 120 },
                }
            );

            if (res.ok) {
                const apiResponse = await res.json();
                
                // Check if API returned success
                if (apiResponse.status === true && apiResponse.data) {
                    const transformed = transformApiResponse(apiResponse);
                    if (transformed) {
                        return NextResponse.json(transformed, {
                            headers: { 'Cache-Control': 'public, s-maxage=120' },
                        });
                    }
                }
            }
        } catch (e) {
            console.error('Railway API error:', e);
            // Fall through to mock
        }
    }

    // Return indicator that client should use mock
    return NextResponse.json(
        { useMock: true, pnr },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
}
