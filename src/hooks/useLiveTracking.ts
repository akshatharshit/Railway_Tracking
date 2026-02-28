'use client';

// ═══════════════════════════════════════════════
// useLiveTracking — SSE + Polling fallback
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSSE } from './useSSE';
import { LiveTrainStatus } from '@/lib/types';
import { ENDPOINTS } from '@/lib/api/config';
import { simulateLiveStatus } from '@/lib/live-tracker';

interface UseLiveTrackingOptions {
    trainNumber: string | null;
    pollingInterval?: number;    // ms
    preferSSE?: boolean;
}

interface UseLiveTrackingReturn {
    status: LiveTrainStatus | null;
    error: string | null;
    connected: boolean;
    mode: 'sse' | 'polling' | 'idle';
    lastUpdated: string | null;
    refresh: () => void;
}

export function useLiveTracking({
    trainNumber,
    pollingInterval = 5000,
    preferSSE = true,
}: UseLiveTrackingOptions): UseLiveTrackingReturn {
    const [pollingData, setPollingData] = useState<LiveTrainStatus | null>(null);
    const [pollingError, setPollingError] = useState<string | null>(null);
    const [mode, setMode] = useState<'sse' | 'polling' | 'idle'>('idle');
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // SSE connection
    const sseUrl = trainNumber ? `${ENDPOINTS.streamLive}?trainNumber=${trainNumber}` : '';
    const {
        data: sseData,
        error: sseError,
        connected: sseConnected,
    } = useSSE<LiveTrainStatus>({
        url: sseUrl,
        enabled: !!trainNumber && preferSSE,
    });

    // Determine active mode
    useEffect(() => {
        if (!trainNumber) {
            setMode('idle');
            return;
        }
        if (preferSSE && sseConnected) {
            setMode('sse');
            // Stop polling if SSE is connected
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
                pollTimerRef.current = null;
            }
        } else {
            setMode('polling');
        }
    }, [trainNumber, preferSSE, sseConnected]);

    // Polling fallback
    const poll = useCallback(() => {
        if (!trainNumber) return;
        try {
            const data = simulateLiveStatus(trainNumber);
            if (data) {
                setPollingData(data);
                setPollingError(null);
            } else {
                setPollingError('Train not found');
            }
        } catch (err) {
            setPollingError(err instanceof Error ? err.message : 'Polling failed');
        }
    }, [trainNumber]);

    useEffect(() => {
        if (mode === 'polling' && trainNumber) {
            poll(); // Immediate first poll
            pollTimerRef.current = setInterval(poll, pollingInterval);
            return () => {
                if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            };
        }
    }, [mode, trainNumber, pollingInterval, poll]);

    // Determine which data to return
    const status = mode === 'sse' ? sseData : pollingData;
    const error = mode === 'sse' ? sseError : pollingError;
    const connected = mode === 'sse' ? sseConnected : mode === 'polling';
    const lastUpdated = status?.lastUpdated || null;

    const refresh = useCallback(() => {
        if (mode === 'polling') {
            poll();
        }
    }, [mode, poll]);

    return { status, error, connected, mode, lastUpdated, refresh };
}
