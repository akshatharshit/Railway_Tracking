// ═══════════════════════════════════════════════
// API Route: SSE Live Stream
// ═══════════════════════════════════════════════

import { NextRequest } from 'next/server';
import { simulateLiveStatus } from '@/lib/live-tracker';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const trainNumber = searchParams.get('trainNumber');

    if (!trainNumber) {
        return new Response('trainNumber is required', { status: 400 });
    }

    const encoder = new TextEncoder();
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const stream = new ReadableStream({
        start(controller) {
            // Send initial data
            const data = simulateLiveStatus(trainNumber);
            if (data) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            }

            // Send heartbeat
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));

            // Push updates every 5 seconds
            intervalId = setInterval(() => {
                try {
                    const update = simulateLiveStatus(trainNumber);
                    if (update) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
                    }
                    // Heartbeat every other tick
                    controller.enqueue(encoder.encode(`: heartbeat\n\n`));
                } catch {
                    // Stream may be closed
                    if (intervalId) clearInterval(intervalId);
                }
            }, 5000);

            // Handle client disconnect
            request.signal.addEventListener('abort', () => {
                if (intervalId) clearInterval(intervalId);
                controller.close();
            });
        },
        cancel() {
            if (intervalId) clearInterval(intervalId);
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
