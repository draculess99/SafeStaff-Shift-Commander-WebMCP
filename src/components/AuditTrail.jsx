import React, { useState } from 'react';
import { History, ShieldCheck, AlertOctagon, Cpu, Download, Copy, Check, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export default function AuditTrail({ events, onClearLogs }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(false);

  const filteredEvents = events.filter(ev => {
    if (filter === 'human') return ev.actorType === 'HUMAN';
    if (filter === 'webmcp') return ev.actorType === 'WEBMCP';
    return true;
  });

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(JSON.stringify(events, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safestaff-audit-trail-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'APPROVAL':
        return <span className="badge badge-emerald"><ShieldCheck size={11} /> Plan Approved</span>;
      case 'OVERRIDE':
        return <span className="badge badge-amber"><AlertOctagon size={11} /> Plan Overridden</span>;
      case 'WEBMCP_EXEC':
        return <span className="badge badge-cyan"><Cpu size={11} /> WebMCP Tool Call</span>;
      case 'GUARDRAIL_BLOCKED':
        return <span className="badge badge-rose"><Lock size={11} /> Autonomous Approval Blocked</span>;
      default:
        return <span className="badge badge-slate">{type}</span>;
    }
  };

  return (
    <section className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <History size={18} color="var(--cyan-400)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Clinical & Governance Audit Trail
          </h2>
          <span className="badge badge-slate font-mono" style={{ fontSize: '0.7rem' }}>
            {events.length} Events
          </span>
        </div>

        {/* Filter Pills & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setFilter('all')}
              style={{
                background: filter === 'all' ? 'var(--cyan-500)' : 'transparent',
                color: filter === 'all' ? '#000000' : 'var(--text-secondary)',
                fontWeight: filter === 'all' ? '700' : '500',
                border: 'none',
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              All ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('human')}
              style={{
                background: filter === 'human' ? 'var(--cyan-500)' : 'transparent',
                color: filter === 'human' ? '#000000' : 'var(--text-secondary)',
                fontWeight: filter === 'human' ? '700' : '500',
                border: 'none',
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Human Signoffs
            </button>
            <button
              type="button"
              onClick={() => setFilter('webmcp')}
              style={{
                background: filter === 'webmcp' ? 'var(--cyan-500)' : 'transparent',
                color: filter === 'webmcp' ? '#000000' : 'var(--text-secondary)',
                fontWeight: filter === 'webmcp' ? '700' : '500',
                border: 'none',
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              WebMCP Logs
            </button>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopyLogs}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            title="Copy audit log to clipboard"
          >
            {copied ? <Check size={14} color="var(--emerald-400)" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDownloadLogs}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            title="Download JSON audit log"
          >
            <Download size={14} />
            JSON
          </button>
        </div>
      </div>

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No audit events found for current filter.
          </div>
        ) : (
          filteredEvents.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8125rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    {getEventBadge(item.type)}
                    <span style={{ fontWeight: '600', color: '#ffffff' }}>
                      {item.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      Actor: <strong style={{ color: item.actorType === 'HUMAN' ? 'var(--emerald-400)' : 'var(--cyan-400)' }}>{item.actor}</strong>
                    </span>
                    <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {item.timestamp}
                    </span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                  {item.details}
                </div>

                {/* Collapsible JSON / Technical Payload */}
                {isExpanded && item.payload && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Structured Audit Payload & Hash
                    </div>
                    <pre
                      className="font-mono"
                      style={{
                        background: 'var(--bg-base)',
                        padding: '0.625rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        color: 'var(--cyan-400)',
                        overflowX: 'auto',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      {JSON.stringify(item.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
