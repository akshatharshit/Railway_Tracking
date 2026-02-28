// ═══════════════════════════════════════════════
// Fare Tracker — Dynamic Fare Analysis
// ═══════════════════════════════════════════════

import { trains } from '@/data/trains';

export interface FareAnalysis {
    trainNumber: string;
    trainName: string;
    classType: string;
    baseFare: number;
    currentDynamicFare: number;
    priceTrend: 'rising' | 'stable' | 'falling';
    demandLevel: 'low' | 'medium' | 'high' | 'surge';
    savingsAdvice: string;
    weeklyTrend: DailyFare[];
    bestBookingWindow: string;
}

export interface DailyFare {
    date: string;
    day: string;
    fare: number;
    multiplier: number;
    tag?: 'cheapest' | 'expensive';
}

export function analyzeFare(
    trainNumber: string,
    classType: string,
    startDate: string
): FareAnalysis | null {
    const train = trains.find(t => t.number === trainNumber);
    if (!train) return null;

    const fareData = train.fares.find(f => f.trainClass === classType);
    const baseFare = fareData?.baseFare || 1000;
    const start = new Date(startDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weeklyTrend: DailyFare[] = [];
    let cheapestDay = { fare: Infinity, idx: 0 };
    let expensiveDay = { fare: 0, idx: 0 };

    for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(date.getDate() + d);
        const dateStr = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();

        const multiplier = calculateDemandMultiplier(trainNumber, classType, date);
        const fare = Math.round(baseFare * multiplier);

        if (fare < cheapestDay.fare) cheapestDay = { fare, idx: d };
        if (fare > expensiveDay.fare) expensiveDay = { fare, idx: d };

        weeklyTrend.push({
            date: dateStr,
            day: dayNames[dayOfWeek],
            fare,
            multiplier: Math.round(multiplier * 100) / 100,
        });
    }

    // Tag cheapest and most expensive
    if (weeklyTrend[cheapestDay.idx]) weeklyTrend[cheapestDay.idx].tag = 'cheapest';
    if (weeklyTrend[expensiveDay.idx]) weeklyTrend[expensiveDay.idx].tag = 'expensive';

    // Current fare (today)
    const todayMultiplier = calculateDemandMultiplier(trainNumber, classType, new Date());
    const currentDynamicFare = Math.round(baseFare * todayMultiplier);

    // Trend
    const firstHalf = weeklyTrend.slice(0, 3).reduce((s, f) => s + f.fare, 0) / 3;
    const secondHalf = weeklyTrend.slice(4).reduce((s, f) => s + f.fare, 0) / 3;
    const priceTrend: FareAnalysis['priceTrend'] =
        secondHalf > firstHalf * 1.05 ? 'rising' :
            secondHalf < firstHalf * 0.95 ? 'falling' : 'stable';

    // Demand level
    const demandLevel: FareAnalysis['demandLevel'] =
        todayMultiplier >= 1.4 ? 'surge' :
            todayMultiplier >= 1.15 ? 'high' :
                todayMultiplier >= 0.95 ? 'medium' : 'low';

    // Advice
    let savingsAdvice: string;
    if (priceTrend === 'rising') {
        savingsAdvice = `Book sooner — prices are trending upward. Save ₹${Math.round(baseFare * 0.15)} by booking on ${weeklyTrend[cheapestDay.idx]?.day || 'a weekday'}.`;
    } else if (priceTrend === 'falling') {
        savingsAdvice = `Prices are dropping. Wait a day or two for better fares.`;
    } else {
        savingsAdvice = `Fares are stable. ${weeklyTrend[cheapestDay.idx]?.day || 'Midweek'} offers the best value.`;
    }

    const bestBookingWindow = todayMultiplier > 1.2
        ? 'Book 15-30 days in advance for best rates'
        : 'Current prices are reasonable. Book when ready.';

    return {
        trainNumber,
        trainName: train.name,
        classType,
        baseFare,
        currentDynamicFare,
        priceTrend,
        demandLevel,
        savingsAdvice,
        weeklyTrend,
        bestBookingWindow,
    };
}

function calculateDemandMultiplier(trainNumber: string, classType: string, date: Date): number {
    const dayOfWeek = date.getDay();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const seed = hashCode(`${trainNumber}-${classType}-${date.toISOString().split('T')[0]}`);

    let multiplier = 1.0;

    // Weekend premium
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) multiplier += 0.12;

    // Festival premium
    if ((month === 10 && day >= 15) || (month === 11 && day <= 15)) multiplier += 0.3;
    if (month === 12 && day >= 20) multiplier += 0.25;
    if (month === 3 && day <= 15) multiplier += 0.2;

    // Summer holiday premium
    if (month >= 5 && month <= 6) multiplier += 0.1;

    // Random variation
    multiplier += (seededRandom(seed) * 0.2 - 0.1);

    return Math.max(0.8, Math.min(1.6, multiplier));
}

function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
