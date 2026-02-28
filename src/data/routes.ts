import { GraphEdge } from '@/lib/types';
import { trains } from './trains';

// Build graph edges from train schedule data
function buildGraphEdges(): GraphEdge[] {
    const edges: GraphEdge[] = [];

    for (const train of trains) {
        for (let i = 0; i < train.stops.length - 1; i++) {
            const from = train.stops[i];
            const to = train.stops[i + 1];

            const depMinutes = timeToMinutes(from.departureTime);
            const arrMinutes = timeToMinutes(to.arrivalTime) + (to.dayNumber - from.dayNumber) * 1440;
            const travelTime = arrMinutes - depMinutes;

            const distance = to.distanceFromSource - from.distanceFromSource;
            const baseFare = train.fares.length > 0
                ? Math.round((train.fares[train.fares.length - 1].baseFare / train.totalDistance) * distance)
                : Math.round(distance * 0.5);

            edges.push({
                from: from.stationCode,
                to: to.stationCode,
                distance,
                travelTime,
                fare: baseFare,
                trainNumber: train.number,
                trainName: train.name,
                departureTime: from.departureTime,
                arrivalTime: to.arrivalTime,
                delayRisk: getDelayRisk(train.category),
                isOvernight: to.dayNumber > from.dayNumber,
            });
        }
    }

    return edges;
}

function timeToMinutes(time: string): number {
    if (time === '--') return 0;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

function getDelayRisk(category: string): number {
    const riskMap: Record<string, number> = {
        'Rajdhani': 0.1,
        'Shatabdi': 0.08,
        'Vande Bharat': 0.05,
        'Duronto': 0.12,
        'Tejas': 0.07,
        'Garib Rath': 0.2,
        'Humsafar': 0.15,
        'Superfast': 0.18,
        'Express': 0.25,
        'Mail': 0.3,
    };
    return riskMap[category] || 0.2;
}

// Adjacency list representation
export function buildAdjacencyList(): Map<string, GraphEdge[]> {
    const edges = buildGraphEdges();
    const adj = new Map<string, GraphEdge[]>();

    for (const edge of edges) {
        if (!adj.has(edge.from)) adj.set(edge.from, []);
        adj.get(edge.from)!.push(edge);
    }

    return adj;
}

export const graphEdges = buildGraphEdges();

// Get all unique station codes in the graph
export function getGraphStations(): string[] {
    const stationSet = new Set<string>();
    for (const edge of graphEdges) {
        stationSet.add(edge.from);
        stationSet.add(edge.to);
    }
    return Array.from(stationSet);
}

// Direct connections from a station
export function getDirectConnections(stationCode: string): GraphEdge[] {
    return graphEdges.filter(e => e.from === stationCode);
}
