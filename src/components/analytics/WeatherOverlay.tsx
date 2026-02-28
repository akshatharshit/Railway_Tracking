'use client';

// ═══════════════════════════════════════════════
// Weather Overlay Component
// ═══════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { getStationWeather, WeatherData } from '@/lib/api/weather';
import { stations } from '@/data/stations';
import { getSeasonalAdvice } from '@/lib/analytics/weather-optimizer';

interface WeatherOverlayProps {
    stationCodes?: string[];
    compact?: boolean;
}

export function WeatherOverlay({ stationCodes, compact = false }: WeatherOverlayProps) {
    const [weatherMap, setWeatherMap] = useState<Map<string, WeatherData>>(new Map());
    const [loading, setLoading] = useState(true);

    const targetStations = stationCodes
        ? stations.filter(s => stationCodes.includes(s.code))
        : stations.filter(s => s.isJunction).slice(0, 8);

    useEffect(() => {
        async function fetchWeather() {
            setLoading(true);
            const results = new Map<string, WeatherData>();

            await Promise.all(
                targetStations.map(async (station) => {
                    const response = await getStationWeather(station.lat, station.lng, station.code);
                    if (response.data) {
                        results.set(station.code, response.data);
                    }
                })
            );

            setWeatherMap(results);
            setLoading(false);
        }

        fetchWeather();
    }, [stationCodes?.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

    const month = new Date().getMonth() + 1;
    const seasonalAdvice = getSeasonalAdvice(month);

    const getRiskBadgeClass = (risk: string) => {
        return `risk-badge risk-${risk}`;
    };

    if (loading) {
        return (
            <div className="analytics-card weather-overlay">
                <div className="analytics-card-header">
                    <h3>🌤️ Weather Overlay</h3>
                </div>
                <div className="weather-loading">
                    <div className="pulse-loader" />
                    <p>Fetching weather data...</p>
                </div>
            </div>
        );
    }

    if (compact) {
        return (
            <div className="weather-compact">
                {targetStations.map(station => {
                    const weather = weatherMap.get(station.code);
                    if (!weather) return null;
                    return (
                        <div key={station.code} className="weather-compact-item">
                            <span className="weather-icon">{weather.icon}</span>
                            <span className="weather-station">{station.code}</span>
                            <span className="weather-temp">{weather.temperature}°</span>
                            <span className={getRiskBadgeClass(weather.riskLevel)}>
                                {weather.riskLevel}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="analytics-card weather-overlay">
            <div className="analytics-card-header">
                <div>
                    <h3>🌤️ Station Weather</h3>
                    <p className="analytics-subtitle">{seasonalAdvice.season} — {seasonalAdvice.generalAdvice}</p>
                </div>
            </div>

            <div className="weather-grid">
                {targetStations.map(station => {
                    const weather = weatherMap.get(station.code);
                    if (!weather) return null;
                    return (
                        <div key={station.code} className={`weather-card risk-border-${weather.riskLevel}`}>
                            <div className="weather-card-header">
                                <span className="weather-icon-lg">{weather.icon}</span>
                                <div>
                                    <div className="weather-station-name">{station.name}</div>
                                    <div className="weather-station-code">{station.code}</div>
                                </div>
                            </div>
                            <div className="weather-details">
                                <div className="weather-temp-main">{weather.temperature}°C</div>
                                <div className="weather-desc">{weather.description}</div>
                                <div className="weather-meta">
                                    <span>💧 {weather.humidity}%</span>
                                    <span>💨 {weather.windSpeed} km/h</span>
                                    <span>👁️ {weather.visibility} km</span>
                                </div>
                            </div>
                            <div className={getRiskBadgeClass(weather.riskLevel)}>
                                {weather.riskLevel === 'high' ? '⚠️ ' : ''}
                                {weather.riskLevel.toUpperCase()} RISK
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Seasonal advice */}
            <div className="seasonal-advice">
                <h4>📋 Regional Outlook</h4>
                <div className="region-list">
                    {seasonalAdvice.affectedRegions.map((region, i) => (
                        <div key={i} className="region-item">
                            <span className={`region-risk risk-text-${region.risk.toLowerCase().replace('-', '')}`}>
                                {region.risk}
                            </span>
                            <div>
                                <span className="region-name">{region.region}</span>
                                <span className="region-detail">{region.detail}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
