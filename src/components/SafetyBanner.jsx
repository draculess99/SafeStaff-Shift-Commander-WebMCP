import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SafetyBanner() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.05) 50%, rgba(245, 158, 11, 0.08) 100%)',
      border: '1px solid rgba(14, 165, 233, 0.25)',
      borderRadius: '10px',
      padding: '0.875rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 500px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(6, 182, 212, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={18} color="var(--cyan-400)" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#ffffff' }}>
              Safety & Governance Guardrail (HITL-Enforced)
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
              <CheckCircle2 size={10} /> Clinical HITL Active
            </span>
            <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
              Synthetic Data • No PHI
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            WebMCP tools can inspect, forecast, and compare scenarios. <strong style={{ color: 'var(--amber-400)' }}>Autonomous staffing modifications are strictly blocked</strong>. The charge nurse must manually review, approve, or override every recommendation.
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '0.35rem 0.75rem',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--cyan-400)'
      }}>
        <Lock size={12} />
        <span>submit_human_approval → status: &quot;human_confirmation_required&quot;</span>
      </div>
    </div>
  );
}
