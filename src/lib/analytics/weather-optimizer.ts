// ═══════════════════════════════════════════════
// Weather-Aware Route Optimizer
// ═══════════════════════════════════════════════

export interface WeatherAdjustment {
    routeId: string;
    originalScore: number;
    adjustedScore: number;
    weatherPenalty: number;
    affectedSegments: AffectedSegment[];
    recommendation: string;
}

export interface AffectedSegment {
    from: string;
    to: string;
    condition: string;
    delayRiskIncrease: number;    // percentage points
    speedReduction: number;       // percentage
}

// Weather impact multipliers on delay risk
const WEATHER_DELAY_MULTIPLIERS: Record<string, number> = {
    clear: 1.0,
    clouds: 1.05,
    haze: 1.1,
    mist: 1.3,
    drizzle: 1.15,
    rain: 1.3,
    thunderstorm: 1.6,
    fog: 2.0,
    snow: 1.8,
};

// Speed reduction percentages
const SPEED_REDUCTIONS: Record<string, number> = {
    clear: 0,
    clouds: 0,
    haze: 5,
    mist: 15,
    drizzle: 5,
    rain: 10,
    thunderstorm: 25,
    fog: 40,
    snow: 30,
};

export function adjustRouteForWeather(params: {
    routeId: string;
    originalScore: number;
    segments: Array<{
        from: string;
        to: string;
        weatherCondition: string;
        originalDelayRisk: number;
    }>;
}): WeatherAdjustment {
    const { routeId, originalScore, segments } = params;
    const affectedSegments: AffectedSegment[] = [];
    let totalPenalty = 0;

    for (const seg of segments) {
        const multiplier = WEATHER_DELAY_MULTIPLIERS[seg.weatherCondition] || 1.0;
        const speedReduction = SPEED_REDUCTIONS[seg.weatherCondition] || 0;
        const delayRiskIncrease = Math.round((multiplier - 1) * 100);

        if (multiplier > 1.05) {
            affectedSegments.push({
                from: seg.from,
                to: seg.to,
                condition: seg.weatherCondition,
                delayRiskIncrease,
                speedReduction,
            });

            // Penalty proportional to delay increase
            totalPenalty += (multiplier - 1) * 10;
        }
    }

    const weatherPenalty = Math.min(40, Math.round(totalPenalty));
    const adjustedScore = Math.max(5, Math.round(originalScore - weatherPenalty));

    let recommendation: string;
    if (weatherPenalty === 0) {
        recommendation = 'Weather conditions are clear. No delays expected from weather.';
    } else if (weatherPenalty < 10) {
        recommendation = 'Minor weather impact. Slight delays possible but route remains recommended.';
    } else if (weatherPenalty < 25) {
        recommendation = 'Moderate weather impact. Consider flexible timing or alternative route.';
    } else {
        recommendation = 'Significant weather disruption expected. Strongly consider rescheduling or alternative route.';
    }

    return {
        routeId,
        originalScore,
        adjustedScore,
        weatherPenalty,
        affectedSegments,
        recommendation,
    };
}

// Get season-based route recommendations
export function getSeasonalAdvice(month: number): {
    season: string;
    generalAdvice: string;
    affectedRegions: Array<{ region: string; risk: string; detail: string }>;
} {
    if (month === 12 || month <= 2) {
        return {
            season: 'Winter (Dec-Feb)',
            generalAdvice: 'Fog-prone season in North India. Expect significant delays on routes through UP, Punjab, and Haryana.',
            affectedRegions: [
                { region: 'North India', risk: 'High', detail: 'Dense fog causes 2-8 hour delays daily' },
                { region: 'East India', risk: 'Medium', detail: 'Cold wave may cause minor disruptions' },
                { region: 'South India', risk: 'Low', detail: 'Generally clear. Northeast monsoon may affect Tamil Nadu' },
            ],
        };
    }
    if (month >= 6 && month <= 9) {
        return {
            season: 'Monsoon (Jun-Sep)',
            generalAdvice: 'Heavy rains affect West coast, Central, and Eastern regions. Waterlogging causes delays near Mumbai and Kolkata.',
            affectedRegions: [
                { region: 'West Coast', risk: 'High', detail: 'Mumbai suburban and Konkan route heavily affected' },
                { region: 'Central India', risk: 'Medium', detail: 'Flash floods and water-logging possible' },
                { region: 'North India', risk: 'Low-Medium', detail: 'Moderate rain, occasional flooding in Bihar' },
            ],
        };
    }
    if (month >= 3 && month <= 5) {
        return {
            season: 'Summer (Mar-May)',
            generalAdvice: 'Best season for rail travel. Minimal weather disruptions across India.',
            affectedRegions: [
                { region: 'All regions', risk: 'Low', detail: 'Clear weather. Dust storms possible in Rajasthan' },
            ],
        };
    }
    return {
        season: 'Autumn (Oct-Nov)',
        generalAdvice: 'Transitional season. Generally good for travel with occasional early fog in November.',
        affectedRegions: [
            { region: 'North India', risk: 'Low-Medium', detail: 'Early fog begins mid-November' },
            { region: 'South India', risk: 'Medium', detail: 'Northeast monsoon affects Tamil Nadu coast' },
        ],
    };
}
