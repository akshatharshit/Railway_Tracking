'use client';

// ═══════════════════════════════════════════════
// Demand Heatmap Component
// ═══════════════════════════════════════════════

//Testing the project 
import { useState, useEffect } from 'react';
import { generateDemandHeatmap, DemandCell, getUpcomingPeakPeriods, PeakPeriod } from '@/lib/ai/demand-analyzer';

export function DemandHeatmap() {
    const [cells, setCells] = useState<DemandCell[]>([]);
    const [peaks, setPeaks] = useState<PeakPeriod[]>([]);
    const [days, setDays] = useState(7);
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setCells(generateDemandHeatmap(today, days));
        setPeaks(getUpcomingPeakPeriods());
    }, [days]);
    


    

    // Group cells by route
    const routes = [...new Set(cells.map(c => c.routeKey))];
    const dates = [...new Set(cells.map(c => c.date))];

    const getDemandColor = (level: number) => {
        if (level >= 85) return 'var(--demand-critical)';
        if (level >= 60) return 'var(--demand-high)';
        if (level >= 35) return 'var(--demand-medium)';
        return 'var(--demand-low)';
    };

    const getDemandOpacity = (level: number) => {
        return 0.3 + (level / 100) * 0.7;
    };

    return (
        <div className="analytics-card demand-heatmap">
            <div className="analytics-card-header">
                <div>
                    <h3>📊 Demand Heatmap</h3>
                    <p className="analytics-subtitle">Route demand by date — plan your travel smart</p>
                </div>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="analytics-select"
                >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                </select>
            </div>

            <div className="heatmap-container">
                {/* Date headers */}
                <div className="heatmap-row heatmap-header">
                    <div className="heatmap-route-label"></div>
                    {dates.map(date => (
                        <div key={date} className="heatmap-date-label">
                            {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </div>
                    ))}
                </div>

                {/* Route rows */}
                {routes.map(routeKey => {
                    const routeCells = cells.filter(c => c.routeKey === routeKey);
                    const firstCell = routeCells[0];
                    return (
                        <div key={routeKey} className="heatmap-row">
                            <div className="heatmap-route-label">
                                <span className="route-from">{firstCell?.fromCode}</span>
                                <span className="route-arrow">→</span>
                                <span className="route-to">{firstCell?.toCode}</span>
                            </div>
                            {dates.map(date => {
                                const cell = routeCells.find(c => c.date === date);
                                return (
                                    <div
                                        key={date}
                                        className="heatmap-cell"
                                        style={{
                                            backgroundColor: getDemandColor(cell?.demandLevel || 0),
                                            opacity: getDemandOpacity(cell?.demandLevel || 0),
                                        }}
                                        title={`${firstCell?.fromName} → ${firstCell?.toName}\n${new Date(date).toLocaleDateString()}\nDemand: ${cell?.demandLevel || 0}%`}
                                    >
                                        <span className="heatmap-value">{cell?.demandLevel || 0}</span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="heatmap-legend">
                <span className="legend-label">Low</span>
                <div className="legend-gradient" />
                <span className="legend-label">Critical</span>
            </div>

            {/* Peak periods */}
            {peaks.length > 0 && (
                <div className="peak-periods">
                    <h4>🔥 Upcoming Peak Periods</h4>
                    <div className="peak-list">
                        {peaks.slice(0, 3).map((peak, i) => (
                            <div key={i} className="peak-item">
                                <span className="peak-badge">+{peak.demandIncrease}%</span>
                                <div className="peak-info">
                                    <span className="peak-reason">{peak.reason}</span>
                                    <span className="peak-dates">
                                        {new Date(peak.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        {' — '}
                                        {new Date(peak.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
