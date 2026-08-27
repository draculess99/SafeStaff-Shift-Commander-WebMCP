import React from 'react';
import { Activity, ShieldAlert, Users, Layers } from 'lucide-react';

export default function AcuityDistribution({ breakdown }) {
  const levels = [
    { label: 'ESI 1: Resuscitation', count: breakdown.esi1_resus, color: '#f43f5e', ratio: '1:1 RN', desc: 'Immediate life-threat (Trauma/Cardiac Arrest)' },
    { label: 'ESI 2: Emergent', count: breakdown.esi2_emergent, color: '#fb923c', ratio: '1:2 RN', desc: 'High risk, severe pain, altered mental status' },
    { label: 'ESI 3: Urgent', count: breakdown.esi3_urgent, color: '#facc15', ratio: '1:4 RN', desc: 'Multi-resource (Labs + Imaging + IV)' },
    { label: 'ESI 4: Less Urgent', count: breakdown.esi4_lessUrgent, color: '#38bdf8', ratio: '1:5 RN', desc: 'Single diagnostic resource' },
    { label: 'ESI 5: Non-Urgent', count: breakdown.esi5_nonUrgent, color: '#4ade80', ratio: '1:6 RN', desc: 'Fast Track (Prescription refill / sutures)' }
  ];

  const total = Object.values(breakdown).reduce((acc, c) => acc + c, 0);

  return (
    <section className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Layers size={18} color="var(--cyan-400)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Emergency Severity Index (ESI) Triage Census Breakdown
          </h2>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Total Waiting Census: <strong style={{ color: '#ffffff' }}>{total} Patients</strong>
        </div>
      </div>

      {/* Stacked Census Progress Bar */}
      <div style={{ height: '10px', width: '100%', borderRadius: '5px', overflow: 'hidden', display: 'flex', marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.05)' }}>
        {levels.map((lvl, i) => (
          <div
            key={i}
            style={{
              width: `${(lvl.count / total) * 100}%`,
              background: lvl.color,
              height: '100%',
              transition: 'width 0.3s ease'
            }}
            title={`${lvl.label}: ${lvl.count} pts`}
          />
        ))}
      </div>

      {/* Grid of ESI categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
        {levels.map((lvl, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.75rem',
              borderLeft: `4px solid ${lvl.color}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff' }}>
                {lvl.label.split(':')[0]}
              </span>
              <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: '800', color: lvl.color }}>
                {lvl.count}
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Standard: {lvl.ratio}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.3' }}>
              {lvl.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
