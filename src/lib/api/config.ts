// ═══════════════════════════════════════════════
// API Configuration & Endpoint Registry
// ═══════════════════════════════════════════════

export const API_CONFIG = {
    railway: {
        baseUrl: 'https://irctc1.p.rapidapi.com/api/v3',
        host: process.env.RAILWAY_API_HOST || 'irctc1.p.rapidapi.com',
        key: process.env.RAILWAY_API_KEY || '',
    },
    weather: {
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        key: process.env.OPENWEATHER_API_KEY || '',
    },
    internal: {
        baseUrl: '/api',
    },
    rateLimit: {
        maxRequests: parseInt(process.env.API_RATE_LIMIT || '30', 10),
        windowMs: parseInt(process.env.API_RATE_WINDOW_MS || '60000', 10),
    },
} as const;

// Check if external APIs are configured
export function isRailwayApiConfigured(): boolean {
    return !!API_CONFIG.railway.key;
}

export function isWeatherApiConfigured(): boolean {
    return !!API_CONFIG.weather.key;
}

// Internal API endpoints (frontend calls these)
export const ENDPOINTS = {
    liveStatus: '/api/live-status',
    pnr: '/api/pnr',
    availability: '/api/availability',
    weather: '/api/weather',
    station: '/api/station',
    streamLive: '/api/stream/live',
} as const;

export type CacheTTL = {
    liveStatus: number;
    pnr: number;
    availability: number;
    weather: number;
    station: number;
};

export const CACHE_TTL: CacheTTL = {
    liveStatus: 30_000,    // 30 seconds
    pnr: 120_000,          // 2 minutes
    availability: 300_000, // 5 minutes
    weather: 600_000,      // 10 minutes
    station: 3_600_000,    // 1 hour
};
