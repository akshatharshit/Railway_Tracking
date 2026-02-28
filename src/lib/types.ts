// ═══════════════════════════════════════════════
// Smart Railway Intelligence Platform — Types
// ═══════════════════════════════════════════════

// ── Station ──────────────────────────────────
export interface Station {
    code: string;
    name: string;
    city: string;
    state: string;
    zone: string;
    lat: number;
    lng: number;
    platforms: number;
    isJunction: boolean;
}

// ── Train ────────────────────────────────────
export type TrainCategory = 'Rajdhani' | 'Shatabdi' | 'Duronto' | 'Superfast' | 'Express' | 'Mail' | 'Garib Rath' | 'Humsafar' | 'Tejas' | 'Vande Bharat';
export type TrainClass = '1AC' | '2AC' | '3AC' | 'SL' | 'CC' | 'EC' | '2S' | 'GN';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface TrainStop {
    stationCode: string;
    stationName: string;
    arrivalTime: string;   // HH:mm
    departureTime: string;  // HH:mm
    haltMinutes: number;
    distanceFromSource: number; // km
    dayNumber: number;  // 1 = same day, 2 = next day, etc.
    platform?: number;
}

export interface ClassFare {
    trainClass: TrainClass;
    baseFare: number;
    available: boolean;
}

export interface Train {
    number: string;
    name: string;
    category: TrainCategory;
    classes: TrainClass[];
    runningDays: DayOfWeek[];
    stops: TrainStop[];
    fares: ClassFare[];
    sourceCode: string;
    destinationCode: string;
    totalDistance: number;
    avgSpeed: number;
    pantryAvailable: boolean;
}

// ── Search ───────────────────────────────────
export type SortBy = 'fastest' | 'cheapest' | 'leastStops' | 'departure' | 'arrival';

export interface SearchFilters {
    from: string;
    to: string;
    date: string;
    sortBy: SortBy;
    trainClass?: TrainClass;
    overnight?: boolean;
    categories?: TrainCategory[];
}

export interface SearchResult {
    train: Train;
    departureStop: TrainStop;
    arrivalStop: TrainStop;
    duration: number; // minutes
    distance: number; // km
    applicableFares: ClassFare[];
    score: number;
}

export interface FavoriteRoute {
    id: string;
    from: Station;
    to: Station;
    savedAt: string;
    trainNumbers?: string[];
}

// ── Live Status ──────────────────────────────
export interface LiveTrainStatus {
    trainNumber: string;
    trainName: string;
    currentLat: number;
    currentLng: number;
    lastStation: TrainStop;
    nextStation: TrainStop;
    currentSpeed: number; // kmph
    delay: number; // minutes (positive = late)
    expectedArrival: string;
    journeyCompleted: number; // 0 to 100
    lastUpdated: string;
    platformNumber?: number;
    status: 'on-time' | 'delayed' | 'early' | 'cancelled' | 'not-started';
}

// ── Seat Availability ────────────────────────
export type AvailabilityStatus = 'AVL' | 'RAC' | 'WL' | 'REGRET' | 'GNWL' | 'PQWL';

export interface SeatAvailability {
    trainNumber: string;
    date: string;
    trainClass: TrainClass;
    status: AvailabilityStatus;
    availableCount: number;
    waitlistPosition?: number;
    chartPrepared: boolean;
    confirmationProbability: number; // 0 to 100
    fare: number;
}

export type BerthType = 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'CB';

export interface Berth {
    number: number;
    type: BerthType;
    occupied: boolean;
    passengerName?: string;
}

export interface CoachData {
    coachNumber: string;
    coachType: TrainClass;
    totalBerths: number;
    occupiedBerths: number;
    berths: Berth[];
}

// ── Route Optimizer ──────────────────────────
export interface GraphEdge {
    from: string; // station code
    to: string;
    distance: number;
    travelTime: number; // minutes
    fare: number;
    trainNumber: string;
    trainName: string;
    departureTime: string;
    arrivalTime: string;
    delayRisk: number; // 0 to 1
    isOvernight: boolean;
}

export interface GraphNode {
    stationCode: string;
    edges: GraphEdge[];
}

export type OptimizationCriteria = 'fastest' | 'cheapest' | 'leastTransfers' | 'minDelay' | 'overnightComfort' | 'balanced';

export interface RouteSegment {
    trainNumber: string;
    trainName: string;
    from: string;
    fromName: string;
    to: string;
    toName: string;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    distance: number;
    fare: number;
    delayRisk: number;
}

export interface OptimizedRoute {
    id: string;
    segments: RouteSegment[];
    totalDuration: number;
    totalDistance: number;
    totalFare: number;
    transfers: number;
    avgDelayRisk: number;
    comfortScore: number; // 0-100
    hybridScore: number;  // 0-100  
    departureTime: string;
    arrivalTime: string;
    isOvernight: boolean;
}

// ── Dashboard ────────────────────────────────
export interface DashboardStat {
    label: string;
    value: string | number;
    change?: number;
    icon: string;
}
