'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Radio, Armchair, Route, TrendingUp, Train, MapPin, Clock,
  ArrowRight, Zap, IndianRupee, Timer
} from 'lucide-react';
import { trains } from '@/data/trains';
import { stations } from '@/data/stations';
import { getPopularRoutes } from '@/lib/search-engine';

export default function DashboardPage() {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const popularRoutes = getPopularRoutes();

  const stats = [
    { label: 'Active Trains', value: trains.length, icon: Train, color: '#0ea5a4', bg: 'rgba(14,165,164,0.12)', change: 12 },
    { label: 'Stations Covered', value: stations.length, icon: MapPin, color: '#10b981', bg: 'rgba(16,185,129,0.15)', change: 5 },
    { label: 'Avg Speed', value: `${Math.round(trains.reduce((s, t) => s + t.avgSpeed, 0) / trains.length)} km/h`, icon: Zap, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', change: 3 },
    { label: 'Network Coverage', value: `${Math.round(trains.reduce((s, t) => s + t.totalDistance, 0)).toLocaleString()} km`, icon: Route, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', change: 8 },
  ];

  const quickActions = [
    { href: '/search', icon: Search, title: 'Search Trains', desc: 'Find trains between any two stations', gradient: 'linear-gradient(135deg, #0ea5a4, #06b6d4)' },
    { href: '/live-status', icon: Radio, title: 'Live Tracking', desc: 'Real-time train running status', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { href: '/availability', icon: Armchair, title: 'Seat Check', desc: 'Check availability & coach layout', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { href: '/route-optimizer', icon: Route, title: 'Optimize Route', desc: 'Find the best route for your trip', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  ];

  const recentTrains = trains.slice(0, 6);

  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Dashboard</h1>
            <p>Railway Intelligence Overview</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--accent-cyan)' }}>
              {clock}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Indian Standard Time
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="grid-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="stat-icon" style={{ background: stat.bg }}>
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
                <div className={`stat-change positive`}>
                  <TrendingUp size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  +{stat.change}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>
          Quick Actions
        </h2>
        <div className="grid-4 mb-6">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} style={{ textDecoration: 'none' }}>
              <div
                className="glass-card animate-fade-in"
                style={{
                  animationDelay: `${(i + 4) * 80}ms`,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: action.gradient, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
                  }}
                >
                  <action.icon size={22} color="white" />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{action.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid-2">
          {/* Popular Routes */}
          <div className="glass-card">
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
              Popular Routes
            </h3>
            <div className="flex-col gap-2">
              {popularRoutes.map((route, i) => (
                <Link
                  key={i}
                  href={`/search?from=${route.from}&to=${route.to}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="flex items-center justify-between"
                    style={{
                      padding: '10px 12px', borderRadius: '8px',
                      background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-blue)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glass)';
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {route.fromName}
                      </div>
                      <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {route.toName}
                      </div>
                    </div>
                    <span className="badge badge-blue">{route.trainCount} trains</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Trains */}
          <div className="glass-card">
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
              Featured Trains
            </h3>
            <div className="flex-col gap-2">
              {recentTrains.map((train, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between"
                  style={{
                    padding: '10px 12px', borderRadius: '8px',
                    background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{train.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      #{train.number} · {train.stops[0].stationName} → {train.stops[train.stops.length - 1].stationName}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="badge" style={{
                      background: `${categoryColorMap(train.category)}20`,
                      color: categoryColorMap(train.category),
                    }}>
                      {train.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="glass-card mt-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>All systems operational</span>
          </div>
          <div className="flex gap-4">
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              <Timer size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Last updated: Just now
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              <IndianRupee size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Simulation mode — no real transactions
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function categoryColorMap(cat: string): string {
  const colors: Record<string, string> = {
    'Rajdhani': '#f59e0b', 'Shatabdi': '#10b981', 'Duronto': '#8b5cf6',
    'Superfast': '#0ea5a4', 'Express': '#6366f1', 'Mail': '#ec4899',
    'Vande Bharat': '#ef4444', 'Garib Rath': '#14b8a6', 'Tejas': '#06b6d4',
  };
  return colors[cat] || '#64748b';
}
