import { OptimizedRoute, RouteSegment, OptimizationCriteria, GraphEdge } from '@/lib/types';
import { buildAdjacencyList } from '@/data/routes';
import { findStation } from '@/data/stations';
import { generateId, timeToMinutes } from '@/lib/utils';

interface PathNode {
    station: string;
    cost: number;
    path: GraphEdge[];
}

// Multi-criteria route optimizer using modified Dijkstra's algorithm
export function optimizeRoute(
    from: string,
    to: string,
    criteria: OptimizationCriteria
): OptimizedRoute[] {
    const adj = buildAdjacencyList();

    // Find multiple paths using k-shortest paths approach
    const allPaths = findKShortestPaths(adj, from, to, criteria, 5);

    // Convert paths to OptimizedRoute
    const routes: OptimizedRoute[] = allPaths.map(path => {
        const segments = pathToSegments(path);
        const totalDuration = segments.reduce((sum, s) => sum + s.duration, 0);
        const totalDistance = segments.reduce((sum, s) => sum + s.distance, 0);
        const totalFare = segments.reduce((sum, s) => sum + s.fare, 0);
        const transfers = Math.max(0, segments.length - 1);
        const avgDelayRisk = segments.reduce((sum, s) => sum + s.delayRisk, 0) / segments.length;
        const isOvernight = path.some(e => e.isOvernight);

        // Comfort score (higher is better)
        const comfortScore = calculateComfortScore(segments, transfers, isOvernight);

        // Hybrid score combining all criteria
        const hybridScore = calculateHybridScore(
            totalDuration, totalFare, transfers, avgDelayRisk, comfortScore, criteria
        );

        return {
            id: generateId(),
            segments,
            totalDuration,
            totalDistance,
            totalFare,
            transfers,
            avgDelayRisk,
            comfortScore,
            hybridScore,
            departureTime: segments[0]?.departureTime || '--',
            arrivalTime: segments[segments.length - 1]?.arrivalTime || '--',
            isOvernight,
        };
    });

    // Sort by hybrid score descending
    return routes.sort((a, b) => b.hybridScore - a.hybridScore);
}

function findKShortestPaths(
    adj: Map<string, GraphEdge[]>,
    from: string,
    to: string,
    criteria: OptimizationCriteria,
    k: number
): GraphEdge[][] {
    const results: GraphEdge[][] = [];
    const visited = new Set<string>();

    // Priority queue (simplified)
    type QueueItem = { station: string; cost: number; path: GraphEdge[] };
    const queue: QueueItem[] = [{ station: from, cost: 0, path: [] }];

    const destinationCounts = new Map<string, number>();

    while (queue.length > 0 && results.length < k) {
        // Find min cost
        queue.sort((a, b) => a.cost - b.cost);
        const current = queue.shift()!;

        if (current.station === to) {
            results.push(current.path);
            continue;
        }

        const visitKey = `${current.station}-${current.path.length}`;
        const count = destinationCounts.get(current.station) || 0;
        if (count >= k) continue;
        destinationCounts.set(current.station, count + 1);

        const edges = adj.get(current.station) || [];
        for (const edge of edges) {
            // Avoid immediate cycles
            if (current.path.some(e => e.to === edge.to && e.from === edge.from)) continue;

            const edgeCost = getEdgeCost(edge, criteria);
            queue.push({
                station: edge.to,
                cost: current.cost + edgeCost,
                path: [...current.path, edge],
            });
        }

        // Limit queue size for performance
        if (queue.length > 500) {
            queue.sort((a, b) => a.cost - b.cost);
            queue.length = 200;
        }
    }

    // If no direct paths, try with transfers
    if (results.length === 0) {
        // Generate some reasonable fallback routes
        const directEdgesFrom = adj.get(from) || [];
        for (const edge1 of directEdgesFrom) {
            const midEdges = adj.get(edge1.to) || [];
            for (const edge2 of midEdges) {
                if (edge2.to === to) {
                    results.push([edge1, edge2]);
                    if (results.length >= k) break;
                }
            }
            if (results.length >= k) break;
        }
    }

    return results;
}

function getEdgeCost(edge: GraphEdge, criteria: OptimizationCriteria): number {
    switch (criteria) {
        case 'fastest':
            return edge.travelTime;
        case 'cheapest':
            return edge.fare;
        case 'leastTransfers':
            return 1; // Each edge = potential stop
        case 'minDelay':
            return edge.delayRisk * 1000;
        case 'overnightComfort':
            return edge.isOvernight ? 0.5 : 1.5;
        case 'balanced':
        default:
            return (
                edge.travelTime * 0.3 +
                edge.fare * 0.01 +
                edge.delayRisk * 100 +
                (edge.isOvernight ? -10 : 10)
            );
    }
}

function pathToSegments(path: GraphEdge[]): RouteSegment[] {
    // Group consecutive edges by train number
    const segments: RouteSegment[] = [];
    let currentSegment: { edges: GraphEdge[]; trainNumber: string } | null = null;

    for (const edge of path) {
        if (currentSegment && currentSegment.trainNumber === edge.trainNumber) {
            currentSegment.edges.push(edge);
        } else {
            if (currentSegment) {
                segments.push(edgesToSegment(currentSegment.edges));
            }
            currentSegment = { edges: [edge], trainNumber: edge.trainNumber };
        }
    }

    if (currentSegment) {
        segments.push(edgesToSegment(currentSegment.edges));
    }

    return segments;
}

function edgesToSegment(edges: GraphEdge[]): RouteSegment {
    const first = edges[0];
    const last = edges[edges.length - 1];

    return {
        trainNumber: first.trainNumber,
        trainName: first.trainName,
        from: first.from,
        fromName: findStation(first.from)?.name || first.from,
        to: last.to,
        toName: findStation(last.to)?.name || last.to,
        departureTime: first.departureTime,
        arrivalTime: last.arrivalTime,
        duration: edges.reduce((sum, e) => sum + e.travelTime, 0),
        distance: edges.reduce((sum, e) => sum + e.distance, 0),
        fare: edges.reduce((sum, e) => sum + e.fare, 0),
        delayRisk: edges.reduce((sum, e) => sum + e.delayRisk, 0) / edges.length,
    };
}

function calculateComfortScore(
    segments: RouteSegment[],
    transfers: number,
    isOvernight: boolean
): number {
    let score = 100;

    // Penalize transfers
    score -= transfers * 15;

    // Penalize long journeys
    const totalDuration = segments.reduce((sum, s) => sum + s.duration, 0);
    if (totalDuration > 1440) score -= 20;
    else if (totalDuration > 720) score -= 10;

    // Bonus for overnight (sleeping)
    if (isOvernight && totalDuration > 360) score += 10;

    // Penalize high delay risk
    const avgRisk = segments.reduce((sum, s) => sum + s.delayRisk, 0) / Math.max(1, segments.length);
    score -= avgRisk * 30;

    return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateHybridScore(
    duration: number,
    fare: number,
    transfers: number,
    delayRisk: number,
    comfortScore: number,
    criteria: OptimizationCriteria
): number {
    // Normalize values to 0-100
    const timeScore = Math.max(0, 100 - (duration / 30)); // 30 min per point loss
    const costScore = Math.max(0, 100 - (fare / 50));      // 50 rs per point loss
    const transferScore = Math.max(0, 100 - transfers * 25);
    const delayScore = Math.max(0, 100 - delayRisk * 200);

    // Weights based on criteria
    const weights: Record<OptimizationCriteria, [number, number, number, number, number]> = {
        fastest: [0.5, 0.1, 0.1, 0.1, 0.2],
        cheapest: [0.1, 0.5, 0.1, 0.1, 0.2],
        leastTransfers: [0.15, 0.15, 0.4, 0.1, 0.2],
        minDelay: [0.1, 0.1, 0.1, 0.5, 0.2],
        overnightComfort: [0.15, 0.1, 0.15, 0.1, 0.5],
        balanced: [0.25, 0.25, 0.15, 0.15, 0.2],
    };

    const w = weights[criteria] || weights.balanced;
    const score = w[0] * timeScore + w[1] * costScore + w[2] * transferScore + w[3] * delayScore + w[4] * comfortScore;

    return Math.max(0, Math.min(100, Math.round(score)));
}

// Get optimization criteria options
export const criteriaOptions: Array<{ value: OptimizationCriteria; label: string; description: string }> = [
    { value: 'fastest', label: 'Fastest', description: 'Minimize total travel time' },
    { value: 'cheapest', label: 'Cheapest', description: 'Minimize total fare' },
    { value: 'leastTransfers', label: 'Least Transfers', description: 'Minimize number of train changes' },
    { value: 'minDelay', label: 'Minimum Delay Risk', description: 'Choose most reliable trains' },
    { value: 'overnightComfort', label: 'Overnight Comfort', description: 'Prefer overnight travel for sleeping' },
    { value: 'balanced', label: 'Balanced', description: 'Best overall considering all factors' },
];
