/**
 * Synthetic ED Operations Simulation Engine
 * 
 * Generates deterministic, realistic ED shift data without PHI.
 */

export const BASELINE_STATE = {
  shiftId: 'SHIFT-ED-2026-N02',
  department: 'Main Emergency Department (Level 1 Trauma)',
  chargeNurse: 'Jordan Miller, RN, BSN (CEN)',
  shiftType: 'Night Shift (19:00 - 07:00)',
  waitingPatients: 42,
  highAcuityArrivals: 3, // ESI 1 (Immediate) & ESI 2 (Emergent)
  availableNurses: 7,
  forecastWaitTimeMinutes: 96,
  safeTargetMinutes: 60,
  breakdown: {
    esi1_resus: 1,      // Immediate resuscitation
    esi2_emergent: 2,   // High acuity / cardiac / stroke alert
    esi3_urgent: 19,    // Moderate / multi-resource
    esi4_lessUrgent: 14,// Single resource
    esi5_nonUrgent: 6   // Fast track
  },
  bedOccupancyPercent: 88,
  totalBeds: 32,
  occupiedBeds: 28,
  onCallAvailable: 2
};

export const CALLOUT_STATE = {
  ...BASELINE_STATE,
  availableNurses: 6,
  forecastWaitTimeMinutes: 118,
  nurseCalloutActive: true,
  calloutNurseName: 'Alex Rivera, RN (Assigned Pod B)',
  calloutReason: 'Acute Illness / Unplanned Absence',
  calloutTimestamp: '21:14 EST'
};

export const STAFFING_OPTIONS = [
  {
    id: 'protect-high-acuity',
    title: 'Protect High-Acuity Flow',
    badge: 'Recommended by Policy',
    category: 'Acuity Ring-Fencing',
    predictedWaitMinutes: 104,
    highAcuityBufferRatio: '1:1.5',
    riskLevel: 'Moderate',
    riskColor: 'amber',
    costImpact: '$0 (Internal Rebalance)',
    description: 'Prioritizes dedicated 1:1 and 1:2 coverage for ESI 1-2 resuscitation and critical care pods. Non-urgent (ESI 4-5) queue wait extends slightly to preserve emergency surge readiness.',
    allocations: [
      { pod: 'Resus / Trauma Pod A', nurses: 3, acuity: 'ESI 1-2' },
      { pod: 'Urgent Care Pod B', nurses: 2, acuity: 'ESI 3' },
      { pod: 'Fast Track / Triage Pod C', nurses: 1, acuity: 'ESI 4-5' }
    ],
    pros: [
      'Guarantees zero delay for life-threatening arrivals',
      'Complies with ENA critical care staffing ratios',
      'No overtime or float pool expense'
    ],
    cons: [
      'Fast-track / ESI-4 wait time increases by ~15 mins'
    ]
  },
  {
    id: 'call-in-contingency',
    title: 'Call-In Contingency',
    badge: 'Fastest Wait Reduction',
    category: 'Float Pool Dispatch',
    predictedWaitMinutes: 68,
    highAcuityBufferRatio: '1:1.0',
    riskLevel: 'Low',
    riskColor: 'cyan',
    costImpact: '+$450 (4hr float shift premium)',
    description: 'Activates on-call ED Float Pool Registered Nurse (45-min transit time). Restores nurse count to 7, bringing department wait time within 8 minutes of the 60-minute safe operational threshold.',
    allocations: [
      { pod: 'Resus / Trauma Pod A', nurses: 3, acuity: 'ESI 1-2' },
      { pod: 'Urgent Care Pod B', nurses: 3, acuity: 'ESI 3' },
      { pod: 'Fast Track / Triage Pod C', nurses: 1, acuity: 'ESI 4-5' }
    ],
    pros: [
      'Reduces overall ED wait time by 50 minutes (118m -> 68m)',
      'Relieves charge nurse from floor triage pressure',
      'Prevents Left Without Being Seen (LWBS) rate spike'
    ],
    cons: [
      'Incurs contingency float pool differential expenditure',
      'Requires ~45 minutes lead time for nurse arrival'
    ]
  },
  {
    id: 'hold-and-monitor',
    title: 'Hold and Monitor',
    badge: 'Baseline Resource Conservation',
    category: 'Passive Observation',
    predictedWaitMinutes: 118,
    highAcuityBufferRatio: '1:2.8',
    riskLevel: 'High',
    riskColor: 'rose',
    costImpact: '$0',
    description: 'Maintains current 6-nurse configuration without reallocating pods or calling in reserves. Sets a 30-minute re-evaluation trigger if census exceeds 45 or new high-acuity arrivals breach capacity.',
    allocations: [
      { pod: 'Resus / Trauma Pod A', nurses: 2, acuity: 'ESI 1-2' },
      { pod: 'Urgent Care Pod B', nurses: 3, acuity: 'ESI 3' },
      { pod: 'Fast Track / Triage Pod C', nurses: 1, acuity: 'ESI 4-5' }
    ],
    pros: [
      'Preserves float pool hours for peak midnight surge',
      'Minimal communication overhead'
    ],
    cons: [
      'Forecast wait time remains at 118 min (58 min above safe target)',
      'Critical pods operate at maximum safety margin capacity',
      'Elevated risk of LWBS and nurse fatigue'
    ]
  }
];

export function calculateForecast(waitingPatients, highAcuity, availableNurses) {
  if (availableNurses <= 0) return 999;
  // Synthetic wait time model: base formula with high-acuity multiplier
  const baseMinutes = (waitingPatients / availableNurses) * 14;
  const acuityPenalty = highAcuity * 5.5;
  return Math.round(baseMinutes + acuityPenalty);
}
