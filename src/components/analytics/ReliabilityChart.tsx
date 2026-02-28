'use client';

// ═══════════════════════════════════════════════
// Reliability Chart Component
// ═══════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { getTopReliableTrains, ReliabilityScore } from '@/lib/analytics/reliability-scorer';

export function ReliabilityChart() {
    const [trains, setTrains] = useState<ReliabilityScore[]>([]);
    const [selectedTrain, setSelectedTrain] = useState<ReliabilityScore | null>(null);

    useEffect(() => {
        setTrains(getTopReliableTrains(10));
    }, []);

    const getGradeColor = (grade: string) => {
        const colors: Record<string, string> = {
            'A+': '#10b981', 'A': '#22c55e', 'B+': '#84cc16',
            'B': '#eab308', 'C': '#f97316', 'D': '#ef4444',
        };
        return colors[grade] || '#64748b';
    };

    const getScoreBarWidth = (score: number) => `${Math.max(5, score)}%`;

    return (
        <div className="analytics-card reliability-chart">
            <div className="analytics-card-header">
                <div>
                    <h3>🏆 Train Reliability Rankings</h3>
                    <p className="analytics-subtitle">Punctuality and consistency scores</p>
                </div>
            </div>

            <div className="reliability-list">
                {trains.map((train, idx) => (
                    <div
                        key={train.trainNumber}
                        className={`reliability-item ${selectedTrain?.trainNumber === train.trainNumber ? 'selected' : ''}`}
                        onClick={() => setSelectedTrain(selectedTrain?.trainNumber === train.trainNumber ? null : train)}
                    >
                        <div className="reliability-rank">#{idx + 1}</div>
                        <div className="reliability-info">
                            <div className="reliability-name">
                                <span className="train-num">{train.trainNumber}</span>
                                <span className="train-name">{train.trainName}</span>
                            </div>
                            <div className="reliability-bar-container">
                                <div
                                    className="reliability-bar"
                                    style={{
                                        width: getScoreBarWidth(train.score),
                                        backgroundColor: getGradeColor(train.grade),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="reliability-score" style={{ color: getGradeColor(train.grade) }}>
                            <span className="score-value">{train.score}</span>
                            <span className="score-grade">{train.grade}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail panel */}
            {selectedTrain && (
                <div className="reliability-detail">
                    <h4>{selectedTrain.trainName} — Breakdown</h4>
                    <p className="reliability-comparison">{selectedTrain.comparison}</p>
                    <div className="breakdown-grid">
                        {[
                            { label: 'Punctuality', value: selectedTrain.breakdown.punctuality, max: 25, icon: '⏱️' },
                            { label: 'Consistency', value: selectedTrain.breakdown.consistency, max: 25, icon: '📈' },
                            { label: 'Route Score', value: selectedTrain.breakdown.routeComplexity, max: 25, icon: '🗺️' },
                            { label: 'Service Quality', value: selectedTrain.breakdown.serviceQuality, max: 25, icon: '⭐' },
                        ].map(item => (
                            <div key={item.label} className="breakdown-item">
                                <div className="breakdown-header">
                                    <span>{item.icon} {item.label}</span>
                                    <span className="breakdown-score">{item.value}/{item.max}</span>
                                </div>
                                <div className="breakdown-bar-container">
                                    <div
                                        className="breakdown-bar"
                                        style={{ width: `${(item.value / item.max) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
