import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, ShieldAlert, Cpu, Clock, UserCheck } from 'lucide-react';

export default function Header({ webmcpReady, toolCount, isCalloutActive }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="glass-panel" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Title and Hospital Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(14, 165, 233, 0.05))',
            border: '1px solid var(--cyan-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--cyan-glow)'
          }}>
            <Activity size={24} color="var(--cyan-400)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
                SafeStaff <span style={{ color: 'var(--cyan-400)' }}>Shift Commander</span>
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                WebMCP • Local Demo Adapter
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
              <span>Level 1 Trauma Emergency Department</span>
              <span>•</span>
              <span>Night Shift (19:00 - 07:00)</span>
            </p>
          </div>
        </div>

        {/* Live Ops Badges & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Live Clock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.75rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <Clock size={15} color="var(--cyan-400)" />
            <span className="font-mono" style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {formattedTime} EST
            </span>
            <div className={isCalloutActive ? 'pulse-dot-amber' : 'pulse-dot'} title="Live telemetry active" />
          </div>

          {/* Charge Nurse On-Duty */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.75rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <UserCheck size={16} color="var(--emerald-400)" />
            <div style={{ fontSize: '0.75rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', lineHeight: 1 }}>CHARGE NURSE</div>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>J. Miller, RN, BSN</div>
            </div>
          </div>

          {/* WebMCP Tool Registry Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.75rem',
            background: 'rgba(6, 182, 212, 0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(6, 182, 212, 0.25)'
          }}>
            <Cpu size={16} color="var(--cyan-400)" />
            <div style={{ fontSize: '0.75rem' }}>
              <div style={{ color: 'var(--cyan-400)', fontSize: '0.68rem', fontWeight: '700' }}>WebMCP (DEMO ADAPTER)</div>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="font-mono">{toolCount}</span> Tools Registered
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
