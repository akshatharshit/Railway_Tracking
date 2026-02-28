// ═══════════════════════════════════════════════
// AI Delay Predictor — Bayesian + Pattern-based
// ═══════════════════════════════════════════════

import { TrainCategory } from '@/lib/types';

export interface DelayPrediction {
    expectedDelay: number;        // minutes
    confidence: number;           // 0-100
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: DelayFactor[];
    historicalAvg: number;
    probabilityDistribution: { range: string; probability: number }[];
}

export interface DelayFactor {
    name: string;
    impact: number;      // -1 to 1 (negative = reduces delay)
    weight: number;      // 0 to 1
    description: string;
}

// ── Category base delays (historical patterns) ──
const CATEGORY_DELAYS: Record<string, { mean: number; stddev: number }> = {
    'Rajdhani': { mean: 12, stddev: 8 },
    'Shatabdi': { mean: 8, stddev: 5 },
    'Duronto': { mean: 15, stddev: 10 },
    'Vande Bharat': { mean: 5, stddev: 3 },
    'Tejas': { mean: 7, stddev: 4 },
    'Superfast': { mean: 25, stddev: 15 },
    'Express': { mean: 40, stddev: 25 },
    'Mail': { mean: 50, stddev: 30 },
    'Garib Rath': { mean: 20, stddev: 12 },
    'Humsafar': { mean: 18, stddev: 10 },
};

// ── Season multipliers ──────────────────────
function getSeasonMultiplier(month: number): number {
    // Dec-Feb (fog season in North India)
    if (month === 12 || month <= 2) return 1.8;
    // Jun-Sep (monsoon)
    if (month >= 6 && month <= 9) return 1.4;
    // Oct-Nov, Mar-May (good weather)
    return 1.0;
}

// ── Day of week impact ──────────────────────
function getDayWeight(dayOfWeek: number): number {
    // Sunday=0, Monday=1, ..., Saturday=6
    // Weekends and Monday see more delays due to congestion
    return [1.15, 1.2, 1.0, 1.0, 1.05, 1.1, 1.15][dayOfWeek] || 1.0;
}

// ── Time of day impact ──────────────────────
function getTimeWeight(hour: number): number {
    // Late night/early morning trains run more punctually
    if (hour >= 0 && hour < 5) return 0.7;
    if (hour >= 5 && hour < 8) return 0.85;
    if (hour >= 8 && hour < 11) return 1.1;        // Morning rush
    if (hour >= 11 && hour < 15) return 1.0;
    if (hour >= 15 && hour < 19) return 1.15;       // Evening rush
    if (hour >= 19 && hour < 22) return 1.05;
    return 0.8;
}

// ── Route complexity factor ─────────────────
function getRouteComplexity(numStops: number, totalDistance: number): number {
    const stopDensity = numStops / (totalDistance / 100);
    return 1.0 + Math.min(0.5, stopDensity * 0.15);
}

// ── Weather impact ──────────────────────────
function getWeatherImpact(condition: string): number {
    const impacts: Record<string, number> = {
        clear: 0,
        clouds: 0.05,
        haze: 0.1,
        mist: 0.3,
        rain: 0.25,
        drizzle: 0.15,
        thunderstorm: 0.5,
        fog: 0.8,
        snow: 0.6,
    };
    return impacts[condition] || 0;
}

// ── Sigmoid for confidence ──────────────────
function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}

// ── Main Prediction Engine ──────────────────
export function predictDelay(params: {
    category: TrainCategory;
    numStops: number;
    totalDistance: number;
    departureHour: number;
    month?: number;
    dayOfWeek?: number;
    weatherCondition?: string;
    routeConflicts?: number;     // 0-10
}): DelayPrediction {
    const {
        category,
        numStops,
        totalDistance,
        departureHour,
        month = new Date().getMonth() + 1,
        dayOfWeek = new Date().getDay(),
        weatherCondition = 'clear',
        routeConflicts = 3,
    } = params;

    const base = CATEGORY_DELAYS[category] || { mean: 30, stddev: 20 };
    const factors: DelayFactor[] = [];

    // Factor: Season
    const seasonMult = getSeasonMultiplier(month);
    factors.push({
        name: 'Season',
        impact: (seasonMult - 1) / 0.8,
        weight: 0.2,
        description: seasonMult > 1.3 ? 'Adverse season (fog/monsoon)' : 'Favorable weather season',
    });

    // Factor: Day of week
    const dayMult = getDayWeight(dayOfWeek);
    factors.push({
        name: 'Day of Week',
        impact: (dayMult - 1) / 0.2,
        weight: 0.1,
        description: dayMult > 1.1 ? 'High-traffic day' : 'Normal traffic day',
    });

    // Factor: Time of day
    const timeMult = getTimeWeight(departureHour);
    factors.push({
        name: 'Departure Time',
        impact: (timeMult - 1) / 0.15,
        weight: 0.1,
        description: timeMult > 1.05 ? 'Rush hour departure' : 'Off-peak departure',
    });

    // Factor: Route complexity
    const routeMult = getRouteComplexity(numStops, totalDistance);
    factors.push({
        name: 'Route Complexity',
        impact: (routeMult - 1) / 0.5,
        weight: 0.15,
        description: numStops > 15 ? 'Complex route with many stops' : 'Straightforward route',
    });

    // Factor: Weather
    const weatherImp = getWeatherImpact(weatherCondition);
    factors.push({
        name: 'Weather',
        impact: weatherImp,
        weight: 0.25,
        description: weatherImp > 0.3 ? `${weatherCondition} — significant impact` : 'Minimal weather impact',
    });

    // Factor: Route congestion
    const congestionImp = routeConflicts / 10;
    factors.push({
        name: 'Route Congestion',
        impact: congestionImp,
        weight: 0.2,
        description: routeConflicts > 5 ? 'High traffic corridor' : 'Low congestion corridor',
    });

    // Calculate weighted total multiplier
    const totalMultiplier = seasonMult * dayMult * timeMult * routeMult *
        (1 + weatherImp * 0.5) * (1 + congestionImp * 0.3);

    const expectedDelay = Math.round(base.mean * totalMultiplier);

    // Confidence: higher when more data factors align, lower for extreme predictions
    const variance = base.stddev * totalMultiplier;
    const confidenceRaw = sigmoid(3 - variance / 20) * 100;
    const confidence = Math.round(Math.max(20, Math.min(95, confidenceRaw)));

    // Risk level
    const riskLevel: DelayPrediction['riskLevel'] =
        expectedDelay <= 10 ? 'low' :
            expectedDelay <= 30 ? 'medium' :
                expectedDelay <= 60 ? 'high' : 'critical';

    // Probability distribution
    const probabilityDistribution = [
        { range: 'On time (0-5 min)', probability: Math.round(Math.max(5, 50 - expectedDelay * 1.5)) },
        { range: 'Slight (5-15 min)', probability: Math.round(Math.min(40, 20 + (expectedDelay < 20 ? 15 : -5))) },
        { range: 'Moderate (15-30 min)', probability: Math.round(Math.min(30, expectedDelay > 15 ? 25 : 10)) },
        { range: 'Significant (30-60 min)', probability: Math.round(Math.min(25, expectedDelay > 30 ? 20 : 5)) },
        { range: 'Severe (60+ min)', probability: Math.round(Math.min(20, expectedDelay > 45 ? 15 : 3)) },
    ];

    // Normalize to 100%
    const total = probabilityDistribution.reduce((sum, d) => sum + d.probability, 0);
    probabilityDistribution.forEach(d => {
        d.probability = Math.round((d.probability / total) * 100);
    });

    return {
        expectedDelay,
        confidence,
        riskLevel,
        factors,
        historicalAvg: base.mean,
        probabilityDistribution,
    };
}
