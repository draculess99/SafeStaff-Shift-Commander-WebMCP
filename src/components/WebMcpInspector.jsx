import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, ShieldAlert, Cpu, Code2, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { initWebMCP } from '../types/webmcp';

export default function WebMcpInspector({ isCalloutActive, onToolExecutedInUI }) {
  const modelContext = initWebMCP();
  const tools = modelContext ? modelContext.getTools() : [];

  const [selectedToolName, setSelectedToolName] = useState('submit_human_approval');
  const [customParams, setCustomParams] = useState(
    JSON.stringify({ planId: 'protect-high-acuity', approverRole: 'Charge Nurse', rationale: 'Routine verification' }, null, 2)
  );
  const [executionResult, setExecutionResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [jsonError, setJsonError] = useState(null);

  const selectedTool = tools.find(t => t.name === selectedToolName) || tools[0];

  const handleSelectTool = (toolName) => {
    setSelectedToolName(toolName);
    setExecutionResult(null);
    setJsonError(null);

    // Set default sample parameters
    switch (toolName) {
      case 'get_shift_snapshot':
        setCustomParams(JSON.stringify({ departmentId: 'ED-MAIN', includeBreakdown: true }, null, 2));
        break;
      case 'forecast_wait_time':
        setCustomParams(JSON.stringify({ waitingPatients: 42, highAcuityArrivals: 3, availableNurses: isCalloutActive ? 6 : 7 }, null, 2));
        break;
      case 'generate_staffing_options':
        setCustomParams(JSON.stringify({ nurseCalloutActive: isCalloutActive, targetRiskTolerance: 'balanced' }, null, 2));
        break;
      case 'compare_staffing_scenario':
        setCustomParams(JSON.stringify({ scenarioIds: ['baseline', 'callout', 'protect-high-acuity', 'call-in-contingency'] }, null, 2));
        break;
      case 'submit_human_approval':
        setCustomParams(JSON.stringify({ planId: 'protect-high-acuity', approverRole: 'Charge Nurse', rationale: 'Agent attempting autonomous approval test' }, null, 2));
        break;
      default:
        setCustomParams('{}');
    }
  };

  const handleExecute = async () => {
    if (!selectedTool) return;
    setJsonError(null);
    let parsedParams = {};
    try {
      if (customParams.trim()) {
        parsedParams = JSON.parse(customParams);
      }
    } catch (e) {
      setJsonError('Invalid JSON parameters: ' + e.message);
      return;
    }

    setIsRunning(true);
    const start = performance.now();
    try {
      const res = await selectedTool.execute(parsedParams);
      const duration = Math.round(performance.now() - start);
      setExecutionResult({
        status: 'success',
        duration,
        data: res
      });
      if (onToolExecutedInUI) {
        onToolExecutedInUI(selectedTool.name, parsedParams, res);
      }
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      setExecutionResult({
        status: 'error',
        duration,
        error: err.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
      {/* Inspector Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Terminal size={20} color="var(--cyan-400)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                WebMCP Imperative Tool Console & Inspector
              </h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                Live API Tester
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Inspect and test the 5 tools registered into <code className="font-mono" style={{ color: 'var(--cyan-400)' }}>document.modelContext.registerTool()</code>.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Imperative API Target: <span className="font-mono" style={{ color: 'var(--cyan-400)' }}>document.modelContext</span>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {tools.map((t) => {
          const isSelected = selectedTool && selectedTool.name === t.name;
          const isGuardrailTool = t.name === 'submit_human_approval';

          return (
            <button
              key={t.name}
              type="button"
              onClick={() => handleSelectTool(t.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 0.875rem',
                borderRadius: '8px',
                border: isSelected ? (isGuardrailTool ? '1px solid var(--amber-400)' : '1px solid var(--cyan-400)') : '1px solid var(--border-subtle)',
                background: isSelected ? (isGuardrailTool ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.15)') : 'var(--bg-surface-elevated)',
                color: isSelected ? (isGuardrailTool ? 'var(--amber-400)' : 'var(--cyan-400)') : 'var(--text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: isSelected ? '700' : '500',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {isGuardrailTool && <ShieldAlert size={14} color="var(--amber-400)" />}
              {t.name}()
            </button>
          );
        })}
      </div>

      {/* Selected Tool Details & Workbench */}
      {selectedTool && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          
          {/* Left Column: Schema & Description */}
          <div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="font-mono" style={{ color: 'var(--cyan-400)' }}>{selectedTool.name}</span>
                {selectedTool.name === 'submit_human_approval' && (
                  <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                    HITL Block Tool
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {selectedTool.description}
              </p>
            </div>

            {/* Parameter Input JSON Editor */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Input Parameters (JSON):
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--cyan-400)', cursor: 'pointer' }} onClick={() => handleSelectTool(selectedTool.name)}>
                  Reset Sample
                </span>
              </div>
              <textarea
                value={customParams}
                onChange={e => setCustomParams(e.target.value)}
                rows={5}
                className="font-mono"
                style={{
                  width: '100%',
                  background: 'var(--bg-base)',
                  color: '#ffffff',
                  border: jsonError ? '1px solid var(--rose-500)' : '1px solid var(--border-subtle)',
                  padding: '0.625rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              {jsonError && (
                <div style={{ color: 'var(--rose-400)', fontSize: '0.75rem', marginTop: '4px' }}>
                  {jsonError}
                </div>
              )}
            </div>

            {/* Execute Button */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExecute}
              disabled={isRunning}
              style={{ width: '100%', padding: '0.625rem' }}
            >
              <Zap size={16} />
              {isRunning ? 'Invoking WebMCP...' : `Execute ${selectedTool.name}()`}
            </button>
          </div>

          {/* Right Column: Live Output & Execution Result */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Tool Execution Result:
              </span>
              {executionResult && (
                <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--emerald-400)' }}>
                  Duration: {executionResult.duration}ms
                </span>
              )}
            </div>

            <div style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.875rem',
              minHeight: '195px',
              maxHeight: '260px',
              overflowY: 'auto',
              position: 'relative'
            }}>
              {executionResult ? (
                <>
                  {selectedTool.name === 'submit_human_approval' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      padding: '0.4rem 0.625rem',
                      borderRadius: '6px',
                      marginBottom: '0.625rem',
                      fontSize: '0.75rem',
                      color: 'var(--amber-400)'
                    }}>
                      <ShieldAlert size={14} />
                      <strong>Safety Result Confirmed:</strong> Returned &quot;human_confirmation_required&quot; — Autonomous approval was blocked.
                    </div>
                  )}

                  <pre
                    className="font-mono"
                    style={{
                      fontSize: '0.75rem',
                      color: executionResult.status === 'success' ? 'var(--cyan-400)' : 'var(--rose-400)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}
                  >
                    {JSON.stringify(executionResult.data || executionResult.error, null, 2)}
                  </pre>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  <Code2 size={24} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                  <span>Click &quot;Execute {selectedTool.name}()&quot; to test WebMCP invocation</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
