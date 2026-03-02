// ═══════════════════════════════════════════════
// Train API Service — live status & schedule
// ═══════════════════════════════════════════════

import { apiGet, ApiResponse } from './client';
import { ENDPOINTS, CACHE_TTL } from './config';
import { LiveTrainStatus } from '@/lib/types';
import { simulateLiveStatus, getAllTrainsForLiveStatus } from '@/lib/live-tracker';

export interface TrainScheduleResponse {
    trainNumber: string;
    trainName: string;
    schedule: Array<{
        stationCode: string;
        stationName: string;
        arrivalTime: string;
        departureTime: string;
        dayNumber: number;
        distance: number;
        platform?: number;
    }>;
}

// ── Live Status ──────────────────────────────
export async function getLiveStatus(trainNumber: string): Promise<ApiResponse<LiveTrainStatus>> {
    try {
        const response = await apiGet<LiveTrainStatus>(
            `${ENDPOINTS.liveStatus}?trainNumber=${trainNumber}`,
            { cacheTtl: CACHE_TTL.liveStatus }
        );

        // If API fails, fall back to mock simulation
        if (response.error || !response.data) {
            const mock = simulateLiveStatus(trainNumber);
            if (mock) {
                return {
                    data: mock,
                    error: null,
                    status: 200,
                    cached: false,
                    timestamp: Date.now(),
                };
            }
        }

        let liveData = response.data as any;

        // Unwrap RapidAPI response if wrapped in { status: true, data: {...} }
        if (liveData && typeof liveData.status === 'boolean' && liveData.data) {
            if (liveData.status === false) {
                return {
                    data: null,
                    error: liveData.message || 'Train not found.',
                    status: 404,
                    cached: response.cached,
                    timestamp: response.timestamp,
                };
            }
            liveData = liveData.data;
        }

        return {
            ...response,
            data: liveData as LiveTrainStatus,
        };
    } catch {
        // Fallback to mock
        const mock = simulateLiveStatus(trainNumber);
        return {
            data: mock,
            error: mock ? null : 'Train not found',
            status: mock ? 200 : 404,
            cached: false,
            timestamp: Date.now(),
        };
    }
}

// ── Train Schedule ───────────────────────────
export async function getTrainSchedule(trainNumber: string): Promise<ApiResponse<TrainScheduleResponse>> {
    return apiGet<TrainScheduleResponse>(
        `${ENDPOINTS.liveStatus}?trainNumber=${trainNumber}&type=schedule`,
        { cacheTtl: CACHE_TTL.station }
    );
}

// ── All Trains List (local, no API) ──────────
export function getTrainList() {
    return getAllTrainsForLiveStatus();
}
