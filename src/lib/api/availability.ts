// ═══════════════════════════════════════════════
// Availability API Service
// ═══════════════════════════════════════════════

import { apiGet, ApiResponse } from './client';
import { ENDPOINTS, CACHE_TTL } from './config';
import { SeatAvailability, TrainClass } from '@/lib/types';
import { getAvailability as getMockAvailability } from '@/lib/availability';

export interface AvailabilityResponse {
    availability: SeatAvailability;
    aiPrediction?: {
        confirmationChance: number;
        reasoning: string;
        bestAlternativeDate?: string;
    };
}

export async function checkAvailability(
    trainNumber: string,
    date: string,
    trainClass: TrainClass
): Promise<ApiResponse<AvailabilityResponse>> {
    try {
        const response = await apiGet<AvailabilityResponse>(
            `${ENDPOINTS.availability}?train=${trainNumber}&date=${date}&class=${trainClass}`,
            { cacheTtl: CACHE_TTL.availability }
        );

        if (response.error || !response.data) {
            const mock = getMockAvailability(trainNumber, date, trainClass);
            return {
                data: {
                    availability: mock,
                    aiPrediction: {
                        confirmationChance: mock.confirmationProbability,
                        reasoning: generatePredictionReasoning(mock),
                        bestAlternativeDate: undefined,
                    },
                },
                error: null,
                status: 200,
                cached: false,
                timestamp: Date.now(),
            };
        }

        return response;
    } catch {
        const mock = getMockAvailability(trainNumber, date, trainClass);
        return {
            data: {
                availability: mock,
            },
            error: null,
            status: 200,
            cached: false,
            timestamp: Date.now(),
        };
    }
}

function generatePredictionReasoning(avail: SeatAvailability): string {
    if (avail.status === 'AVL') return 'Seats are currently available. Book now to secure your berth.';
    if (avail.status === 'RAC') return `RAC ${avail.waitlistPosition}. High chance of confirmation based on historical cancellation patterns.`;
    if (avail.status === 'WL') {
        if (avail.confirmationProbability > 60) return `WL ${avail.waitlistPosition} has good chances — this route typically sees 60-70% cancellations before chart preparation.`;
        if (avail.confirmationProbability > 30) return `WL ${avail.waitlistPosition} has moderate chances. Consider alternate dates for guaranteed confirmation.`;
        return `WL ${avail.waitlistPosition} has low chances. We recommend booking an alternate train or date.`;
    }
    return 'No availability on this route/date combination.';
}
