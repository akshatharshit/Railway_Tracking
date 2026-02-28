// ═══════════════════════════════════════════════
// AI Confirmation Predictor — Logistic Regression
// ═══════════════════════════════════════════════

export interface ConfirmationPrediction {
    probability: number;          // 0-100
    verdict: 'very_likely' | 'likely' | 'uncertain' | 'unlikely' | 'very_unlikely';
    reasoning: string[];
    recommendation: string;
    alternativeDates: AlternativeDate[];
    factors: ConfirmationFactor[];
}

export interface ConfirmationFactor {
    name: string;
    value: number;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
}

export interface AlternativeDate {
    date: string;
    probability: number;
    reason: string;
}

// ── Logistic model coefficients ─────────────
const COEFFICIENTS = {
    intercept: 2.5,
    waitlistPosition: -0.12,
    daysToTravel: 0.03,
    isWeekend: -0.4,
    isFestival: -0.8,
    classMultiplier: { '1AC': 0.8, '2AC': 0.5, '3AC': 0.2, 'SL': -0.1, 'CC': 0.3, 'EC': 0.6, '2S': -0.3, 'GN': -0.5 } as Record<string, number>,
    routePopularity: -0.02,    // per popularity unit
    tatkalQuota: -0.6,
    seasonMult: { winter: -0.3, summer: 0.1, monsoon: -0.1, autumn: 0.2 } as Record<string, number>,
};

function logistic(z: number): number {
    return 1 / (1 + Math.exp(-z));
}

function getSeason(month: number): string {
    if (month >= 11 || month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'summer';
    if (month >= 6 && month <= 9) return 'monsoon';
    return 'autumn';
}

// ── Festival dates (simplified) ─────────────
function isNearFestival(date: Date): boolean {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // Diwali season (~Oct-Nov), Holi (~Mar), Christmas, New Year
    if (month === 10 && day >= 15) return true;
    if (month === 11 && day <= 15) return true;
    if (month === 3 && day >= 1 && day <= 15) return true;
    if (month === 12 && day >= 20) return true;
    if (month === 1 && day <= 5) return true;
    return false;
}

// ── Main Prediction Engine ──────────────────
export function predictConfirmation(params: {
    waitlistPosition: number;
    daysToTravel: number;
    trainClass: string;
    routePopularity?: number;     // 1-100
    isRACNotWL?: boolean;
    isTatkal?: boolean;
    travelDate: string;
}): ConfirmationPrediction {
    const {
        waitlistPosition,
        daysToTravel,
        trainClass,
        routePopularity = 50,
        isRACNotWL = false,
        isTatkal = false,
        travelDate,
    } = params;

    const date = new Date(travelDate);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const month = date.getMonth() + 1;
    const season = getSeason(month);
    const festival = isNearFestival(date);

    const factors: ConfirmationFactor[] = [];

    // Calculate logistic z-score
    let z = COEFFICIENTS.intercept;

    // WL position (RAC gets bonus)
    const effectiveWL = isRACNotWL ? Math.max(1, waitlistPosition * 0.3) : waitlistPosition;
    z += effectiveWL * COEFFICIENTS.waitlistPosition;
    factors.push({
        name: 'Waitlist Position',
        value: waitlistPosition,
        impact: waitlistPosition <= 10 ? 'positive' : waitlistPosition <= 30 ? 'neutral' : 'negative',
        description: isRACNotWL
            ? `RAC ${waitlistPosition} — high confirmation likelihood`
            : `WL ${waitlistPosition} — ${waitlistPosition <= 15 ? 'good' : waitlistPosition <= 40 ? 'moderate' : 'challenging'} position`,
    });

    // Days to travel
    z += daysToTravel * COEFFICIENTS.daysToTravel;
    factors.push({
        name: 'Days to Travel',
        value: daysToTravel,
        impact: daysToTravel >= 15 ? 'positive' : daysToTravel >= 5 ? 'neutral' : 'negative',
        description: `${daysToTravel} days — ${daysToTravel >= 15 ? 'plenty of time for cancellations' : daysToTravel >= 5 ? 'moderate time window' : 'very little time left'}`,
    });

    // Weekend
    z += isWeekend ? COEFFICIENTS.isWeekend : 0;
    factors.push({
        name: 'Travel Day',
        value: isWeekend ? 1 : 0,
        impact: isWeekend ? 'negative' : 'positive',
        description: isWeekend ? 'Weekend — fewer cancellations expected' : 'Weekday — more cancellations typical',
    });

    // Festival
    z += festival ? COEFFICIENTS.isFestival : 0;
    if (festival) {
        factors.push({
            name: 'Festival Season',
            value: 1,
            impact: 'negative',
            description: 'Near festival period — extremely high demand',
        });
    }

    // Class
    const classMult = COEFFICIENTS.classMultiplier[trainClass] || 0;
    z += classMult;
    factors.push({
        name: 'Travel Class',
        value: classMult,
        impact: classMult > 0 ? 'positive' : classMult < -0.1 ? 'negative' : 'neutral',
        description: `${trainClass} — ${classMult > 0.3 ? 'premium class with higher cancellation rates' : 'standard class'}`,
    });

    // Route popularity
    z += (routePopularity / 100) * COEFFICIENTS.routePopularity * 5;

    // Season
    z += COEFFICIENTS.seasonMult[season] || 0;

    // Tatkal
    z += isTatkal ? COEFFICIENTS.tatkalQuota : 0;

    // Final probability
    const rawProbability = logistic(z) * 100;
    const probability = Math.round(Math.max(2, Math.min(98, rawProbability)));

    // Verdict
    const verdict: ConfirmationPrediction['verdict'] =
        probability >= 80 ? 'very_likely' :
            probability >= 60 ? 'likely' :
                probability >= 40 ? 'uncertain' :
                    probability >= 20 ? 'unlikely' : 'very_unlikely';

    // Reasoning
    const reasoning: string[] = [];
    if (isRACNotWL) reasoning.push('RAC tickets have significantly higher confirmation rates than waitlisted tickets.');
    if (waitlistPosition <= 10) reasoning.push('Your waitlist position is relatively good.');
    else if (waitlistPosition > 30) reasoning.push('High waitlist position reduces confirmation chances significantly.');
    if (daysToTravel >= 15) reasoning.push('Ample time for cancellations to move your position up.');
    if (festival) reasoning.push('Festival season demand makes confirmations harder.');
    if (isWeekend) reasoning.push('Weekend travel typically sees fewer cancellations.');

    // Recommendation
    let recommendation: string;
    if (probability >= 70) {
        recommendation = 'Hold your ticket. Confirmation is likely.';
    } else if (probability >= 40) {
        recommendation = 'Consider keeping this ticket but also check alternative trains for backup.';
    } else {
        recommendation = 'We recommend booking an alternative train. Cancel this ticket for a refund if possible.';
    }

    // Alternative dates with better probability
    const alternativeDates = generateAlternatives(params, probability, date);

    return {
        probability,
        verdict,
        reasoning,
        recommendation,
        alternativeDates,
        factors,
    };
}

function generateAlternatives(
    params: { waitlistPosition: number; daysToTravel: number; trainClass: string; travelDate: string },
    currentProb: number,
    date: Date
): AlternativeDate[] {
    const alternatives: AlternativeDate[] = [];

    for (let offset = -2; offset <= 3; offset++) {
        if (offset === 0) continue;
        const altDate = new Date(date);
        altDate.setDate(altDate.getDate() + offset);

        const altDow = altDate.getDay();
        const isAltWeekend = altDow === 0 || altDow === 6;
        const altDaysToTravel = params.daysToTravel + offset;

        if (altDaysToTravel < 1) continue;

        // Simplified probability estimate for alternative
        let altProb = currentProb;
        if (!isAltWeekend && (date.getDay() === 0 || date.getDay() === 6)) altProb += 10;
        if (offset > 0) altProb += offset * 3;  // Later dates = more cancellation time
        altProb = Math.max(5, Math.min(95, altProb));

        if (altProb > currentProb + 5) {
            alternatives.push({
                date: altDate.toISOString().split('T')[0],
                probability: Math.round(altProb),
                reason: isAltWeekend ? 'Weekend, but more time available' : 'Weekday — typically lower demand',
            });
        }
    }

    return alternatives.sort((a, b) => b.probability - a.probability).slice(0, 3);
}
