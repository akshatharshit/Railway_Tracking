'use client';

// ═══════════════════════════════════════════════
// Fare Fluctuation Chart Component
// ═══════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { analyzeFare, FareAnalysis } from '@/lib/analytics/fare-tracker';
import { trains } from '@/data/trains';

export function FareFluctuation() {
    const [selectedTrain, setSelectedTrain] = useState(trains[0]?.number || '');
    const [selectedClass, setSelectedClass] = useState('3AC');
    const [analysis, setAnalysis] = useState<FareAnalysis | null>(null);

    useEffect(() => {
        if (selectedTrain) {
            const today = new Date().toISOString().split('T')[0];
            setAnalysis(analyzeFare(selectedTrain, selectedClass, today));
        }
    }, [selectedTrain, selectedClass]);

    if (!analysis) return null;

    const maxFare = Math.max(...analysis.weeklyTrend.map(d => d.fare));
    const minFare = Math.min(...analysis.weeklyTrend.map(d => d.fare));
    const range = maxFare - minFare || 1;

    const trendIcon = analysis.priceTrend === 'rising' ? '📈' :
        analysis.priceTrend === 'falling' ? '📉' : '➡️';

    const demandColor = {
        low: '#10b981', medium: '#eab308', high: '#f97316', surge: '#ef4444',
    }[analysis.demandLevel];

    return (
        <div className="analytics-card fare-fluctuation">
            <div className="analytics-card-header">
                <div>
                    <h3>💰 Fare Trends</h3>
                    <p className="analytics-subtitle">7-day dynamic fare analysis</p>
                </div>
                <div className="fare-selectors">
                    <select
                        value={selectedTrain}
                        onChange={(e) => setSelectedTrain(e.target.value)}
                        className="analytics-select"
                    >
                        {trains.slice(0, 15).map(t => (
                            <option key={t.number} value={t.number}>{t.number} — {t.name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="analytics-select"
                    >
                        {['1AC', '2AC', '3AC', 'SL', 'CC'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Summary stats */}
            <div className="fare-summary">
                <div className="fare-stat">
                    <span className="fare-stat-label">Base Fare</span>
                    <span className="fare-stat-value">₹{analysis.baseFare.toLocaleString()}</span>
                </div>
                <div className="fare-stat">
                    <span className="fare-stat-label">Current Dynamic</span>
                    <span className="fare-stat-value highlight">₹{analysis.currentDynamicFare.toLocaleString()}</span>
                </div>
                <div className="fare-stat">
                    <span className="fare-stat-label">Trend</span>
                    <span className="fare-stat-value">{trendIcon} {analysis.priceTrend}</span>
                </div>
                <div className="fare-stat">
                    <span className="fare-stat-label">Demand</span>
                    <span className="fare-stat-value" style={{ color: demandColor }}>
                        {analysis.demandLevel.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Bar chart */}
            <div className="fare-chart">
                {analysis.weeklyTrend.map((day, i) => {
                    const height = 30 + ((day.fare - minFare) / range) * 60;
                    const isTagged = day.tag !== undefined;
                    return (
                        <div key={i} className="fare-bar-wrapper">
                            <div className="fare-bar-value">₹{day.fare.toLocaleString()}</div>
                            <div
                                className={`fare-bar ${day.tag || ''}`}
                                style={{ height: `${height}%` }}
                            >
                                {isTagged && (
                                    <span className={`fare-tag ${day.tag}`}>
                                        {day.tag === 'cheapest' ? '✓ Best' : '⚠ Peak'}
                                    </span>
                                )}
                            </div>
                            <div className="fare-bar-label">{day.day}</div>
                            <div className="fare-bar-multiplier">×{day.multiplier}</div>
                        </div>
                    );
                })}
            </div>

            {/* Advice */}
            <div className="fare-advice">
                <span className="advice-icon">💡</span>
                <span>{analysis.savingsAdvice}</span>
            </div>
            <div className="fare-booking-window">
                <span className="advice-icon">🕐</span>
                <span>{analysis.bestBookingWindow}</span>
            </div>
        </div>
    );
}
