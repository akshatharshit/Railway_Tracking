'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
    Search, ArrowRight, Star, X, ArrowUpDown, Filter, Clock,
    MapPin, Zap, ChevronDown, IndianRupee, GitCompareArrows
} from 'lucide-react';
import { searchStations } from '@/data/stations';
import { searchTrains as searchTrainsEngine } from '@/lib/search-engine';
import { SearchResult, TrainClass, SortBy } from '@/lib/types';
import { formatDuration, formatDistance, formatFare, categoryColor, classLabel } from '@/lib/utils';

function SearchPageContent() {
    const searchParams = useSearchParams();
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [fromCode, setFromCode] = useState(searchParams.get('from') || '');
    const [toCode, setToCode] = useState(searchParams.get('to') || '');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [sortBy, setSortBy] = useState<SortBy>('fastest');
    const [selectedClass, setSelectedClass] = useState<TrainClass | ''>('');
    const [overnight, setOvernight] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [compareList, setCompareList] = useState<SearchResult[]>([]);
    const [showComparison, setShowComparison] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [highlightedFrom, setHighlightedFrom] = useState(-1);
    const [highlightedTo, setHighlightedTo] = useState(-1);

    const fromRef = useRef<HTMLInputElement>(null);
    const toRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('railintel-favorites');
        if (saved) setFavorites(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (fromCode && toCode) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fromSuggestions = useMemo(() => searchStations(fromQuery), [fromQuery]);
    const toSuggestions = useMemo(() => searchStations(toQuery), [toQuery]);

    const handleSearch = useCallback(() => {
        if (!fromCode || !toCode) return;
        const res = searchTrainsEngine({
            from: fromCode,
            to: toCode,
            date,
            sortBy,
            trainClass: selectedClass || undefined,
            overnight,
        });
        setResults(res);
        setHasSearched(true);
    }, [fromCode, toCode, date, sortBy, selectedClass, overnight]);

    const toggleCompare = (result: SearchResult) => {
        setCompareList(prev => {
            const exists = prev.find(r => r.train.number === result.train.number);
            if (exists) return prev.filter(r => r.train.number !== result.train.number);
            if (prev.length >= 3) return prev;
            return [...prev, result];
        });
    };

    const toggleFavorite = (trainNum: string) => {
        setFavorites(prev => {
            const next = prev.includes(trainNum)
                ? prev.filter(f => f !== trainNum)
                : [...prev, trainNum];
            localStorage.setItem('railintel-favorites', JSON.stringify(next));
            return next;
        });
    };

    const handleFromKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedFrom(prev => Math.min(prev + 1, fromSuggestions.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedFrom(prev => Math.max(prev - 1, 0)); }
        else if (e.key === 'Enter' && highlightedFrom >= 0) {
            const s = fromSuggestions[highlightedFrom];
            setFromCode(s.code); setFromQuery(s.name); setShowFromDropdown(false); setHighlightedFrom(-1);
        }
    };

    const handleToKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedTo(prev => Math.min(prev + 1, toSuggestions.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedTo(prev => Math.max(prev - 1, 0)); }
        else if (e.key === 'Enter' && highlightedTo >= 0) {
            const s = toSuggestions[highlightedTo];
            setToCode(s.code); setToQuery(s.name); setShowToDropdown(false); setHighlightedTo(-1);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>Train Search & Discovery</h1>
                <p>Find and compare trains between any two stations</p>
            </div>

            <div className="page-content">
                {/* Search Form */}
                <div className="glass-card mb-6">
                    <div className="flex gap-4 flex-wrap items-end">
                        {/* From */}
                        <div className="input-group flex-1" style={{ minWidth: '200px' }}>
                            <label>From Station</label>
                            <div className="autocomplete-wrapper">
                                <input
                                    ref={fromRef}
                                    className="input"
                                    placeholder="Search station..."
                                    value={fromQuery}
                                    onChange={e => { setFromQuery(e.target.value); setShowFromDropdown(true); setFromCode(''); setHighlightedFrom(-1); }}
                                    onFocus={() => setShowFromDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                                    onKeyDown={handleFromKeyDown}
                                />
                                {showFromDropdown && fromSuggestions.length > 0 && (
                                    <div className="autocomplete-dropdown">
                                        {fromSuggestions.map((s, i) => (
                                            <div
                                                key={s.code}
                                                className={`autocomplete-item ${i === highlightedFrom ? 'highlighted' : ''}`}
                                                onMouseDown={() => { setFromCode(s.code); setFromQuery(s.name); setShowFromDropdown(false); }}
                                            >
                                                <span className="code">{s.code}</span>
                                                <span className="name">{s.name}</span>
                                                <span className="city">{s.city}, {s.state}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ paddingBottom: '8px' }}>
                            <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />
                        </div>

                        {/* To */}
                        <div className="input-group flex-1" style={{ minWidth: '200px' }}>
                            <label>To Station</label>
                            <div className="autocomplete-wrapper">
                                <input
                                    ref={toRef}
                                    className="input"
                                    placeholder="Search station..."
                                    value={toQuery}
                                    onChange={e => { setToQuery(e.target.value); setShowToDropdown(true); setToCode(''); setHighlightedTo(-1); }}
                                    onFocus={() => setShowToDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                                    onKeyDown={handleToKeyDown}
                                />
                                {showToDropdown && toSuggestions.length > 0 && (
                                    <div className="autocomplete-dropdown">
                                        {toSuggestions.map((s, i) => (
                                            <div
                                                key={s.code}
                                                className={`autocomplete-item ${i === highlightedTo ? 'highlighted' : ''}`}
                                                onMouseDown={() => { setToCode(s.code); setToQuery(s.name); setShowToDropdown(false); }}
                                            >
                                                <span className="code">{s.code}</span>
                                                <span className="name">{s.name}</span>
                                                <span className="city">{s.city}, {s.state}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date */}
                        <div className="input-group" style={{ minWidth: '160px' }}>
                            <label>Date</label>
                            <input
                                type="date"
                                className="input"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>

                        {/* Search */}
                        <button className="btn btn-primary btn-lg" onClick={handleSearch} style={{ marginBottom: '0' }}>
                            <Search size={18} />
                            Search
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 flex-wrap items-center mt-4" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                        <div className="flex items-center gap-2">
                            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>SORT BY:</span>
                        </div>
                        <div className="chip-group">
                            {(['fastest', 'cheapest', 'leastStops', 'departure'] as SortBy[]).map(s => (
                                <button
                                    key={s}
                                    className={`chip ${sortBy === s ? 'active' : ''}`}
                                    onClick={() => { setSortBy(s); if (hasSearched) setTimeout(handleSearch, 0); }}
                                >
                                    {s === 'fastest' ? '⚡ Fastest' : s === 'cheapest' ? '💰 Cheapest' : s === 'leastStops' ? '📍 Least Stops' : '🕐 Departure'}
                                </button>
                            ))}
                        </div>

                        <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }} />

                        <select
                            className="input"
                            style={{ width: 'auto', minWidth: '140px' }}
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value as TrainClass)}
                        >
                            <option value="">All Classes</option>
                            {(['1AC', '2AC', '3AC', 'SL', 'CC', 'EC', '2S'] as TrainClass[]).map(c => (
                                <option key={c} value={c}>{classLabel(c)}</option>
                            ))}
                        </select>

                        <button
                            className={`chip ${overnight ? 'active' : ''}`}
                            onClick={() => setOvernight(!overnight)}
                        >
                            🌙 Overnight
                        </button>
                    </div>
                </div>

                {/* Compare bar */}
                {compareList.length > 0 && (
                    <div className="glass-card mb-4 flex items-center justify-between" style={{ padding: '12px 20px' }}>
                        <div className="flex items-center gap-2">
                            <GitCompareArrows size={16} style={{ color: 'var(--accent-cyan)' }} />
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>
                                {compareList.length} train{compareList.length > 1 ? 's' : ''} selected for comparison
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-primary btn-sm" onClick={() => setShowComparison(true)}>
                                Compare Now
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setCompareList([])}>
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {/* Results */}
                {hasSearched && results.length === 0 && (
                    <div className="empty-state">
                        <h3>No trains found</h3>
                        <p>Try different stations, dates, or remove filters.</p>
                    </div>
                )}

                <div className="flex-col gap-4">
                    {results.map((result, i) => (
                        <div
                            key={result.train.number}
                            className="train-card animate-fade-in"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="train-card-header">
                                <div>
                                    <div className="train-card-title">{result.train.name}</div>
                                    <div className="train-card-number">#{result.train.number} · {result.train.runningDays.join(', ')}</div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span
                                        className="badge"
                                        style={{
                                            background: `${categoryColor(result.train.category)}20`,
                                            color: categoryColor(result.train.category),
                                        }}
                                    >
                                        {result.train.category}
                                    </span>
                                    <button
                                        className={`fav-btn ${favorites.includes(result.train.number) ? 'active' : ''}`}
                                        onClick={() => toggleFavorite(result.train.number)}
                                        title="Save to favorites"
                                    >
                                        <Star size={16} fill={favorites.includes(result.train.number) ? 'currentColor' : 'none'} />
                                    </button>
                                    <button
                                        className={`chip ${compareList.find(r => r.train.number === result.train.number) ? 'active' : ''}`}
                                        onClick={() => toggleCompare(result)}
                                        style={{ fontSize: '11px', padding: '4px 10px' }}
                                    >
                                        {compareList.find(r => r.train.number === result.train.number) ? '✓ Added' : '+ Compare'}
                                    </button>
                                </div>
                            </div>

                            <div className="train-card-route">
                                <div className="train-card-station">
                                    <div className="time">{result.departureStop.departureTime}</div>
                                    <div className="station">{result.departureStop.stationName}</div>
                                    <div className="day">Day {result.departureStop.dayNumber}</div>
                                </div>

                                <div className="train-card-divider">
                                    <div className="duration">{formatDuration(result.duration)}</div>
                                    <div className="line" />
                                    <div className="stops">{formatDistance(result.distance)} · {result.train.stops.length - 2} stops</div>
                                </div>

                                <div className="train-card-station arrival">
                                    <div className="time">{result.arrivalStop.arrivalTime}</div>
                                    <div className="station">{result.arrivalStop.stationName}</div>
                                    <div className="day">Day {result.arrivalStop.dayNumber}</div>
                                </div>
                            </div>

                            <div className="train-card-fares">
                                {result.applicableFares.filter(f => f.available).map(fare => (
                                    <div key={fare.trainClass} className="fare-chip">
                                        <span className="class-name">{fare.trainClass}</span>
                                        <span className="price">{formatFare(fare.baseFare)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison Modal */}
                {showComparison && compareList.length > 0 && (
                    <div
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 1000, padding: '20px',
                        }}
                        onClick={() => setShowComparison(false)}
                    >
                        <div
                            className="glass-card"
                            style={{ maxWidth: '900px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Train Comparison</h2>
                                <button className="btn btn-ghost" onClick={() => setShowComparison(false)}>
                                    <X size={18} />
                                </button>
                            </div>

                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        {compareList.map(r => (
                                            <th key={r.train.number}>{r.train.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Train Number</td>
                                        {compareList.map(r => <td key={r.train.number}>#{r.train.number}</td>)}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Category</td>
                                        {compareList.map(r => <td key={r.train.number}>{r.train.category}</td>)}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Departure</td>
                                        {compareList.map(r => <td key={r.train.number}>{r.departureStop.departureTime}</td>)}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Arrival</td>
                                        {compareList.map(r => <td key={r.train.number}>{r.arrivalStop.arrivalTime}</td>)}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Duration</td>
                                        {compareList.map(r => <td key={r.train.number} style={{ color: 'var(--accent-cyan)' }}>{formatDuration(r.duration)}</td>)}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Distance</td>
                                        {compareList.map(r => <td key={r.train.number}>{formatDistance(r.distance)}</td>)}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Stops</td>
                                        {compareList.map(r => <td key={r.train.number}>{r.train.stops.length}</td>)}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Cheapest Fare</td>
                                        {compareList.map(r => (
                                            <td key={r.train.number} style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
                                                {formatFare(Math.min(...r.applicableFares.filter(f => f.available).map(f => f.baseFare)))}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Classes</td>
                                        {compareList.map(r => <td key={r.train.number}>{r.train.classes.join(', ')}</td>)}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Running Days</td>
                                        {compareList.map(r => <td key={r.train.number}>{r.train.runningDays.join(', ')}</td>)}
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 600 }}>Pantry</td>
                                        {compareList.map(r => (
                                            <td key={r.train.number}>
                                                {r.train.pantryAvailable ?
                                                    <span style={{ color: 'var(--accent-green)' }}>✓ Available</span> :
                                                    <span style={{ color: 'var(--text-muted)' }}>✗ No</span>}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="page-content"><div className="skeleton" style={{ height: '200px' }} /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}
