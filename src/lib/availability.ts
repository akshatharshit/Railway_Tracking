import { SeatAvailability, CoachData, Berth, BerthType, TrainClass } from '@/lib/types';
import { trains } from '@/data/trains';

// Simulate seat availability for a train/date/class
export function getAvailability(trainNumber: string, date: string, trainClass: TrainClass): SeatAvailability {
    const train = trains.find(t => t.number === trainNumber);
    if (!train) {
        return {
            trainNumber, date, trainClass,
            status: 'REGRET', availableCount: 0,
            chartPrepared: false, confirmationProbability: 0, fare: 0,
        };
    }

    const fareData = train.fares.find(f => f.trainClass === trainClass);
    const baseFare = fareData?.baseFare || 500;

    // Deterministic simulation based on train+date+class
    const seed = hashCode(`${trainNumber}-${date}-${trainClass}`);
    const rand = seededRandom(seed);

    // Simulate demand factor based on date (weekends higher demand)
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const demandFactor = isWeekend ? 1.3 : 1.0;

    // Dynamic fare
    const dynamicFare = Math.round(baseFare * demandFactor * (0.9 + rand * 0.4));

    let status: SeatAvailability['status'];
    let availableCount: number;
    let waitlistPosition: number | undefined;
    let confirmationProbability: number;

    if (rand > 0.6) {
        status = 'AVL';
        availableCount = Math.floor(rand * 80) + 5;
        confirmationProbability = 100;
    } else if (rand > 0.35) {
        status = 'RAC';
        availableCount = 0;
        waitlistPosition = Math.floor(rand * 20) + 1;
        confirmationProbability = Math.round(70 + rand * 25);
    } else if (rand > 0.1) {
        status = 'WL';
        availableCount = 0;
        waitlistPosition = Math.floor(rand * 100) + 1;
        confirmationProbability = Math.max(5, Math.round(50 - waitlistPosition * 1.5));
    } else {
        status = 'REGRET';
        availableCount = 0;
        confirmationProbability = 0;
    }

    // Chart preparation (typically 4 hours before departure)
    const now = new Date();
    const travelDate = new Date(date);
    const hoursToDepart = (travelDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const chartPrepared = hoursToDepart < 4 && hoursToDepart > 0;

    return {
        trainNumber,
        date,
        trainClass,
        status,
        availableCount,
        waitlistPosition,
        chartPrepared,
        confirmationProbability,
        fare: dynamicFare,
    };
}

// Generate coach layout
export function generateCoachLayout(trainClass: TrainClass, coachNumber: string): CoachData {
    const berthConfigs: Record<string, { total: number; types: BerthType[] }> = {
        '1AC': { total: 24, types: ['LB', 'UB', 'LB', 'UB'] },
        '2AC': { total: 48, types: ['LB', 'UB', 'SL', 'SU'] },
        '3AC': { total: 72, types: ['LB', 'MB', 'UB', 'SL', 'SU'] },
        'SL': { total: 72, types: ['LB', 'MB', 'UB', 'SL', 'SU'] },
        'CC': { total: 78, types: ['CB', 'CB', 'CB', 'CB', 'CB'] },
        'EC': { total: 56, types: ['CB', 'CB', 'CB'] },
        '2S': { total: 108, types: ['CB', 'CB', 'CB'] },
        'GN': { total: 90, types: ['LB', 'MB', 'UB', 'SL', 'SU'] },
    };

    const config = berthConfigs[trainClass] || berthConfigs['SL'];
    const seed = hashCode(`${coachNumber}-${trainClass}`);

    const berths: Berth[] = [];
    let occupied = 0;

    for (let i = 1; i <= config.total; i++) {
        const berthType = config.types[(i - 1) % config.types.length];
        const isOccupied = seededRandom(seed + i) < 0.65;
        if (isOccupied) occupied++;

        berths.push({
            number: i,
            type: berthType,
            occupied: isOccupied,
        });
    }

    return {
        coachNumber,
        coachType: trainClass,
        totalBerths: config.total,
        occupiedBerths: occupied,
        berths,
    };
}

// Get multiple dates availability
export function getAvailabilityForDates(
    trainNumber: string,
    startDate: string,
    trainClass: TrainClass,
    days: number = 7
): SeatAvailability[] {
    const results: SeatAvailability[] = [];
    const start = new Date(startDate);

    for (let i = 0; i < days; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        results.push(getAvailability(trainNumber, dateStr, trainClass));
    }

    return results;
}

// Get all coaches for a train
export function getCoachesForTrain(trainNumber: string, trainClass: TrainClass): CoachData[] {
    const coachCounts: Record<string, number> = {
        '1AC': 1, '2AC': 3, '3AC': 6, 'SL': 8, 'CC': 6, 'EC': 2, '2S': 5, 'GN': 2,
    };

    const count = coachCounts[trainClass] || 3;
    const prefix = trainClass === 'SL' ? 'S' : trainClass === 'GN' ? 'GS' : trainClass;
    const coaches: CoachData[] = [];

    for (let i = 1; i <= count; i++) {
        coaches.push(generateCoachLayout(trainClass, `${prefix}${i}`));
    }

    return coaches;
}

function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
