'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Radio, MapPin, Clock, Gauge, AlertTriangle, CheckCircle2,
    RefreshCw, Navigation, ArrowRight, ChevronRight
} from 'lucide-react';
import { simulateLiveStatus, getAllTrainsForLiveStatus } from '@/lib/live-tracker';
import { trains } from '@/data/trains';
import { LiveTrainStatus } from '@/lib/types';
import { formatDuration, statusColor } from '@/lib/utils';

export default function LiveStatusPage() {
    const allTrains = getAllTrainsForLiveStatus();
    const [selectedTrain, setSelectedTrain] = useState(allTrains[0]?.number || '');
    const [status, setStatus] = useState<LiveTrainStatus | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastRefresh, setLastRefresh] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const refreshStatus = useCallback(() => {
        if (!selectedTrain) return;
        const s = simulateLiveStatus(selectedTrain);
        setStatus(s);
        setLastRefresh(new Date().toLocaleTimeString());
    }, [selectedTrain]);

    useEffect(() => {
        refreshStatus();
    }, [refreshStatus]);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(refreshStatus, 5000);
        return () => clearInterval(interval);
    }, [autoRefresh, refreshStatus]);

    const train = trains.find(t => t.number === selectedTrain);
    const filteredTrains = allTrains.filter(t =>
        t.number.includes(searchQuery) || t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Map coordinates for SVG visualization
    const getMapPosition = (lat: number, lng: number) => {
        const minLat = 8;
        const maxLat = 33;
        const minLng = 68;
        const maxLng = 93;
        const x = ((lng - minLng) / (maxLng - minLng)) * 100;
        const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
        return { x: `${x}%`, y: `${y}%` };
    };

    return (
        <>
            <div className="page-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1>Live Train Running Status</h1>
                        <p>Real-time train tracking and delay monitoring</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            className={`chip ${autoRefresh ? 'active' : ''}`}
                            onClick={() => setAutoRefresh(!autoRefresh)}
                        >
                            <RefreshCw size={12} style={{ animation: autoRefresh ? 'spin 2s linear infinite' : 'none' }} />
                            Auto Refresh
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={refreshStatus}>
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="grid-2" style={{ gridTemplateColumns: '320px 1fr' }}>
                    {/* Train Selector */}
                    <div className="glass-card" style={{ maxHeight: 'calc(100vh - 160px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div className="input-group mb-4">
                            <label>Select Train</label>
                            <input
                                className="input"
                                placeholder="Search by name or number..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {filteredTrains.map(t => (
                                <div
                                    key={t.number}
                                    className={`flex items-center gap-3`}
                                    style={{
                                        padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                                        background: selectedTrain === t.number ? 'rgba(59,130,246,0.15)' : 'transparent',
                                        borderLeft: selectedTrain === t.number ? '3px solid var(--accent-blue)' : '3px solid transparent',
                                        transition: 'all 0.2s',
                                        marginBottom: '2px',
                                    }}
                                    onClick={() => setSelectedTrain(t.number)}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: selectedTrain === t.number ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                                            {t.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            #{t.number} · {t.from} → {t.to}
                                        </div>
                                    </div>
                                    <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Train Details */}
                    <div className="flex-col gap-4">
                        {status && train && (
                            <>
                                {/* Status Header */}
                                <div className="glass-card">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{status.trainName}</h2>
                                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                Train #{status.trainNumber} · Updated at {lastRefresh}
                                            </div>
                                        </div>
                                        <div
                                            className="badge"
                                            style={{
                                                background: `${statusColor(status.status)}20`,
                                                color: statusColor(status.status),
                                                fontSize: '13px',
                                                padding: '6px 14px',
                                            }}
                                        >
                                            {status.status === 'on-time' && <CheckCircle2 size={14} />}
                                            {status.status === 'delayed' && <AlertTriangle size={14} />}
                                            {status.status.replace('-', ' ').toUpperCase()}
                                            {status.delay > 0 && ` (+${status.delay} min)`}
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid-4">
                                        <div className="glass-card-sm text-center">
                                            <Gauge size={20} style={{ color: 'var(--accent-cyan)', margin: '0 auto 8px' }} />
                                            <div style={{ fontSize: '22px', fontWeight: 700 }}>{status.currentSpeed}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>km/h Speed</div>
                                        </div>
                                        <div className="glass-card-sm text-center">
                                            <Navigation size={20} style={{ color: 'var(--accent-green)', margin: '0 auto 8px' }} />
                                            <div style={{ fontSize: '22px', fontWeight: 700 }}>{status.journeyCompleted}%</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Journey Done</div>
                                        </div>
                                        <div className="glass-card-sm text-center">
                                            <Clock size={20} style={{ color: 'var(--accent-amber)', margin: '0 auto 8px' }} />
                                            <div style={{ fontSize: '22px', fontWeight: 700 }}>{status.delay > 0 ? `+${status.delay}` : status.delay}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>min Delay</div>
                                        </div>
                                        <div className="glass-card-sm text-center">
                                            <MapPin size={20} style={{ color: 'var(--accent-purple)', margin: '0 auto 8px' }} />
                                            <div style={{ fontSize: '22px', fontWeight: 700 }}>{status.platformNumber || '--'}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Platform</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Journey Progress</span>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-cyan)' }}>{status.journeyCompleted}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-bar-fill" style={{ width: `${status.journeyCompleted}%` }} />
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{status.lastStation.stationName}</span>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{status.nextStation.stationName}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Map */}
                                <div className="glass-card">
                                    <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Live Route Map</h3>
                                    <div className="live-map" style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 100%)' }}>
                                        {/* India outline approx */}
                                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
                                            <path d="M30,5 L40,5 L50,8 L55,15 L60,20 L55,25 L50,30 L55,40 L60,50 L65,60 L60,70 L50,80 L40,90 L35,95 L30,90 L25,80 L20,70 L20,60 L25,50 L30,40 L25,30 L20,20 L25,10 Z" fill="white" />
                                        </svg>

                                        {/* Route Line */}
                                        {train.stops.map((stop, i) => {
                                            if (i === 0) return null;
                                            const prev = train.stops[i - 1];
                                            const p1 = getMapPosition(
                                                status.currentLat + (Math.random() - 0.5) * 0, // Use actual coords
                                                status.currentLng + (Math.random() - 0.5) * 0
                                            );
                                            return null; // Lines drawn in SVG below
                                        })}

                                        {/* Station dots */}
                                        {train.stops.map((stop, i) => {
                                            const coordMap: Record<string, { lat: number; lng: number }> = {
                                                NDLS: { lat: 28.64, lng: 77.22 }, BCT: { lat: 18.97, lng: 72.82 },
                                                HWH: { lat: 22.58, lng: 88.34 }, MAS: { lat: 13.08, lng: 80.27 },
                                                SBC: { lat: 12.98, lng: 77.57 }, SC: { lat: 17.43, lng: 78.50 },
                                                BPL: { lat: 23.27, lng: 77.41 }, NGP: { lat: 21.15, lng: 79.09 },
                                                AGC: { lat: 27.16, lng: 78.02 }, BRC: { lat: 22.31, lng: 73.18 },
                                                CNB: { lat: 26.46, lng: 80.35 }, PNBE: { lat: 25.61, lng: 85.13 },
                                                ALD: { lat: 25.43, lng: 81.84 }, MGS: { lat: 25.28, lng: 83.12 },
                                                DHN: { lat: 23.79, lng: 86.43 }, BSB: { lat: 25.32, lng: 83.01 },
                                                BBS: { lat: 20.27, lng: 85.84 }, VSKP: { lat: 17.72, lng: 83.29 },
                                                TVC: { lat: 8.49, lng: 76.95 }, ERS: { lat: 9.97, lng: 76.29 },
                                                CBE: { lat: 11.00, lng: 76.97 }, NZM: { lat: 28.59, lng: 77.25 },
                                                LKO: { lat: 26.83, lng: 80.92 }, GKP: { lat: 26.75, lng: 83.37 },
                                                GHY: { lat: 26.19, lng: 91.74 }, DDN: { lat: 30.32, lng: 78.04 },
                                                JP: { lat: 26.92, lng: 75.79 }, ADI: { lat: 23.02, lng: 72.57 },
                                                PUNE: { lat: 18.53, lng: 73.87 }, ST: { lat: 21.21, lng: 72.84 },
                                                GWL: { lat: 26.21, lng: 78.19 }, KGP: { lat: 22.33, lng: 87.31 },
                                                AJJ: { lat: 13.08, lng: 79.67 },
                                            };
                                            const coords = coordMap[stop.stationCode] || { lat: 22, lng: 78 };
                                            const pos = getMapPosition(coords.lat, coords.lng);
                                            const isLast = stop.stationCode === status.lastStation.stationCode;
                                            const isNext = stop.stationCode === status.nextStation.stationCode;

                                            return (
                                                <div key={i}>
                                                    <div
                                                        className="map-station-dot"
                                                        style={{
                                                            left: pos.x, top: pos.y,
                                                            background: isLast ? 'var(--accent-green)' : isNext ? 'var(--accent-amber)' : 'var(--text-muted)',
                                                            width: isLast || isNext ? '10px' : '6px',
                                                            height: isLast || isNext ? '10px' : '6px',
                                                        }}
                                                    />
                                                    <div
                                                        className="map-station-label"
                                                        style={{
                                                            left: pos.x, top: pos.y,
                                                            color: isLast ? 'var(--accent-green)' : isNext ? 'var(--accent-amber)' : 'var(--text-muted)',
                                                            fontWeight: isLast || isNext ? 600 : 400,
                                                        }}
                                                    >
                                                        {stop.stationCode}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Train position */}
                                        {(() => {
                                            const pos = getMapPosition(status.currentLat, status.currentLng);
                                            return <div className="map-train-dot" style={{ left: pos.x, top: pos.y }} />;
                                        })()}
                                    </div>
                                </div>

                                {/* Journey Timeline */}
                                <div className="glass-card">
                                    <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Journey Timeline</h3>
                                    <div className="timeline">
                                        {train.stops.map((stop, i) => {
                                            const lastIdx = train.stops.findIndex(s => s.stationCode === status.lastStation.stationCode);
                                            const isCompleted = i <= lastIdx;
                                            const isActive = i === lastIdx + 1;

                                            return (
                                                <div key={i} className="timeline-item animate-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
                                                    <div className={`timeline-dot ${isCompleted ? 'completed' : isActive ? 'active' : ''}`} />
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="station-name">{stop.stationName}</div>
                                                            <div className="station-time">
                                                                {stop.arrivalTime !== '--' ? `Arr: ${stop.arrivalTime}` : ''}
                                                                {stop.arrivalTime !== '--' && stop.departureTime !== '--' ? ' · ' : ''}
                                                                {stop.departureTime !== '--' ? `Dep: ${stop.departureTime}` : ''}
                                                            </div>
                                                            <div className="station-info">
                                                                Day {stop.dayNumber} · {stop.distanceFromSource} km from source
                                                                {stop.platform ? ` · Platform ${stop.platform}` : ''}
                                                            </div>
                                                        </div>
                                                        {isCompleted && (
                                                            <CheckCircle2 size={16} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                                                        )}
                                                        {isActive && (
                                                            <span className="badge badge-amber" style={{ flexShrink: 0 }}>
                                                                <Radio size={10} /> Next
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
}
