// ═══════════════════════════════════════════════
// HTTP Client — Retry, Cache, Rate Limit, Dedup
// ═══════════════════════════════════════════════

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
    cached: boolean;
    timestamp: number;
}

interface CacheEntry<T> {
    data: T;
    expiry: number;
    timestamp: number;
}

interface PendingRequest<T> {
    promise: Promise<ApiResponse<T>>;
}

// ── In-memory cache ──────────────────────────
const cache = new Map<string, CacheEntry<unknown>>();
const pending = new Map<string, PendingRequest<unknown>>();

// ── Token Bucket Rate Limiter ────────────────
class RateLimiter {
    private tokens: number;
    private maxTokens: number;
    private refillRate: number; // tokens per ms
    private lastRefill: number;

    constructor(maxRequests: number, windowMs: number) {
        this.maxTokens = maxRequests;
        this.tokens = maxRequests;
        this.refillRate = maxRequests / windowMs;
        this.lastRefill = Date.now();
    }

    canProceed(): boolean {
        this.refill();
        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }
        return false;
    }

    private refill() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
        this.lastRefill = now;
    }
}

const rateLimiter = new RateLimiter(30, 60_000);

// ── Core fetch with retry ────────────────────
export async function apiGet<T>(
    url: string,
    options: {
        cacheTtl?: number;
        retries?: number;
        headers?: Record<string, string>;
        deduplicate?: boolean;
    } = {}
): Promise<ApiResponse<T>> {
    const {
        cacheTtl = 0,
        retries = 3,
        headers = {},
        deduplicate = true,
    } = options;

    // Check cache
    if (cacheTtl > 0) {
        const cached = cache.get(url);
        if (cached && cached.expiry > Date.now()) {
            return {
                data: cached.data as T,
                error: null,
                status: 200,
                cached: true,
                timestamp: cached.timestamp,
            };
        }
    }

    // Deduplication — return existing promise
    if (deduplicate && pending.has(url)) {
        return pending.get(url)!.promise as Promise<ApiResponse<T>>;
    }

    // Rate limit check
    if (!rateLimiter.canProceed()) {
        return {
            data: null,
            error: 'Rate limit exceeded. Please wait a moment.',
            status: 429,
            cached: false,
            timestamp: Date.now(),
        };
    }

    const fetchPromise = executeWithRetry<T>(url, headers, retries, cacheTtl);

    if (deduplicate) {
        pending.set(url, { promise: fetchPromise });
        fetchPromise.finally(() => pending.delete(url));
    }

    return fetchPromise;
}

async function executeWithRetry<T>(
    url: string,
    headers: Record<string, string>,
    maxRetries: number,
    cacheTtl: number
): Promise<ApiResponse<T>> {
    let lastError = '';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            if (!response.ok) {
                lastError = `HTTP ${response.status}: ${response.statusText}`;
                if (response.status >= 500 && attempt < maxRetries) {
                    await delay(getBackoff(attempt));
                    continue;
                }
                return {
                    data: null,
                    error: lastError,
                    status: response.status,
                    cached: false,
                    timestamp: Date.now(),
                };
            }

            const data = (await response.json()) as T;
            const timestamp = Date.now();

            // Store in cache
            if (cacheTtl > 0) {
                cache.set(url, {
                    data,
                    expiry: timestamp + cacheTtl,
                    timestamp,
                });
            }

            return { data, error: null, status: 200, cached: false, timestamp };
        } catch (err) {
            lastError = err instanceof Error ? err.message : 'Network error';
            if (attempt < maxRetries) {
                await delay(getBackoff(attempt));
            }
        }
    }

    return {
        data: null,
        error: lastError,
        status: 0,
        cached: false,
        timestamp: Date.now(),
    };
}

function getBackoff(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 8000) + Math.random() * 500;
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── POST helper ──────────────────────────────
export async function apiPost<T>(
    url: string,
    body: unknown,
    options: {
        retries?: number;
        headers?: Record<string, string>;
    } = {}
): Promise<ApiResponse<T>> {
    const { retries = 2, headers = {} } = options;
    let lastError = '';

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...headers },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                lastError = `HTTP ${response.status}`;
                if (response.status >= 500 && attempt < retries) {
                    await delay(getBackoff(attempt));
                    continue;
                }
                return { data: null, error: lastError, status: response.status, cached: false, timestamp: Date.now() };
            }

            const data = (await response.json()) as T;
            return { data, error: null, status: 200, cached: false, timestamp: Date.now() };
        } catch (err) {
            lastError = err instanceof Error ? err.message : 'Network error';
            if (attempt < retries) await delay(getBackoff(attempt));
        }
    }

    return { data: null, error: lastError, status: 0, cached: false, timestamp: Date.now() };
}

// ── Cache utilities ──────────────────────────
export function clearCache(pattern?: string): void {
    if (!pattern) {
        cache.clear();
        return;
    }
    for (const key of cache.keys()) {
        if (key.includes(pattern)) cache.delete(key);
    }
}

export function getCacheSize(): number {
    return cache.size;
}
