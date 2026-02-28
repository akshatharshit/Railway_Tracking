// ═══════════════════════════════════════════════
// Transfer Risk Scorer
// ═══════════════════════════════════════════════

export interface TransferRisk {
    fromTrain: string;
    toTrain: string;
    station: string;
    bufferMinutes: number;
    riskScore: number;           // 0-100 (higher = riskier)
    riskLevel: 'safe' | 'moderate' | 'risky' | 'dangerous';
    recommendation: string;
    factors: TransferFactor[];
}

export interface TransferFactor {
    name: string;
    impact: number;     // 0-1
    description: string;
}

export function assessTransferRisk(params: {
    bufferMinutes: number;
    incomingDelayProbability: number;   // 0-1
    platformDistance?: number;           // platforms apart
    isJunctionStation?: boolean;
    timeOfDay?: number;                  // hour 0-23
    isSameGauge?: boolean;
}): TransferRisk {
    const {
        bufferMinutes,
        incomingDelayProbability,
        platformDistance = 2,
        isJunctionStation = false,
        timeOfDay = 12,
        isSameGauge = true,
    } = params;

    const factors: TransferFactor[] = [];
    let riskScore = 0;

    // Buffer time factor (most important)
    const bufferRisk = bufferMinutes < 10 ? 40 :
        bufferMinutes < 20 ? 30 :
            bufferMinutes < 30 ? 20 :
                bufferMinutes < 45 ? 10 :
                    bufferMinutes < 60 ? 5 : 2;
    riskScore += bufferRisk;
    factors.push({
        name: 'Buffer Time',
        impact: bufferRisk / 40,
        description: `${bufferMinutes} min buffer — ${bufferMinutes < 20 ? 'very tight' : bufferMinutes < 40 ? 'moderate' : 'comfortable'}`,
    });

    // Incoming delay probability
    const delayRisk = Math.round(incomingDelayProbability * 30);
    riskScore += delayRisk;
    factors.push({
        name: 'Incoming Delay Risk',
        impact: incomingDelayProbability,
        description: `${Math.round(incomingDelayProbability * 100)}% chance of incoming train being delayed`,
    });

    // Platform distance
    const platformRisk = Math.min(15, platformDistance * 3);
    riskScore += platformRisk;
    factors.push({
        name: 'Platform Distance',
        impact: platformRisk / 15,
        description: `${platformDistance} platforms apart — ${platformDistance > 3 ? 'long walk' : 'short walk'} with luggage`,
    });

    // Junction station bonus (more platforms, more exits)
    if (isJunctionStation) {
        riskScore += 5;
        factors.push({
            name: 'Junction Station',
            impact: 0.3,
            description: 'Busy junction — higher foot traffic and potential confusion',
        });
    }

    // Time of day (night transfers are harder)
    const nightPenalty = (timeOfDay >= 22 || timeOfDay < 5) ? 10 : 0;
    riskScore += nightPenalty;
    if (nightPenalty > 0) {
        factors.push({
            name: 'Night Transfer',
            impact: 0.5,
            description: 'Late night/early morning — reduced station services',
        });
    }

    // Gauge change
    if (!isSameGauge) {
        riskScore += 5;
        factors.push({
            name: 'Gauge Change',
            impact: 0.3,
            description: 'Different gauge — must change platforms',
        });
    }

    riskScore = Math.min(100, Math.max(0, riskScore));

    const riskLevel: TransferRisk['riskLevel'] =
        riskScore < 20 ? 'safe' :
            riskScore < 45 ? 'moderate' :
                riskScore < 70 ? 'risky' : 'dangerous';

    let recommendation: string;
    if (riskScore < 20) {
        recommendation = 'Transfer looks comfortable. Proceed with confidence.';
    } else if (riskScore < 45) {
        recommendation = 'Manageable transfer. Keep an eye on incoming train delays.';
    } else if (riskScore < 70) {
        recommendation = 'Risky transfer. Consider a route with a longer buffer or direct train.';
    } else {
        recommendation = 'Very risky. Strongly recommend finding an alternative route or staying overnight.';
    }

    return {
        fromTrain: '',
        toTrain: '',
        station: '',
        bufferMinutes,
        riskScore,
        riskLevel,
        recommendation,
        factors,
    };
}
