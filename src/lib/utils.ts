export function formatDuration(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
}

export function formatTime(time: string): string {
    if (time === '--') return '--';
    return time;
}

export function formatDistance(km: number): string {
    return `${km.toLocaleString()} km`;
}

export function formatFare(amount: number): string {
    return `₹${amount.toLocaleString()}`;
}

export function timeToMinutes(time: string): number {
    if (time === '--') return 0;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
    const h = Math.floor((minutes % 1440) / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function calculateDuration(dep: string, arr: string, dayDiff: number): number {
    const depMin = timeToMinutes(dep);
    const arrMin = timeToMinutes(arr);
    return arrMin - depMin + dayDiff * 1440;
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}

export function classLabel(cls: string): string {
    const labels: Record<string, string> = {
        '1AC': 'First AC',
        '2AC': 'Second AC',
        '3AC': 'Third AC',
        'SL': 'Sleeper',
        'CC': 'Chair Car',
        'EC': 'Exec. Chair',
        '2S': 'Second Sitting',
        'GN': 'General',
    };
    return labels[cls] || cls;
}

export function categoryColor(category: string): string {
    const colors: Record<string, string> = {
        'Rajdhani': '#f59e0b',
        'Shatabdi': '#10b981',
        'Duronto': '#8b5cf6',
        'Superfast': '#0ea5a4',
        'Express': '#6366f1',
        'Mail': '#ec4899',
        'Garib Rath': '#14b8a6',
        'Humsafar': '#f97316',
        'Tejas': '#06b6d4',
        'Vande Bharat': '#ef4444',
    };
    return colors[category] || '#64748b';
}

export function statusColor(status: string): string {
    const colors: Record<string, string> = {
        'on-time': '#10b981',
        'delayed': '#ef4444',
        'early': '#0ea5a4',
        'cancelled': '#6b7280',
        'not-started': '#f59e0b',
    };
    return colors[status] || '#64748b';
}

export function availabilityColor(status: string): string {
    const colors: Record<string, string> = {
        'AVL': '#10b981',
        'RAC': '#f59e0b',
        'WL': '#ef4444',
        'REGRET': '#6b7280',
        'GNWL': '#f97316',
        'PQWL': '#ec4899',
    };
    return colors[status] || '#64748b';
}

export function getDayName(date: string): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const d = new Date(date);
    return days[d.getDay()];
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}
