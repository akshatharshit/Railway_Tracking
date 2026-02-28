import { LiveTrainStatus, TrainStop } from '@/lib/types';
import { trains } from '@/data/trains';
import { timeToMinutes } from '@/lib/utils';

// Simulate live tracking for a train
export function simulateLiveStatus(trainNumber: string): LiveTrainStatus | null {
    const train = trains.find(t => t.number === trainNumber);
    if (!train) return null;

    // Use current time simulation (cycle through 24h schedule)
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Simulate a random delay between -5 and +45 min
    const seed = hashCode(trainNumber + now.toDateString());
    const delay = Math.floor((seededRandom(seed) * 50) - 5);

    // Find where the train is based on simulated time
    const adjustedMinutes = ((currentMinutes - delay % 60) + 1440) % 1440;

    let lastStopIdx = 0;
    let nextStopIdx = 1;
    let progress = 0;

    for (let i = 0; i < train.stops.length - 1; i++) {
        const depTime = train.stops[i].departureTime === '--'
            ? timeToMinutes(train.stops[i].arrivalTime)
            : timeToMinutes(train.stops[i].departureTime);
        const arrTime = timeToMinutes(train.stops[i + 1].arrivalTime);

        let adjustedArr = arrTime;
        if (train.stops[i + 1].dayNumber > train.stops[i].dayNumber) {
            adjustedArr += 1440;
        }

        if (adjustedMinutes >= depTime && adjustedMinutes <= adjustedArr) {
            lastStopIdx = i;
            nextStopIdx = i + 1;
            progress = (adjustedMinutes - depTime) / (adjustedArr - depTime);
            break;
        } else if (adjustedMinutes < depTime) {
            lastStopIdx = Math.max(0, i - 1);
            nextStopIdx = i;
            progress = 0;
            break;
        }
        lastStopIdx = i;
        nextStopIdx = Math.min(i + 1, train.stops.length - 1);
        progress = 1;
    }

    const lastStop = train.stops[lastStopIdx];
    const nextStop = train.stops[nextStopIdx];

    // Interpolate lat/lng (simplified)
    const { lat: lat1, lng: lng1 } = getStopCoordinates(lastStop.stationCode);
    const { lat: lat2, lng: lng2 } = getStopCoordinates(nextStop.stationCode);
    const currentLat = lat1 + (lat2 - lat1) * progress;
    const currentLng = lng1 + (lng2 - lng1) * progress;

    // Overall journey percentage
    const totalDist = train.totalDistance;
    const lastDist = lastStop.distanceFromSource;
    const nextDist = nextStop.distanceFromSource;
    const currentDist = lastDist + (nextDist - lastDist) * progress;
    const journeyCompleted = Math.round((currentDist / totalDist) * 100);

    // Speed
    const segmentDist = nextDist - lastDist;
    const segmentTimeHrs = ((nextStopIdx > lastStopIdx)
        ? (timeToMinutes(nextStop.arrivalTime) - timeToMinutes(lastStop.departureTime === '--' ? lastStop.arrivalTime : lastStop.departureTime) + (nextStop.dayNumber > lastStop.dayNumber ? 1440 : 0))
        : 60) / 60;
    const currentSpeed = segmentTimeHrs > 0 ? Math.round(segmentDist / segmentTimeHrs) : 0;

    const status: LiveTrainStatus['status'] =
        delay <= -2 ? 'early' :
            delay >= 5 ? 'delayed' :
                'on-time';

    const expectedArr = nextStop.arrivalTime;

    return {
        trainNumber: train.number,
        trainName: train.name,
        currentLat,
        currentLng,
        lastStation: lastStop,
        nextStation: nextStop,
        currentSpeed: Math.max(0, Math.min(180, currentSpeed + Math.floor(seededRandom(seed + 1) * 20 - 10))),
        delay: Math.max(-5, delay),
        expectedArrival: expectedArr,
        journeyCompleted: Math.max(0, Math.min(100, journeyCompleted)),
        lastUpdated: now.toISOString(),
        platformNumber: nextStop.platform,
        status,
    };
}

function getStopCoordinates(code: string): { lat: number; lng: number } {
    const coordMap: Record<string, { lat: number; lng: number }> = {
        NDLS: { lat: 28.6419, lng: 77.2193 },
        BCT: { lat: 18.9712, lng: 72.8194 },
        CSMT: { lat: 18.9402, lng: 72.8356 },
        HWH: { lat: 22.5839, lng: 88.3428 },
        MAS: { lat: 13.0827, lng: 80.2707 },
        SBC: { lat: 12.9784, lng: 77.5713 },
        SC: { lat: 17.4344, lng: 78.5013 },
        JP: { lat: 26.9194, lng: 75.7876 },
        ADI: { lat: 23.0225, lng: 72.5714 },
        LKO: { lat: 26.8295, lng: 80.9238 },
        CNB: { lat: 26.4612, lng: 80.3504 },
        PNBE: { lat: 25.6091, lng: 85.1349 },
        BPL: { lat: 23.2683, lng: 77.4124 },
        NGP: { lat: 21.1502, lng: 79.0882 },
        PUNE: { lat: 18.5285, lng: 73.8743 },
        AGC: { lat: 27.1631, lng: 78.0154 },
        GWL: { lat: 26.2124, lng: 78.1855 },
        BRC: { lat: 22.3101, lng: 73.1814 },
        ST: { lat: 21.2050, lng: 72.8418 },
        BBS: { lat: 20.2710, lng: 85.8398 },
        VSKP: { lat: 17.7216, lng: 83.2885 },
        TVC: { lat: 8.4892, lng: 76.9521 },
        ERS: { lat: 9.9684, lng: 76.2883 },
        CBE: { lat: 10.9964, lng: 76.9672 },
        BSB: { lat: 25.3228, lng: 83.0076 },
        ALD: { lat: 25.4300, lng: 81.8360 },
        MGS: { lat: 25.2800, lng: 83.1226 },
        DHN: { lat: 23.7910, lng: 86.4309 },
        GKP: { lat: 26.7468, lng: 83.3673 },
        GHY: { lat: 26.1870, lng: 91.7400 },
        DDN: { lat: 30.3228, lng: 78.0444 },
        KGP: { lat: 22.3316, lng: 87.3124 },
        NZM: { lat: 28.5895, lng: 77.2510 },
        LTT: { lat: 19.0685, lng: 72.8891 },
        AJJ: { lat: 13.0785, lng: 79.6661 },
        UMB: { lat: 30.3745, lng: 76.8139 },
        ITJ: { lat: 22.6150, lng: 77.7652 },
        KYN: { lat: 19.2437, lng: 73.1355 },
        CDG: { lat: 30.6935, lng: 76.8083 },
        JAT: { lat: 32.7332, lng: 74.8719 },
        TPTY: { lat: 13.6335, lng: 79.4190 },
        RNC: { lat: 23.3489, lng: 85.3213 },
        MDU: { lat: 9.9209, lng: 78.1189 },
    };
    return coordMap[code] || { lat: 22.0, lng: 78.0 };
}

function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Get all trains for dropdown selection
export function getAllTrainsForLiveStatus(): Array<{ number: string; name: string; from: string; to: string }> {
    return trains.map(t => ({
        number: t.number,
        name: t.name,
        from: t.stops[0].stationName,
        to: t.stops[t.stops.length - 1].stationName,
    }));
}
