'use client';

// ═══════════════════════════════════════════════
// PNR Status Check Page
// ═══════════════════════════════════════════════

import { useState } from 'react';
import { getPNRStatus, PNRStatus } from '@/lib/api/pnr';
import { predictConfirmation, ConfirmationPrediction } from '@/lib/ai/confirmation-predictor';

export default function PNRPage() {
    const [pnrInput, setPnrInput] = useState('');
    const [pnrStatus, setPnrStatus] = useState<PNRStatus | null>(null);
    const [prediction, setPrediction] = useState<ConfirmationPrediction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        const pnr = pnrInput.trim();
        if (pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
            setError('Please enter a valid 10-digit PNR number.');
            return;
        }

        setLoading(true);
        setError(null);
        setPnrStatus(null);
        setPrediction(null);

        try {
            const response = await getPNRStatus(pnr);
            if (response.data) {
                setPnrStatus(response.data);

                // Run AI prediction for non-confirmed passengers
                const firstPassenger = response.data.passengers[0];
                if (firstPassenger && firstPassenger.currentStatus !== 'CNF') {
                    const wlMatch = firstPassenger.currentStatus.match(/\d+/);
                    const wlPosition = wlMatch ? parseInt(wlMatch[0]) : 10;
                    const isRAC = firstPassenger.currentStatus.startsWith('RAC');
                    const travelDate = new Date(response.data.dateOfJourney);
                    const today = new Date();
                    const daysToTravel = Math.max(1, Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

                    const pred = predictConfirmation({
                        waitlistPosition: wlPosition,
                        daysToTravel,
                        trainClass: response.data.classType,
                        isRACNotWL: isRAC,
                        isTatkal: response.data.quota === 'Tatkal',
                        travelDate: response.data.dateOfJourney,
                    });
                    setPrediction(pred);
                }
            } else {
                setError(response.error || 'PNR not found');
            }
        } catch {
            setError('Failed to fetch PNR status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        if (status.startsWith('CNF') || status === 'Confirmed') return '#10b981';
        if (status.startsWith('RAC')) return '#f59e0b';
        if (status.startsWith('WL')) return '#ef4444';
        return '#64748b';
    };

    const getVerdictColor = (verdict: string) => {
        const map: Record<string, string> = {
            very_likely: '#10b981',
            likely: '#22c55e',
            uncertain: '#eab308',
            unlikely: '#f97316',
            very_unlikely: '#ef4444',
        };
        return map[verdict] || '#64748b';
    };

    const getVerdictLabel = (verdict: string) => {
        const map: Record<string, string> = {
            very_likely: 'Very Likely',
            likely: 'Likely',
            uncertain: 'Uncertain',
            unlikely: 'Unlikely',
            very_unlikely: 'Very Unlikely',
        };
        return map[verdict] || verdict;
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🎫 PNR Status Check</h1>
                <p className="page-subtitle">Check your booking status with AI-powered confirmation prediction</p>
            </div>

            {/* Search */}
            <div className="glass-card pnr-search-card">
                <div className="pnr-input-group">
                    <div className="pnr-input-wrapper">
                        <input
                            type="text"
                            placeholder="Enter 10-digit PNR number"
                            value={pnrInput}
                            onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="pnr-input"
                            maxLength={10}
                        />
                        <span className="pnr-counter">{pnrInput.length}/10</span>
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading || pnrInput.length !== 10}
                        className="btn-primary pnr-search-btn"
                    >
                        {loading ? (
                            <span className="btn-loading">
                                <span className="spinner" /> Checking...
                            </span>
                        ) : (
                            'Check Status'
                        )}
                    </button>
                </div>
                <div className="pnr-hint">
                    💡 Try any 10-digit number for a demo (e.g., 2345678901)
                </div>
            </div>

            {error && (
                <div className="glass-card error-card">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {pnrStatus && (
                <div className="pnr-results">
                    {/* Train Info */}
                    <div className="glass-card pnr-train-card">
                        <div className="pnr-train-header">
                            <div>
                                <span className="pnr-train-number">{pnrStatus.trainNumber}</span>
                                <span className="pnr-train-name">{pnrStatus.trainName}</span>
                            </div>
                            <div className="pnr-chart-status" data-prepared={pnrStatus.chartStatus === 'Chart Prepared'}>
                                {pnrStatus.chartStatus}
                            </div>
                        </div>

                        <div className="pnr-journey-info">
                            <div className="pnr-station">
                                <span className="pnr-station-code">{pnrStatus.boardingStation}</span>
                                <span className="pnr-station-name">{pnrStatus.boardingStationName}</span>
                            </div>
                            <div className="pnr-arrow">
                                <div className="pnr-arrow-line" />
                                <span className="pnr-date">{new Date(pnrStatus.dateOfJourney).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="pnr-station">
                                <span className="pnr-station-code">{pnrStatus.destinationStation}</span>
                                <span className="pnr-station-name">{pnrStatus.destinationStationName}</span>
                            </div>
                        </div>

                        <div className="pnr-meta-row">
                            <span className="pnr-meta">Class: <strong>{pnrStatus.classType}</strong></span>
                            <span className="pnr-meta">Quota: <strong>{pnrStatus.quota}</strong></span>
                            <span className="pnr-meta">Fare: <strong>₹{pnrStatus.fare.toLocaleString()}</strong></span>
                            <span className="pnr-meta">Booked: <strong>{new Date(pnrStatus.bookingDate).toLocaleDateString('en-IN')}</strong></span>
                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="glass-card pnr-passengers-card">
                        <h3>👤 Passenger Details</h3>
                        <div className="passenger-table">
                            <div className="passenger-header">
                                <span>#</span>
                                <span>Booking Status</span>
                                <span>Current Status</span>
                                <span>Coach/Berth</span>
                                <span>Berth Type</span>
                            </div>
                            {pnrStatus.passengers.map((p) => (
                                <div key={p.number} className="passenger-row">
                                    <span className="passenger-num">P{p.number}</span>
                                    <span className="passenger-status">{p.bookingStatus}</span>
                                    <span
                                        className="passenger-current"
                                        style={{ color: getStatusColor(p.currentStatus) }}
                                    >
                                        {p.currentStatus}
                                    </span>
                                    <span className="passenger-coach">{p.coachPosition}</span>
                                    <span className="passenger-berth">{p.berthType}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Prediction */}
                    {prediction && (
                        <div className="glass-card pnr-prediction-card">
                            <h3>🤖 AI Confirmation Prediction</h3>

                            <div className="prediction-main">
                                <div className="prediction-meter">
                                    <svg viewBox="0 0 120 120" className="prediction-ring">
                                        <circle cx="60" cy="60" r="52" className="prediction-ring-bg" />
                                        <circle
                                            cx="60" cy="60" r="52"
                                            className="prediction-ring-fill"
                                            style={{
                                                strokeDasharray: `${(prediction.probability / 100) * 327} 327`,
                                                stroke: getVerdictColor(prediction.verdict),
                                            }}
                                        />
                                    </svg>
                                    <div className="prediction-value">
                                        <span className="prediction-pct">{prediction.probability}%</span>
                                        <span className="prediction-label" style={{ color: getVerdictColor(prediction.verdict) }}>
                                            {getVerdictLabel(prediction.verdict)}
                                        </span>
                                    </div>
                                </div>

                                <div className="prediction-details">
                                    <p className="prediction-recommendation">{prediction.recommendation}</p>
                                    <div className="prediction-reasoning">
                                        {prediction.reasoning.map((r, i) => (
                                            <div key={i} className="reasoning-item">
                                                <span className="reasoning-dot" />
                                                {r}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Factors */}
                            <div className="prediction-factors">
                                <h4>Contributing Factors</h4>
                                <div className="factors-grid">
                                    {prediction.factors.map((f, i) => (
                                        <div key={i} className={`factor-item impact-${f.impact}`}>
                                            <span className="factor-name">{f.name}</span>
                                            <span className="factor-desc">{f.description}</span>
                                            <span className={`factor-badge ${f.impact}`}>
                                                {f.impact === 'positive' ? '✓' : f.impact === 'negative' ? '✗' : '—'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Alternative dates */}
                            {prediction.alternativeDates.length > 0 && (
                                <div className="prediction-alternatives">
                                    <h4>📅 Better Date Options</h4>
                                    <div className="alternatives-list">
                                        {prediction.alternativeDates.map((alt, i) => (
                                            <div key={i} className="alternative-item">
                                                <span className="alt-date">
                                                    {new Date(alt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', weekday: 'short' })}
                                                </span>
                                                <span className="alt-prob" style={{ color: alt.probability >= 60 ? '#10b981' : '#f59e0b' }}>
                                                    {alt.probability}%
                                                </span>
                                                <span className="alt-reason">{alt.reason}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
