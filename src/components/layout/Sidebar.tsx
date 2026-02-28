'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard, Search, Radio, Armchair, Route, Menu, X, Train,
    TicketCheck, BarChart3
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
    { href: '/search', label: 'Train Search', icon: Search, section: 'Modules' },
    { href: '/live-status', label: 'Live Status', icon: Radio, section: 'Modules' },
    { href: '/availability', label: 'Seat Availability', icon: Armchair, section: 'Modules' },
    { href: '/route-optimizer', label: 'Route Optimizer', icon: Route, section: 'Modules' },
    { href: '/pnr', label: 'PNR Status', icon: TicketCheck, section: 'Modules' },
    { href: '/analytics', label: 'Analytics Hub', icon: BarChart3, section: 'Intelligence' },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const sections = [...new Set(navItems.map(i => i.section))];

    return (
        <>
            <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isOpen && (
                <div className="sidebar-overlay active" onClick={() => setIsOpen(false)} />
            )}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="flex items-center gap-2">
                        <Train size={22} style={{ color: '#3b82f6' }} />
                        <h1>RailIntel</h1>
                    </div>
                    <p>Intelligence Platform</p>
                </div>

                <nav className="sidebar-nav">
                    {sections.map(section => (
                        <div key={section}>
                            <div className="nav-section-title">{section}</div>
                            {navItems
                                .filter(i => i.section === section)
                                .map(item => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`nav-link ${isActive ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="nav-icon">
                                                <item.icon size={18} />
                                            </span>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                        </div>
                    ))}
                </nav>

                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        v2.0.0 — Simulation Mode
                    </div>
                </div>
            </aside>
        </>
    );
}
