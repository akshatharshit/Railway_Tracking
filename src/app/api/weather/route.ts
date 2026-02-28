// ═══════════════════════════════════════════════
// API Route: Weather Data
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
    }

    if (OPENWEATHER_KEY) {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_KEY}`,
                { next: { revalidate: 600 } }
            );

            if (res.ok) {
                const data = await res.json();
                const weather = {
                    temperature: Math.round(data.main.temp),
                    feelsLike: Math.round(data.main.feels_like),
                    humidity: data.main.humidity,
                    description: data.weather[0]?.description || 'Unknown',
                    icon: data.weather[0]?.icon || '01d',
                    windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
                    visibility: (data.visibility || 10000) / 1000,
                    condition: mapCondition(data.weather[0]?.main),
                    riskLevel: assessRisk(data),
                };
                return NextResponse.json(weather, {
                    headers: { 'Cache-Control': 'public, s-maxage=600' },
                });
            }
        } catch {
            // Fall through to mock
        }
    }

    // Return indicator for client-side mock
    return NextResponse.json(
        { useMock: true, lat: parseFloat(lat), lng: parseFloat(lng) },
        { status: 200 }
    );
}

function mapCondition(main: string): string {
    const map: Record<string, string> = {
        Clear: 'clear', Clouds: 'clouds', Rain: 'rain', Drizzle: 'drizzle',
        Thunderstorm: 'thunderstorm', Snow: 'snow', Mist: 'mist', Fog: 'fog', Haze: 'haze',
    };
    return map[main] || 'clear';
}

function assessRisk(data: { visibility?: number; weather?: Array<{ main: string }> }): string {
    const vis = data.visibility || 10000;
    const main = data.weather?.[0]?.main || '';
    if (vis < 500 || main === 'Fog') return 'high';
    if (vis < 2000 || main === 'Rain' || main === 'Thunderstorm') return 'medium';
    return 'low';
}
