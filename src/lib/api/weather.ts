// ═══════════════════════════════════════════════
// Weather API Service
// ═══════════════════════════════════════════════

import { apiGet, ApiResponse } from './client';
import { ENDPOINTS, CACHE_TTL } from './config';

export interface WeatherData {
    temperature: number;     // °C
    feelsLike: number;
    humidity: number;         // %
    description: string;
    icon: string;             // weather icon code
    windSpeed: number;        // km/h
    visibility: number;       // km
    condition: 'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunderstorm' | 'snow' | 'mist' | 'fog' | 'haze';
    riskLevel: 'low' | 'medium' | 'high';
    stationCode?: string;
}

export interface RouteWeatherResponse {
    stations: Array<{
        code: string;
        name: string;
        weather: WeatherData;
    }>;
    overallRisk: 'low' | 'medium' | 'high';
    advisories: string[];
}

// ── Station Weather ──────────────────────────
export async function getStationWeather(
    lat: number,
    lng: number,
    stationCode?: string
): Promise<ApiResponse<WeatherData>> {
    try {
        const response = await apiGet<WeatherData & { useMock?: boolean }>(
            `${ENDPOINTS.weather}?lat=${lat}&lng=${lng}&station=${stationCode || ''}`,
            { cacheTtl: CACHE_TTL.weather }
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (response.error || !response.data || (response.data as any).useMock) {
            return {
                data: generateMockWeather(lat, lng, stationCode),
                error: null,
                status: 200,
                cached: false,
                timestamp: Date.now(),
            };
        }

        return response as ApiResponse<WeatherData>;
    } catch {
        return {
            data: generateMockWeather(lat, lng, stationCode),
            error: null,
            status: 200,
            cached: false,
            timestamp: Date.now(),
        };
    }
}

// ── Route Weather ────────────────────────────
export async function getRouteWeather(
    stations: Array<{ code: string; name: string; lat: number; lng: number }>
): Promise<ApiResponse<RouteWeatherResponse>> {
    try {
        const response = await apiGet<RouteWeatherResponse & { useMock?: boolean }>(
            `${ENDPOINTS.weather}?route=${stations.map(s => s.code).join(',')}`,
            { cacheTtl: CACHE_TTL.weather }
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (response.error || !response.data || (response.data as any).useMock) {
            return { data: generateMockRouteWeather(stations), error: null, status: 200, cached: false, timestamp: Date.now() };
        }

        return response as ApiResponse<RouteWeatherResponse>;
    } catch {
        return { data: generateMockRouteWeather(stations), error: null, status: 200, cached: false, timestamp: Date.now() };
    }
}

// ── Mock Weather Generators ──────────────────
function generateMockWeather(lat: number, lng: number, stationCode?: string): WeatherData {
    const seed = Math.abs(Math.floor(lat * 100 + lng * 100 + new Date().getDate()));
    const rand = seededRandom(seed);

    const conditions: WeatherData['condition'][] = ['clear', 'clouds', 'rain', 'mist', 'haze', 'fog'];
    const condition = conditions[Math.floor(rand * conditions.length)];

    const descriptions: Record<string, string> = {
        clear: 'Clear skies',
        clouds: 'Partly cloudy',
        rain: 'Light rain',
        drizzle: 'Light drizzle',
        thunderstorm: 'Thunderstorm',
        snow: 'Light snowfall',
        mist: 'Mist',
        fog: 'Dense fog',
        haze: 'Haze',
    };

    // Temperature varies by latitude (simplified)
    const baseTemp = 35 - Math.abs(lat - 23) * 0.8;
    const temp = Math.round(baseTemp + (rand * 10 - 5));

    const riskLevel: WeatherData['riskLevel'] =
        condition === 'fog' || condition === 'thunderstorm' ? 'high' :
            condition === 'rain' || condition === 'mist' ? 'medium' : 'low';

    return {
        temperature: temp,
        feelsLike: temp + Math.round(rand * 4 - 2),
        humidity: Math.round(40 + rand * 50),
        description: descriptions[condition] || 'Fair weather',
        icon: getWeatherIcon(condition),
        windSpeed: Math.round(5 + rand * 25),
        visibility: condition === 'fog' ? 0.5 : condition === 'mist' ? 2 : 10,
        condition,
        riskLevel,
        stationCode,
    };
}

function generateMockRouteWeather(
    stations: Array<{ code: string; name: string; lat: number; lng: number }>
): RouteWeatherResponse {
    const stationWeathers = stations.map(s => ({
        code: s.code,
        name: s.name,
        weather: generateMockWeather(s.lat, s.lng, s.code),
    }));

    const risks = stationWeathers.map(s => s.weather.riskLevel);
    const overallRisk: RouteWeatherResponse['overallRisk'] =
        risks.includes('high') ? 'high' :
            risks.includes('medium') ? 'medium' : 'low';

    const advisories: string[] = [];
    const fogStations = stationWeathers.filter(s => s.weather.condition === 'fog');
    const rainStations = stationWeathers.filter(s => s.weather.condition === 'rain' || s.weather.condition === 'thunderstorm');

    if (fogStations.length > 0) {
        advisories.push(`Dense fog expected near ${fogStations.map(s => s.name).join(', ')}. Expect delays of 30-90 minutes.`);
    }
    if (rainStations.length > 0) {
        advisories.push(`Rain/storm activity near ${rainStations.map(s => s.name).join(', ')}. Minor speed restrictions possible.`);
    }
    if (overallRisk === 'low') {
        advisories.push('Weather conditions are favorable. No disruptions expected.');
    }

    return { stations: stationWeathers, overallRisk, advisories };
}

function getWeatherIcon(condition: string): string {
    const icons: Record<string, string> = {
        clear: '☀️', clouds: '⛅', rain: '🌧️', drizzle: '🌦️',
        thunderstorm: '⛈️', snow: '❄️', mist: '🌫️', fog: '🌫️', haze: '😶‍🌫️',
    };
    return icons[condition] || '🌤️';
}

function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
