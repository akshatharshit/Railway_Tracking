'use client';

import { useState, useMemo } from 'react';
import {
    Route, Search, ArrowRight, Clock, IndianRupee, Repeat,
    Shield, Moon, Layers, Zap, ChevronRight, BarChart3, Star
} from 'lucide-react';
import { searchStations } from '@/data/stations';
import { optimizeRoute, criteriaOptions } from '@/lib/route-optimizer';
import { OptimizedRoute, OptimizationCriteria } from '@/lib/types';
import { formatDuration, formatFare, formatDistance } from '@/lib/utils';

export default function RouteOptimizerPage() {
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [fromCode, setFromCode] = useState('');
    const [toCode, setToCode] = useState('');
    const [showFromDD, setShowFromDD] = useState(false);
    const [showToDD, setShowToDD] = useState(false);
    const [criteria, setCriteria] = useState<OptimizationCriteria>('balanced');
    const [routes, setRoutes] = useState<OptimizedRoute[]>([]);
    const [hasOptimized, setHasOptimized] = useState(false);
    const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
    const [compareRoutes, setCompareRoutes] = useState<string[]>([]);

    const fromSuggestions = useMemo(() => searchStations(fromQuery), [fromQuery]);
    const toSuggestions = useMemo(() => searchStations(toQuery), [toQuery]);

    const handleOptimize = () => {
        if (!fromCode || !toCode) return;
        const results = optimizeRoute(fromCode, toCode, criteria);
        setRoutes(results);
        setHasOptimized(true);
        setExpandedRoute(results[0]?.id || null);
    };

    const criteriaIcons: Record<string, React.ReactNode> = {
        fastest: <Zap size={16} />,
        cheapest: <IndianRupee size={16} />,
        leastTransfers: <Repeat size={16} />,
        minDelay: <Shield size={16} />,
        overnightComfort: <Moon size={16} />,
        balanced: <Layers size={16} />,
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'var(--accent-green)';
        if (score >= 45) return 'var(--accent-amber)';
        return 'var(--accent-red)';
    };

    return (
        <>
            <div className="page-header">
                <h1>Route Optimization Engine</h1>
                <p>Find the optimal route using graph-based multi-criteria optimization</p>
            </div>

            <div className="page-content">
                {/* Optimizer Form */}
                <div className="glass-card mb-6">
                    <div className="flex gap-4 flex-wrap items-end">
                        <div className="input-group flex-1" style={{ minWidth: '200px' }}>
                            <label>Origin Station</label>
                            <div className="autocomplete-wrapper">
                                <input
                                    className="input"
                                    placeholder="Search station..."
                                    value={fromQuery}
                                    onChange={e => { setFromQuery(e.target.value); setShowFromDD(true); setFromCode(''); }}
                                    onFocus={() => setShowFromDD(true)}
                                    onBlur={() => setTimeout(() => setShowFromDD(false), 200)}
                                />
                                {showFromDD && fromSuggestions.length > 0 && (
                                    <div className="autocomplete-dropdown">
                                        {fromSuggestions.map(s => (
                                            <div
                                                key={s.code}
                                                className="autocomplete-item"
                                                onMouseDown={() => { setFromCode(s.code); setFromQuery(s.name); setShowFromDD(false); }}
                                            >
                                                <span className="code">{s.code}</span>
                                                <span className="name">{s.name}</span>
                                                <span className="city">{s.city}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ paddingBottom: '8px' }}>
                            <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />
                        </div>

                        <div className="input-group flex-1" style={{ minWidth: '200px' }}>
                            <label>Destination Station</label>
                            <div className="autocomplete-wrapper">
                                <input
                                    className="input"
                                    placeholder="Search station..."
                                    value={toQuery}
                                    onChange={e => { setToQuery(e.target.value); setShowToDD(true); setToCode(''); }}
                                    onFocus={() => setShowToDD(true)}
                                    onBlur={() => setTimeout(() => setShowToDD(false), 200)}
                                />
                                {showToDD && toSuggestions.length > 0 && (
                                    <div className="autocomplete-dropdown">
                                        {toSuggestions.map(s => (
                                            <div
                                                key={s.code}
                                                className="autocomplete-item"
                                                onMouseDown={() => { setToCode(s.code); setToQuery(s.name); setShowToDD(false); }}
                                            >
                                                <span className="code">{s.code}</span>
                                                <span className="name">{s.name}</span>
                                                <span className="city">{s.city}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button className="btn btn-primary btn-lg" onClick={handleOptimize}>
                            <Route size={18} /> Optimize
                        </button>
                    </div>

                    {/* Criteria Selection */}
                    <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                            Optimization Criteria
                        </div>
                        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                            {criteriaOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`glass-card-sm flex items-center gap-3`}
                                    style={{
                                        cursor: 'pointer', border: '1px solid',
                                        borderColor: criteria === opt.value ? 'var(--accent-blue)' : 'var(--border-glass)',
                                        background: criteria === opt.value ? 'rgba(59,130,246,0.1)' : 'var(--bg-glass)',
                                        transition: 'all 0.2s',
                                        textAlign: 'left',
                                        fontFamily: 'inherit',
                                        color: 'inherit',
                                    }}
                                    onClick={() => setCriteria(opt.value)}
                                >
                                    <div style={{ color: criteria === opt.value ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                                        {criteriaIcons[opt.value]}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: criteria === opt.value ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                                            {opt.label}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opt.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                {hasOptimized && routes.length === 0 && (
                    <div className="empty-state">
                        <h3>No routes found</h3>
                        <p>Try different stations or criteria. The stations may not be directly connected in our network.</p>
                    </div>
                )}

                {routes.length > 0 && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>
                                {routes.length} Optimized Route{routes.length > 1 ? 's' : ''} Found
                            </h2>
                            <div className="flex gap-2 items-center">
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sorted by hybrid score</span>
                            </div>
                        </div>

                        <div className="flex-col gap-4">
                            {routes.map((route, i) => (
                                <div
                                    key={route.id}
                                    className="route-card animate-fade-in"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className="route-card-header">
                                        <div className="flex items-center gap-4">
                                            {/* Score Ring */}
                                            <div className="score-ring">
                                                <svg width="60" height="60" viewBox="0 0 60 60">
                                                    <circle cx="30" cy="30" r="26" fill="none" stroke="var(--border-glass)" strokeWidth="4" />
                                                    <circle
                                                        cx="30" cy="30" r="26" fill="none"
                                                        stroke={getScoreColor(route.hybridScore)}
                                                        strokeWidth="4"
                                                        strokeDasharray={`${(route.hybridScore / 100) * 163.4} 163.4`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="score-text" style={{ color: getScoreColor(route.hybridScore) }}>
                                                    {route.hybridScore}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: 700 }}>
                                                    Route {i + 1}
                                                    {i === 0 && (
                                                        <span className="badge badge-green" style={{ marginLeft: '8px' }}>
                                                            <Star size={10} /> Best Match
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    {route.departureTime} → {route.arrivalTime}
                                                    {route.isOvernight && <span style={{ marginLeft: '8px' }}>🌙 Overnight</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            className="btn btn-ghost"
                                            onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                                        >
                                            <ChevronRight
                                                size={18}
                                                style={{
                                                    transform: expandedRoute === route.id ? 'rotate(90deg)' : 'rotate(0)',
                                                    transition: 'transform 0.2s',
                                                }}
                                            />
                                        </button>
                                    </div>

                                    {/* Route Meta */}
                                    <div className="route-meta">
                                        <div className="route-meta-item">
                                            <div className="value" style={{ color: 'var(--accent-cyan)' }}>
                                                {formatDuration(route.totalDuration)}
                                            </div>
                                            <div className="label">Duration</div>
                                        </div>
                                        <div className="route-meta-item">
                                            <div className="value" style={{ color: 'var(--accent-green)' }}>
                                                {formatFare(route.totalFare)}
                                            </div>
                                            <div className="label">Est. Fare</div>
                                        </div>
                                        <div className="route-meta-item">
                                            <div className="value">{route.transfers}</div>
                                            <div className="label">Transfers</div>
                                        </div>
                                        <div className="route-meta-item">
                                            <div className="value">{formatDistance(route.totalDistance)}</div>
                                            <div className="label">Distance</div>
                                        </div>
                                    </div>

                                    {/* Score Bars */}
                                    <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                        <div>
                                            <div className="flex justify-between" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                                <span>Comfort</span>
                                                <span>{route.comfortScore}%</span>
                                            </div>
                                            <div className="progress-bar" style={{ height: '4px' }}>
                                                <div className="progress-bar-fill" style={{ width: `${route.comfortScore}%`, background: 'var(--accent-purple)' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                                <span>Reliability</span>
                                                <span>{Math.round((1 - route.avgDelayRisk) * 100)}%</span>
                                            </div>
                                            <div className="progress-bar" style={{ height: '4px' }}>
                                                <div className="progress-bar-fill" style={{ width: `${(1 - route.avgDelayRisk) * 100}%`, background: 'var(--accent-green)' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                                <span>Hybrid Score</span>
                                                <span>{route.hybridScore}%</span>
                                            </div>
                                            <div className="progress-bar" style={{ height: '4px' }}>
                                                <div className="progress-bar-fill" style={{ width: `${route.hybridScore}%` }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Segments */}
                                    {expandedRoute === route.id && (
                                        <div className="route-segments mt-4 animate-fade-in">
                                            {route.segments.map((seg, j) => (
                                                <div key={j}>
                                                    <div className="route-segment">
                                                        <div style={{
                                                            width: '32px', height: '32px', borderRadius: '50%',
                                                            background: 'var(--gradient-primary)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '13px', fontWeight: 700, flexShrink: 0,
                                                        }}>
                                                            {j + 1}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div className="train-info">
                                                                #{seg.trainNumber} — {seg.trainName}
                                                            </div>
                                                            <div className="time-info mt-1">
                                                                {seg.fromName} ({seg.departureTime}) → {seg.toName} ({seg.arrivalTime})
                                                            </div>
                                                            <div className="flex gap-3 mt-2">
                                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                                    <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                                                                    {formatDuration(seg.duration)}
                                                                </span>
                                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                                    <Route size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                                                                    {formatDistance(seg.distance)}
                                                                </span>
                                                                <span style={{ fontSize: '11px', color: 'var(--accent-green)' }}>
                                                                    <IndianRupee size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} />
                                                                    {formatFare(seg.fare)}
                                                                </span>
                                                                <span style={{ fontSize: '11px', color: seg.delayRisk < 0.15 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                                                                    <Shield size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                                                                    {Math.round((1 - seg.delayRisk) * 100)}% reliable
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {j < route.segments.length - 1 && (
                                                        <div
                                                            className="flex items-center justify-center gap-2"
                                                            style={{ padding: '8px', color: 'var(--accent-amber)', fontSize: '12px' }}
                                                        >
                                                            <Repeat size={12} />
                                                            Transfer at {seg.toName}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!hasOptimized && (
                    <div className="empty-state">
                        <Route size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <h3>Route Optimization Engine</h3>
                        <p>Select origin and destination stations, choose optimization criteria, and find the best route.</p>
                        <div className="mt-4 flex gap-3 justify-center flex-wrap">
                            {criteriaOptions.map(opt => (
                                <span key={opt.value} className="badge badge-blue">{opt.label}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
