'use client';

// ═══════════════════════════════════════════════
// useApiQuery — SWR-like data fetching hook
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiGet, ApiResponse } from '@/lib/api/client';

interface UseApiQueryOptions {
    cacheTtl?: number;
    refetchInterval?: number;    // ms, 0 = disabled
    enabled?: boolean;
    retries?: number;
}

interface UseApiQueryReturn<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
    refetch: () => void;
    timestamp: number | null;
    cached: boolean;
}

export function useApiQuery<T>(
    url: string | null,
    options: UseApiQueryOptions = {}
): UseApiQueryReturn<T> {
    const {
        cacheTtl = 30_000,
        refetchInterval = 0,
        enabled = true,
        retries = 3,
    } = options;

    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [timestamp, setTimestamp] = useState<number | null>(null);
    const [cached, setCached] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchData = useCallback(async () => {
        if (!url || !enabled) return;

        setLoading(true);
        setError(null);

        try {
            const response: ApiResponse<T> = await apiGet<T>(url, {
                cacheTtl,
                retries,
            });

            if (response.error) {
                setError(response.error);
            } else {
                setData(response.data);
                setTimestamp(response.timestamp);
                setCached(response.cached);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Fetch failed');
        } finally {
            setLoading(false);
        }
    }, [url, enabled, cacheTtl, retries]);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Refetch interval
    useEffect(() => {
        if (refetchInterval > 0 && enabled) {
            intervalRef.current = setInterval(fetchData, refetchInterval);
            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }
    }, [refetchInterval, enabled, fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, error, loading, refetch, timestamp, cached };
}
