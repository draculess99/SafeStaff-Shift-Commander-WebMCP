import React from 'react';
import { UserMinus, Flame, Sparkles, ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function ScenarioControl({ isCalloutActive, onToggleCallout }) {
  return (
    <section className="glass-panel" style={{
      padding: '1.25rem 1.5rem',
      borderLeft: isCalloutActive ? '4px solid var(--amber-500)' : '4px solid var(--cyan-500)',
      background: isCalloutActive ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, var(--bg-surface) 100%)' : 'var(--bg-surface)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
        
        {/* Left Info */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: '1 1 450px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isCalloutActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.15)',
            border: isCalloutActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            <UserMinus size={20} color={isCalloutActive ? 'var(--amber-400)' : 'var(--cyan-400)'} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                Scenario Stress-Testing: Model Nurse Call-Out
              </h3>
              {isCalloutActive ? (
                <span className="badge badge-amber">
                  <AlertCircle size={11} /> Unplanned Call-Out Active (-1 RN)
                </span>
              ) : (
                <span className="badge badge-slate">
                  Baseline (No Call-Outs)
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Simulate the operational impact when an active floor nurse (Pod B) calls out mid-shift.
              When enabled, roster drops to <strong>6 RNs</strong> and forecast wait surges to <strong>118 min</strong>.
            </p>

            {/* Impact Metric Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                padding: '0.25rem 0.625rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Staffing Delta:</span>
                <span className="font-mono" style={{ fontWeight: '700', color: isCalloutActive ? 'var(--amber-400)' : 'var(--emerald-400)' }}>
                  {isCalloutActive ? '7 RNs → 6 RNs (-14%)' : '7 RNs (Standard Baseline)'}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                padding: '0.25rem 0.625rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Predicted Wait Delta:</span>
                <span className="font-mono" style={{ fontWeight: '700', color: isCalloutActive ? 'var(--rose-400)' : 'var(--cyan-400)' }}>
                  {isCalloutActive ? '96 min → 118 min (+22m Surge)' : '96 min (+36m above 60m target)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none',
            padding: '0.5rem 1rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: '10px',
            border: isCalloutActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              position: 'relative',
              width: '48px',
              height: '26px',
              background: isCalloutActive ? 'var(--amber-500)' : '#1e2942',
              borderRadius: '13px',
              transition: 'background-color 0.2s ease'
            }}>
              <div style={{
                position: 'absolute',
                top: '3px',
                left: isCalloutActive ? '25px' : '3px',
                width: '20px',
                height: '20px',
                background: '#ffffff',
                borderRadius: '50%',
                transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
              }} />
            </div>

            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: isCalloutActive ? 'var(--amber-400)' : 'var(--text-primary)' }}>
              {isCalloutActive ? 'Call-Out Mode: ON' : 'Model Nurse Call-Out'}
            </div>
            
            <input
              type="checkbox"
              checked={isCalloutActive}
              onChange={e => onToggleCallout(e.target.checked)}
              style={{ display: 'none' }}
              aria-label="Model nurse call-out scenario toggle"
            />
          </label>
        </div>

      </div>
    </section>
  );
}
