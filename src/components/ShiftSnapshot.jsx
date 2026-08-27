import React from 'react';
import { Users, AlertOctagon, UserMinus, UserCheck, Clock, Target, ArrowUpRight, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ShiftSnapshot({
  waitingPatients,
  highAcuityArrivals,
  availableNurses,
  forecastWaitMinutes,
  safeTargetMinutes,
  isCalloutActive
}) {
  const waitVariance = forecastWaitMinutes - safeTargetMinutes;
  const isWaitBreached = waitVariance > 0;
  const ratio = (waitingPatients / availableNurses).toFixed(1);

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Emergency Department Shift Snapshot
          </h2>
          <span className="badge badge-slate">Real-Time Telemetry</span>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Target Safe Operational Ceiling: <strong style={{ color: 'var(--emerald-400)' }}>{safeTargetMinutes} min</strong>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>

        {/* 1. Waiting Patients */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              WAITING PATIENTS
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={18} color="var(--cyan-400)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="font-mono" style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', lineHeight: 1 }}>
              {waitingPatients}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>in queue</span>
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--cyan-400)', fontWeight: '600' }}>{ratio}:1</span> Patient-to-Nurse Load
          </div>
        </div>

        {/* 2. High-Acuity Arrivals */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15), transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              HIGH-ACUITY ARRIVALS
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertOctagon size={18} color="var(--rose-400)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="font-mono glow-rose" style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--rose-400)', lineHeight: 1 }}>
              {highAcuityArrivals}
            </span>
            <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>ESI 1-2 Resus</span>
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--rose-400)' }}>
            <AlertTriangle size={12} /> Requires 1:1 / 1:2 RN Dedication
          </div>
        </div>

        {/* 3. Available Nurses */}
        <div className="glass-panel" style={{
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          borderColor: isCalloutActive ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isCalloutActive ? 'radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent 70%)' : 'radial-gradient(circle, rgba(16, 185, 129, 0.15), transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              AVAILABLE NURSES
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isCalloutActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isCalloutActive ? (
                <UserMinus size={18} color="var(--amber-400)" />
              ) : (
                <UserCheck size={18} color="var(--emerald-400)" />
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="font-mono" style={{
              fontSize: '2.25rem',
              fontWeight: '800',
              color: isCalloutActive ? 'var(--amber-400)' : '#ffffff',
              lineHeight: 1
            }}>
              {availableNurses}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>active on floor</span>
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem' }}>
            {isCalloutActive ? (
              <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                -1 Call-Out Active (Base: 7)
              </span>
            ) : (
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                Full Shift Roster (7 RNs)
              </span>
            )}
          </div>
        </div>

        {/* 4. Forecast Wait Time vs Safe Target */}
        <div className="glass-panel" style={{
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          borderColor: isWaitBreached ? 'rgba(245, 158, 11, 0.5)' : 'var(--border-subtle)',
          boxShadow: isWaitBreached ? '0 0 15px rgba(245, 158, 11, 0.15)' : 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              FORECAST WAIT TIME
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isWaitBreached ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={18} color={isWaitBreached ? 'var(--amber-400)' : 'var(--cyan-400)'} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="font-mono glow-amber" style={{
              fontSize: '2.25rem',
              fontWeight: '800',
              color: isWaitBreached ? 'var(--amber-400)' : 'var(--cyan-400)',
              lineHeight: 1
            }}>
              {forecastWaitMinutes}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>min</span>
            <span className={isWaitBreached ? 'badge badge-amber' : 'badge badge-emerald'} style={{ fontSize: '0.68rem', marginLeft: 'auto' }}>
              +{waitVariance}m vs Target
            </span>
          </div>
          
          {/* Target Progress Bar */}
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Safe Target: {safeTargetMinutes}m</span>
              <span>{Math.round((safeTargetMinutes / forecastWaitMinutes) * 100)}% of ceiling</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, (forecastWaitMinutes / 120) * 100)}%`,
                height: '100%',
                background: forecastWaitMinutes > 100 ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : 'linear-gradient(90deg, #06b6d4, #f59e0b)',
                borderRadius: '3px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
