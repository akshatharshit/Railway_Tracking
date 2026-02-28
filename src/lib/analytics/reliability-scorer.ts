// ═══════════════════════════════════════════════
// Reliability Scorer — Train Reliability 0-100
// ═══════════════════════════════════════════════

import { TrainCategory } from '@/lib/types';
import { trains } from '@/data/trains';

export interface ReliabilityScore {
    trainNumber: string;
    trainName: string;
    score: number;                // 0-100
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
    breakdown: ReliabilityBreakdown;
    comparison: string;           // vs category average
}

export interface ReliabilityBreakdown {
    punctuality: number;          // 0-25
    consistency: number;          // 0-25
    routeComplexity: number;      // 0-25  (lower complexity = higher score)
    serviceQuality: number;       // 0-25
}

// Category base scores
const CATEGORY_RELIABILITY: Record<string, number> = {
    'Vande Bharat': 92,
    'Rajdhani': 85,
    'Shatabdi': 88,
    'Tejas': 87,
    'Duronto': 80,
    'Humsafar': 78,
    'Garib Rath': 72,
    'Superfast': 65,
    'Express': 55,
    'Mail': 50,
};

export function calculateReliability(trainNumber: string): ReliabilityScore | null {
    const train = trains.find(t => t.number === trainNumber);
    if (!train) return null;

    const baseScore = CATEGORY_RELIABILITY[train.category] || 60;
    const seed = hashCode(trainNumber);

    // Punctuality: based on category and variation
    const punctuality = Math.min(25, Math.round(
        (baseScore / 100) * 22 + seededRandom(seed) * 5
    ));

    // Consistency: inversely correlated with number of stops
    const stopPenalty = Math.min(10, train.stops.length * 0.3);
    const consistency = Math.min(25, Math.round(
        20 - stopPenalty + seededRandom(seed + 1) * 8
    ));

    // Route complexity: fewer stops + shorter distance = simpler
    const distanceFactor = Math.min(8, train.totalDistance / 300);
    const routeComplexity = Math.min(25, Math.round(
        22 - distanceFactor - (train.stops.length * 0.2) + seededRandom(seed + 2) * 5
    ));

    // Service quality: premium trains score higher
    const premiumBonus = ['Rajdhani', 'Shatabdi', 'Vande Bharat', 'Tejas'].includes(train.category) ? 6 : 0;
    const pantryBonus = train.pantryAvailable ? 2 : 0;
    const serviceQuality = Math.min(25, Math.round(
        12 + premiumBonus + pantryBonus + seededRandom(seed + 3) * 5
    ));

    const totalScore = Math.min(100, Math.max(10,
        punctuality + consistency + routeComplexity + serviceQuality
    ));

    const grade: ReliabilityScore['grade'] =
        totalScore >= 90 ? 'A+' :
            totalScore >= 80 ? 'A' :
                totalScore >= 70 ? 'B+' :
                    totalScore >= 60 ? 'B' :
                        totalScore >= 45 ? 'C' : 'D';

    const categoryAvg = CATEGORY_RELIABILITY[train.category] || 60;
    const diff = totalScore - categoryAvg;
    const comparison = diff >= 5 ? `${diff} points above ${train.category} average` :
        diff <= -5 ? `${Math.abs(diff)} points below ${train.category} average` :
            `Near ${train.category} average`;

    return {
        trainNumber: train.number,
        trainName: train.name,
        score: totalScore,
        grade,
        breakdown: { punctuality, consistency, routeComplexity, serviceQuality },
        comparison,
    };
}

// Get top-N most reliable trains
export function getTopReliableTrains(n: number = 10): ReliabilityScore[] {
    return trains
        .map(t => calculateReliability(t.number))
        .filter((r): r is ReliabilityScore => r !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, n);
}

// Compare multiple trains
export function compareReliability(trainNumbers: string[]): ReliabilityScore[] {
    return trainNumbers
        .map(n => calculateReliability(n))
        .filter((r): r is ReliabilityScore => r !== null);
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
