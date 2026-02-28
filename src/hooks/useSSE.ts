'use client';

// ═══════════════════════════════════════════════
// useSSE — Server-Sent Events hook
// ═══════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSSEOptions {
    url: string;
    enabled?: boolean;
    reconnectAttempts?: number;
    reconnectInterval?: number;
    heartbeatTimeout?: number;
}

interface UseSSEReturn<T> {
    data: T | null;
    error: string | null;
    connected: boolean;
    reconnecting: boolean;
    disconnect: () => void;
    reconnect: () => void;
}

export function useSSE<T>({
    url,
    enabled = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatTimeout = 15000,
}: UseSSEOptions): UseSSEReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);
    const attemptsRef = useRef(0);
    const heartbeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetHeartbeat = useCallback(() => {
        if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current);
        heartbeatTimerRef.current = setTimeout(() => {
            // No heartbeat — connection may be stale
            disconnect();
            if (attemptsRef.current < reconnectAttempts) {
                setReconnecting(true);
                setTimeout(() => connect(), reconnectInterval);
            }
        }, heartbeatTimeout);
    }, [heartbeatTimeout, reconnectAttempts, reconnectInterval]);

    const disconnect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current);
        setConnected(false);
    }, []);

    const connect = useCallback(() => {
        if (eventSourceRef.current) disconnect();

        try {
            const es = new EventSource(url);
            eventSourceRef.current = es;

            es.onopen = () => {
                setConnected(true);
                setError(null);
                setReconnecting(false);
                attemptsRef.current = 0;
                resetHeartbeat();
            };

            es.onmessage = (event) => {
                resetHeartbeat();
                try {
                    const parsed = JSON.parse(event.data) as T;
                    setData(parsed);
                } catch {
                    // Might be a heartbeat or non-JSON message
                }
            };

            es.onerror = () => {
                setConnected(false);
                es.close();

                if (attemptsRef.current < reconnectAttempts) {
                    attemptsRef.current++;
                    setReconnecting(true);
                    setError(`Connection lost. Reconnecting (${attemptsRef.current}/${reconnectAttempts})...`);
                    setTimeout(() => connect(), reconnectInterval * attemptsRef.current);
                } else {
                    setError('Connection failed after maximum attempts.');
                    setReconnecting(false);
                }
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect');
        }
    }, [url, disconnect, resetHeartbeat, reconnectAttempts, reconnectInterval]);

    const reconnect = useCallback(() => {
        attemptsRef.current = 0;
        connect();
    }, [connect]);

    useEffect(() => {
        if (enabled) {
            connect();
        }
        return () => {
            disconnect();
        };
    }, [enabled, url]);  // eslint-disable-line react-hooks/exhaustive-deps

    return { data, error, connected, reconnecting, disconnect, reconnect };
}
