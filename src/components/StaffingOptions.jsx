import React from 'react';
import { Shield, PhoneCall, PauseCircle, CheckCircle, Clock, DollarSign, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { STAFFING_OPTIONS } from '../services/simulationEngine';

export default function StaffingOptions({ selectedOptionId, onSelectOption, isCalloutActive }) {
  const getIcon = (id) => {
    switch (id) {
      case 'protect-high-acuity':
        return <Shield size={20} color="var(--amber-400)" />;
      case 'call-in-contingency':
        return <PhoneCall size={20} color="var(--cyan-400)" />;
      case 'hold-and-monitor':
        return <PauseCircle size={20} color="var(--rose-400)" />;
      default:
        return <Shield size={20} />;
    }
  };

  const getRiskBadge = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return <span className="badge badge-emerald">Low Clinical Risk</span>;
      case 'moderate':
        return <span className="badge badge-amber">Moderate Risk</span>;
      case 'high':
        return <span className="badge badge-rose">High Clinical Risk</span>;
      default:
        return <span className="badge badge-slate">{level}</span>;
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Selectable Staffing Action Plans
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Select one of the three mitigation models to review tactical allocation before human signoff.
          </p>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>
          WebMCP: generate_staffing_options
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {STAFFING_OPTIONS.map((option) => {
          const isSelected = selectedOptionId === option.id;
          
          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--cyan-400)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 25px rgba(6, 182, 212, 0.25)' : 'var(--shadow-card)',
                background: isSelected ? 'linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, var(--bg-surface) 100%)' : 'var(--bg-surface)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Top Row: Icon + Title + Selected Radio */}
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-surface-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {getIcon(option.id)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: isSelected ? 'var(--cyan-400)' : '#ffffff' }}>
                        {option.title}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {option.category}
                      </div>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid var(--cyan-400)' : '2px solid #334155',
                    background: isSelected ? 'var(--cyan-500)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <Check size={14} color="#000000" strokeWidth={3} />}
                  </div>
                </div>

                {/* Badge Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                  {getRiskBadge(option.riskLevel)}
                  <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                    <DollarSign size={10} /> {option.costImpact}
                  </span>
                  {option.id === 'protect-high-acuity' && (
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                      Primary Rec
                    </span>
                  )}
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.45' }}>
                  {option.description}
                </p>

                {/* Pod Allocation Matrix */}
                <div style={{
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Shift Pod Allocations
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {option.allocations.map((alloc, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{alloc.pod}</span>
                        <span className="font-mono" style={{ fontWeight: '600', color: 'var(--cyan-400)' }}>
                          {alloc.nurses} RN ({alloc.acuity})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '600', color: 'var(--emerald-400)', marginBottom: '0.25rem' }}>Pros:</div>
                  <ul style={{ paddingLeft: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {option.pros.map((p, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{p}</li>
                    ))}
                  </ul>
                  <div style={{ fontWeight: '600', color: 'var(--rose-400)', marginBottom: '0.25rem' }}>Trade-off:</div>
                  <ul style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                    {option.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Metric: Predicted Wait */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Predicted Wait:
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span className="font-mono" style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    color: option.predictedWaitMinutes <= 70 ? 'var(--emerald-400)' : option.predictedWaitMinutes <= 105 ? 'var(--amber-400)' : 'var(--rose-400)'
                  }}>
                    {option.predictedWaitMinutes}m
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    (vs {isCalloutActive ? '118m' : '96m'})
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
