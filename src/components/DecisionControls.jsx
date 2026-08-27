import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon, UserCheck, ShieldAlert, FileText, Send, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { STAFFING_OPTIONS } from '../services/simulationEngine';

export default function DecisionControls({
  selectedOptionId,
  onApprovePlan,
  onOverridePlan,
  isCalloutActive
}) {
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideTargetOption, setOverrideTargetOption] = useState(selectedOptionId);
  const [isApproving, setIsApproving] = useState(false);

  const selectedPlan = STAFFING_OPTIONS.find(o => o.id === selectedOptionId) || STAFFING_OPTIONS[0];

  const handleApprove = () => {
    setIsApproving(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#10b981', '#fbbf24']
      });
    } catch (e) {
      // Confetti fallback
    }

    setTimeout(() => {
      onApprovePlan(selectedPlan);
      setIsApproving(false);
    }, 250);
  };

  const handleConfirmOverride = () => {
    const targetPlan = STAFFING_OPTIONS.find(o => o.id === overrideTargetOption) || selectedPlan;
    onOverridePlan(targetPlan, overrideReason || 'Clinical Charge Nurse discretion based on departmental patient acuity influx.');
    setShowOverrideModal(false);
    setOverrideReason('');
  };

  return (
    <section className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-active)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
        
        {/* Selected Recommendation Summary */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--cyan-400)' }}>
              CURRENT SELECTION READY FOR CHARGE NURSE SIGNOFF
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              Human Action Required
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff' }}>
              {selectedPlan.title}
            </h3>
            <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
              Target Wait: <strong style={{ color: 'var(--cyan-400)', marginLeft: '3px' }}>{selectedPlan.predictedWaitMinutes} min</strong>
            </span>
            <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
              Cost: <strong style={{ color: '#ffffff', marginLeft: '3px' }}>{selectedPlan.costImpact}</strong>
            </span>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {selectedPlan.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
          
          {/* Override Button */}
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => {
              setOverrideTargetOption(selectedOptionId);
              setShowOverrideModal(true);
            }}
            style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}
          >
            <AlertOctagon size={18} />
            Override Recommendation
          </button>

          {/* Approve Button */}
          <button
            type="button"
            className="btn btn-success"
            onClick={handleApprove}
            disabled={isApproving}
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
          >
            <CheckCircle2 size={19} />
            {isApproving ? 'Authorizing Shift...' : 'Approve Plan'}
          </button>

        </div>
      </div>

      {/* Human Override Modal */}
      {showOverrideModal && (
        <div className="modal-overlay" onClick={() => setShowOverrideModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '1.5rem' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldAlert size={20} color="var(--amber-400)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
                    Clinical Staffing Override
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Charge Nurse Governance & Audit Record
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowOverrideModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Target Option Selection */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Select Alternative Plan:
              </label>
              <select
                value={overrideTargetOption}
                onChange={e => setOverrideTargetOption(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.625rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                {STAFFING_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.title} — Predicted Wait: {opt.predictedWaitMinutes}m ({opt.riskLevel} Risk)
                  </option>
                ))}
              </select>
            </div>

            {/* Rationale Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Charge Nurse Clinical Rationale (Required for Audit Trail):
              </label>
              <textarea
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                placeholder="E.g., Influx of two simultaneous trauma activations requires holding contingency nurse on standby rather than high-acuity rebalance..."
                rows={4}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'var(--font-sans)'
                }}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowOverrideModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-warning"
                onClick={handleConfirmOverride}
              >
                <Send size={16} />
                Submit Formal Override
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
