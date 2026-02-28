'use client';

// ═══════════════════════════════════════════════
// Analytics Hub Page
// ═══════════════════════════════════════════════

import { DemandHeatmap } from '@/components/analytics/DemandHeatmap';
import { ReliabilityChart } from '@/components/analytics/ReliabilityChart';
import { FareFluctuation } from '@/components/analytics/FareFluctuation';
import { WeatherOverlay } from '@/components/analytics/WeatherOverlay';

export default function AnalyticsPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📊 Analytics Hub</h1>
                <p className="page-subtitle">AI-powered insights, demand analysis, and weather intelligence</p>
            </div>

            <div className="analytics-grid">
                <DemandHeatmap />
                <FareFluctuation />
                <ReliabilityChart />
                <WeatherOverlay />
            </div>
        </div>
    );
}
