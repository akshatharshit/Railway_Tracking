// ═══════════════════════════════════════════════
// AI Demand Analyzer — Heatmap, Fare, Peaks
// ═══════════════════════════════════════════════

import { trains } from '@/data/trains';
import { stations } from '@/data/stations';

export interface DemandCell {
    routeKey: string;
    fromCode: string;
    toCode: string;
    fromName: string;
    toName: string;
    date: string;
    demandLevel: number;     // 0-100
    category: 'low' | 'medium' | 'high' | 'critical';
}

export interface FareTrend {
    date: string;
    baseFare: number;
    dynamicFare: number;
    demandMultiplier: number;
    dayLabel: string;
}

export interface PeakPeriod {
    startDate: string;
    endDate: string;
    reason: string;
    demandIncrease: number;  // percentage above normal
}

// ── Demand Heatmap ──────────────────────────
export function generateDemandHeatmap(startDate: string, days: number = 7): DemandCell[] {
    const cells: DemandCell[] = [];
    const start = new Date(startDate);

    // Get top routes
    const routeMap = new Map<string, { from: string; to: string; fromName: string; toName: string; count: number }>();
    for (const train of trains) {
        const key = `${train.sourceCode}-${train.destinationCode}`;
        if (!routeMap.has(key)) {
            routeMap.set(key, {
                from: train.sourceCode,
                to: train.destinationCode,
                fromName: train.stops[0].stationName,
                toName: train.stops[train.stops.length - 1].stationName,
                count: 0,
            });
        }
        routeMap.get(key)!.count++;
    }

    const topRoutes = Array.from(routeMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    for (const route of topRoutes) {
        for (let d = 0; d < days; d++) {
            const date = new Date(start);
            date.setDate(date.getDate() + d);
            const dateStr = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();
            const month = date.getMonth() + 1;

            // Base demand from route popularity
            let demand = (route.count / trains.length) * 60;

            // Weekend boost
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) demand += 15;

            // Festival/season boost
            if (isNearFestival(date)) demand += 25;
            if (month === 12 || month <= 2) demand += 10; // winter travel
            if (month >= 4 && month <= 6) demand += 8;    // summer holidays

            // Day-specific hash for variation
            const seed = hashCode(`${route.from}-${route.to}-${dateStr}`);
            demand += (seededRandom(seed) * 20 - 10);

            demand = Math.max(5, Math.min(100, Math.round(demand)));

            const category: DemandCell['category'] =
                demand >= 85 ? 'critical' :
                    demand >= 60 ? 'high' :
                        demand >= 35 ? 'medium' : 'low';

            cells.push({
                routeKey: `${route.from}-${route.to}`,
                fromCode: route.from,
                toCode: route.to,
                fromName: route.fromName,
                toName: route.toName,
                date: dateStr,
                demandLevel: demand,
                category,
            });
        }
    }

    return cells;
}

// ── Fare Trends ─────────────────────────────
export function getFareTrends(
    trainNumber: string,
    trainClass: string,
    startDate: string,
    days: number = 7
): FareTrend[] {
    const train = trains.find(t => t.number === trainNumber);
    if (!train) return [];

    const fareData = train.fares.find(f => f.trainClass === trainClass);
    const baseFare = fareData?.baseFare || 1000;
    const start = new Date(startDate);
    const trends: FareTrend[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let d = 0; d < days; d++) {
        const date = new Date(start);
        date.setDate(date.getDate() + d);
        const dateStr = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();

        // Demand multiplier varies by day
        let multiplier = 1.0;
        if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) multiplier += 0.15;
        if (isNearFestival(date)) multiplier += 0.3;

        // Add some variation
        const seed = hashCode(`${trainNumber}-${trainClass}-${dateStr}`);
        multiplier += (seededRandom(seed) * 0.2 - 0.1);

        multiplier = Math.max(0.8, Math.min(1.6, multiplier));
        const dynamicFare = Math.round(baseFare * multiplier);

        trends.push({
            date: dateStr,
            baseFare,
            dynamicFare,
            demandMultiplier: Math.round(multiplier * 100) / 100,
            dayLabel: dayNames[dayOfWeek],
        });
    }

    return trends;
}

// ── Peak Travel Periods ─────────────────────
export function getUpcomingPeakPeriods(): PeakPeriod[] {
    const now = new Date();
    const year = now.getFullYear();

    const peaks: PeakPeriod[] = [
        { startDate: `${year}-10-15`, endDate: `${year}-11-15`, reason: 'Diwali / Chhath Season', demandIncrease: 120 },
        { startDate: `${year}-12-20`, endDate: `${year + 1}-01-05`, reason: 'Christmas & New Year', demandIncrease: 90 },
        { startDate: `${year}-03-01`, endDate: `${year}-03-15`, reason: 'Holi Season', demandIncrease: 70 },
        { startDate: `${year}-05-01`, endDate: `${year}-06-15`, reason: 'Summer Holidays', demandIncrease: 80 },
        { startDate: `${year}-06-15`, endDate: `${year}-07-15`, reason: 'Monsoon Season Start', demandIncrease: 40 },
        { startDate: `${year}-08-15`, endDate: `${year}-08-20`, reason: 'Independence Day', demandIncrease: 60 },
        { startDate: `${year}-01-20`, endDate: `${year}-01-30`, reason: 'Republic Day', demandIncrease: 50 },
    ];

    return peaks
        .filter(p => new Date(p.endDate) > now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

// ── Station Demand Rankings ─────────────────
export function getStationDemandRankings(): Array<{ code: string; name: string; demand: number; rank: number }> {
    const stationTrainCounts = new Map<string, number>();

    for (const train of trains) {
        for (const stop of train.stops) {
            const current = stationTrainCounts.get(stop.stationCode) || 0;
            stationTrainCounts.set(stop.stationCode, current + 1);
        }
    }

    return Array.from(stationTrainCounts.entries())
        .map(([code, count]) => {
            const station = stations.find(s => s.code === code);
            return {
                code,
                name: station?.name || code,
                demand: Math.min(100, Math.round((count / trains.length) * 100)),
                rank: 0,
            };
        })
        .sort((a, b) => b.demand - a.demand)
        .map((s, i) => ({ ...s, rank: i + 1 }))
        .slice(0, 20);
}

// ── Utilities ────────────────────────────────
function isNearFestival(date: Date): boolean {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if (month === 10 && day >= 15) return true;
    if (month === 11 && day <= 15) return true;
    if (month === 3 && day >= 1 && day <= 15) return true;
    if (month === 12 && day >= 20) return true;
    if (month === 1 && day <= 5) return true;
    return false;
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
