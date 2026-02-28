import { Train, SearchResult, SearchFilters, TrainStop, ClassFare, DayOfWeek } from '@/lib/types';
import { trains } from '@/data/trains';
import { timeToMinutes, calculateDuration } from '@/lib/utils';

export function searchTrains(filters: SearchFilters): SearchResult[] {
    const { from, to, sortBy, trainClass, overnight, categories, date } = filters;

    let results: SearchResult[] = [];

    for (const train of trains) {
        const fromIdx = train.stops.findIndex(s => s.stationCode === from);
        const toIdx = train.stops.findIndex(s => s.stationCode === to);

        if (fromIdx === -1 || toIdx === -1 || fromIdx >= toIdx) continue;

        // Check running day
        if (date) {
            const dayName = getDayOfWeek(date);
            if (!train.runningDays.includes(dayName)) continue;
        }

        // Class filter
        if (trainClass && !train.classes.includes(trainClass)) continue;

        // Category filter
        if (categories && categories.length > 0 && !categories.includes(train.category)) continue;

        const depStop = train.stops[fromIdx];
        const arrStop = train.stops[toIdx];
        const dayDiff = arrStop.dayNumber - depStop.dayNumber;
        const duration = calculateDuration(depStop.departureTime, arrStop.arrivalTime, dayDiff);
        const distance = arrStop.distanceFromSource - depStop.distanceFromSource;

        // Overnight filter
        const isOvernight = dayDiff > 0;
        if (overnight && !isOvernight) continue;

        // Calculate applicable fares for this segment
        const applicableFares = train.fares.map(f => ({
            ...f,
            baseFare: Math.round((f.baseFare / train.totalDistance) * distance),
        }));

        results.push({
            train,
            departureStop: depStop,
            arrivalStop: arrStop,
            duration,
            distance,
            applicableFares,
            score: 0,
        });
    }

    // Sort
    results = sortResults(results, sortBy);

    // Assign scores
    results = results.map((r, i) => ({
        ...r,
        score: Math.max(0, 100 - i * (100 / Math.max(results.length, 1))),
    }));

    return results;
}

function sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    switch (sortBy) {
        case 'fastest':
            return results.sort((a, b) => a.duration - b.duration);
        case 'cheapest':
            return results.sort((a, b) => {
                const aMin = Math.min(...a.applicableFares.filter(f => f.available).map(f => f.baseFare));
                const bMin = Math.min(...b.applicableFares.filter(f => f.available).map(f => f.baseFare));
                return aMin - bMin;
            });
        case 'leastStops': {
            return results.sort((a, b) => {
                const aStops = countIntermediateStops(a.train, a.departureStop, a.arrivalStop);
                const bStops = countIntermediateStops(b.train, b.departureStop, b.arrivalStop);
                return aStops - bStops;
            });
        }
        case 'departure':
            return results.sort((a, b) =>
                timeToMinutes(a.departureStop.departureTime) - timeToMinutes(b.departureStop.departureTime)
            );
        case 'arrival':
            return results.sort((a, b) =>
                timeToMinutes(a.arrivalStop.arrivalTime) - timeToMinutes(b.arrivalStop.arrivalTime)
            );
        default:
            return results.sort((a, b) => a.duration - b.duration);
    }
}

function countIntermediateStops(train: Train, from: TrainStop, to: TrainStop): number {
    const fromIdx = train.stops.findIndex(s => s.stationCode === from.stationCode);
    const toIdx = train.stops.findIndex(s => s.stationCode === to.stationCode);
    return Math.max(0, toIdx - fromIdx - 1);
}

function getDayOfWeek(dateStr: string): DayOfWeek {
    const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const d = new Date(dateStr);
    return days[d.getDay()];
}

export function getPopularRoutes(): Array<{ from: string; to: string; fromName: string; toName: string; trainCount: number }> {
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

    return Array.from(routeMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
        .map(r => ({ from: r.from, to: r.to, fromName: r.fromName, toName: r.toName, trainCount: r.count }));
}
