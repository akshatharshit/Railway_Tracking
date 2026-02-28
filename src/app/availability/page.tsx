'use client';

import { useState, useMemo } from 'react';
import {
    Armchair, Search, Calendar, BarChart3, TrendingUp,
    CheckCircle2, AlertTriangle, XCircle, ChevronDown
} from 'lucide-react';
import { trains } from '@/data/trains';
import { getAvailability, getCoachesForTrain, getAvailabilityForDates } from '@/lib/availability';
import { TrainClass, SeatAvailability, CoachData } from '@/lib/types';
import { formatFare, classLabel, availabilityColor } from '@/lib/utils';

export default function AvailabilityPage() {
    const [selectedTrain, setSelectedTrain] = useState(trains[0]?.number || '');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState<TrainClass>('3AC');
    const [availability, setAvailability] = useState<SeatAvailability | null>(null);
    const [weekAvailability, setWeekAvailability] = useState<SeatAvailability[]>([]);
    const [coaches, setCoaches] = useState<CoachData[]>([]);
    const [selectedCoachIdx, setSelectedCoachIdx] = useState(0);
    const [hasChecked, setHasChecked] = useState(false);
    const [trainSearch, setTrainSearch] = useState('');

    const train = trains.find(t => t.number === selectedTrain);
    const availableClasses = train?.classes || [];

    const filteredTrains = useMemo(() =>
        trains.filter(t =>
            t.number.includes(trainSearch) || t.name.toLowerCase().includes(trainSearch.toLowerCase())
        ).slice(0, 15),
        [trainSearch]
    );

    const handleCheck = () => {
        if (!selectedTrain || !selectedClass) return;
        const avail = getAvailability(selectedTrain, selectedDate, selectedClass);
        setAvailability(avail);
        const week = getAvailabilityForDates(selectedTrain, selectedDate, selectedClass, 7);
        setWeekAvailability(week);
        const coachData = getCoachesForTrain(selectedTrain, selectedClass);
        setCoaches(coachData);
        setSelectedCoachIdx(0);
        setHasChecked(true);
    };

    const statusIcon = (status: string) => {
        switch (status) {
            case 'AVL': return <CheckCircle2 size={16} />;
            case 'RAC': return <AlertTriangle size={16} />;
            case 'WL': return <XCircle size={16} />;
            default: return <XCircle size={16} />;
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>Seat Availability & Coach Intelligence</h1>
                <p>Check availability, view coach layouts, and analyze occupancy</p>
            </div>

            <div className="page-content">
                {/* Check Form */}
                <div className="glass-card mb-6">
                    <div className="flex gap-4 flex-wrap items-end">
                        <div className="input-group flex-1" style={{ minWidth: '240px' }}>
                            <label>Train</label>
                            <input
                                className="input"
                                placeholder="Search train..."
                                value={trainSearch}
                                onChange={e => setTrainSearch(e.target.value)}
                                list="train-list"
                            />
                            <datalist id="train-list">
                                {filteredTrains.map(t => (
                                    <option key={t.number} value={t.number}>{t.name} (#{t.number})</option>
                                ))}
                            </datalist>
                            {trainSearch && filteredTrains.length > 0 && (
                                <div style={{ marginTop: '4px' }}>
                                    <div className="chip-group">
                                        {filteredTrains.slice(0, 5).map(t => (
                                            <button
                                                key={t.number}
                                                className={`chip ${selectedTrain === t.number ? 'active' : ''}`}
                                                onClick={() => { setSelectedTrain(t.number); setTrainSearch(t.name); }}
                                                style={{ fontSize: '11px' }}
                                            >
                                                #{t.number} {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="input-group" style={{ minWidth: '160px' }}>
                            <label>Date</label>
                            <input
                                type="date"
                                className="input"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <div className="input-group" style={{ minWidth: '150px' }}>
                            <label>Class</label>
                            <select
                                className="input"
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value as TrainClass)}
                            >
                                {availableClasses.map(c => (
                                    <option key={c} value={c}>{classLabel(c)}</option>
                                ))}
                            </select>
                        </div>

                        <button className="btn btn-primary btn-lg" onClick={handleCheck}>
                            <Search size={18} /> Check Availability
                        </button>
                    </div>
                </div>

                {hasChecked && availability && (
                    <div className="animate-fade-in">
                        {/* Status Dashboard */}
                        <div className="grid-4 mb-6">
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: `${availabilityColor(availability.status)}20` }}>
                                    {statusIcon(availability.status)}
                                </div>
                                <div className="stat-info">
                                    <h3 style={{ color: availabilityColor(availability.status) }}>{availability.status}</h3>
                                    <p>Booking Status</p>
                                    {availability.availableCount > 0 && (
                                        <div className="stat-change positive">{availability.availableCount} seats available</div>
                                    )}
                                    {availability.waitlistPosition && (
                                        <div className="stat-change negative">WL Position: {availability.waitlistPosition}</div>
                                    )}
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>
                                    <Armchair size={22} style={{ color: 'var(--accent-blue)' }} />
                                </div>
                                <div className="stat-info">
                                    <h3>{formatFare(availability.fare)}</h3>
                                    <p>Dynamic Fare</p>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {classLabel(availability.trainClass)} class
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
                                    <TrendingUp size={22} style={{ color: 'var(--accent-green)' }} />
                                </div>
                                <div className="stat-info">
                                    <h3>{availability.confirmationProbability}%</h3>
                                    <p>Confirmation Probability</p>
                                    <div className="progress-bar mt-2" style={{ height: '6px' }}>
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${availability.confirmationProbability}%`,
                                                background: availability.confirmationProbability > 70 ? 'var(--accent-green)' :
                                                    availability.confirmationProbability > 40 ? 'var(--accent-amber)' : 'var(--accent-red)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
                                    <BarChart3 size={22} style={{ color: 'var(--accent-amber)' }} />
                                </div>
                                <div className="stat-info">
                                    <h3>{availability.chartPrepared ? 'Prepared' : 'Pending'}</h3>
                                    <p>Chart Status</p>
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%', marginTop: '8px',
                                        background: availability.chartPrepared ? 'var(--accent-green)' : 'var(--accent-amber)',
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px' }}>
                            {/* Coach Layout */}
                            <div className="glass-card">
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>
                                    Coach Layout — {classLabel(selectedClass)}
                                </h3>

                                {coaches.length > 0 && (
                                    <>
                                        <div className="coach-tabs">
                                            {coaches.map((coach, i) => (
                                                <button
                                                    key={coach.coachNumber}
                                                    className={`coach-tab ${selectedCoachIdx === i ? 'active' : ''}`}
                                                    onClick={() => setSelectedCoachIdx(i)}
                                                >
                                                    {coach.coachNumber}
                                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                                                        ({Math.round((coach.occupiedBerths / coach.totalBerths) * 100)}%)
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {coaches[selectedCoachIdx] && (
                                            <div className="coach-container">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                        {coaches[selectedCoachIdx].occupiedBerths} / {coaches[selectedCoachIdx].totalBerths} occupied
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16,185,129,0.3)' }} />
                                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Available</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239,68,68,0.3)' }} />
                                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Occupied</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="berth-grid">
                                                    {coaches[selectedCoachIdx].berths.map(berth => (
                                                        <div
                                                            key={berth.number}
                                                            className={`berth ${berth.occupied ? 'occupied' : 'available'}`}
                                                            title={`Berth ${berth.number} (${berth.type}) — ${berth.occupied ? 'Occupied' : 'Available'}`}
                                                        >
                                                            <div>
                                                                <div style={{ fontSize: '11px', fontWeight: 700 }}>{berth.number}</div>
                                                                <div style={{ fontSize: '8px', opacity: 0.7 }}>{berth.type}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Weekly Availability */}
                            <div className="glass-card">
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
                                    7-Day Availability
                                </h3>
                                <div className="flex-col gap-3">
                                    {weekAvailability.map((day, i) => {
                                        const d = new Date(day.date);
                                        const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
                                        const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between"
                                                style={{
                                                    padding: '12px', borderRadius: '8px',
                                                    background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{dayName}, {dateStr}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                        {formatFare(day.fare)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                            {day.confirmationProbability}% confirm
                                                        </div>
                                                        <div className="progress-bar mt-1" style={{ width: '80px', height: '4px' }}>
                                                            <div
                                                                className="progress-bar-fill"
                                                                style={{
                                                                    width: `${day.confirmationProbability}%`,
                                                                    background: day.confirmationProbability > 70 ? 'var(--accent-green)' :
                                                                        day.confirmationProbability > 40 ? 'var(--accent-amber)' : 'var(--accent-red)',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            background: `${availabilityColor(day.status)}20`,
                                                            color: availabilityColor(day.status),
                                                            minWidth: '50px',
                                                            textAlign: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {day.status}
                                                        {day.waitlistPosition ? ` ${day.waitlistPosition}` : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Occupancy Bar Chart */}
                                <div className="mt-6">
                                    <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>
                                        Occupancy Analysis
                                    </h4>
                                    <div className="flex gap-2" style={{ alignItems: 'flex-end', height: '120px' }}>
                                        {coaches.map((coach, i) => {
                                            const pct = Math.round((coach.occupiedBerths / coach.totalBerths) * 100);
                                            return (
                                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{pct}%</span>
                                                    <div
                                                        style={{
                                                            width: '100%', borderRadius: '4px 4px 0 0',
                                                            height: `${pct}%`,
                                                            background: pct > 80 ? 'var(--accent-red)' : pct > 50 ? 'var(--accent-amber)' : 'var(--accent-green)',
                                                            opacity: 0.7,
                                                            transition: 'height 0.5s ease',
                                                        }}
                                                    />
                                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{coach.coachNumber}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!hasChecked && (
                    <div className="empty-state">
                        <Armchair size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <h3>Check Seat Availability</h3>
                        <p>Select a train, date, and class to view availability, coach layout, and occupancy analytics.</p>
                    </div>
                )}
            </div>
        </>
    );
}
