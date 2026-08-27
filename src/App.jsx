import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import SafetyBanner from './components/SafetyBanner';
import ShiftSnapshot from './components/ShiftSnapshot';
import ScenarioControl from './components/ScenarioControl';
import StaffingOptions from './components/StaffingOptions';
import DecisionControls from './components/DecisionControls';
import AuditTrail from './components/AuditTrail';
import WebMcpInspector from './components/WebMcpInspector';
import AcuityDistribution from './components/AcuityDistribution';
import { BASELINE_STATE, CALLOUT_STATE, STAFFING_OPTIONS } from './services/simulationEngine';
import { registerWebMcpTools } from './services/webmcpService';
import { initWebMCP } from './types/webmcp';
import { CheckCircle2, AlertTriangle, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [isCalloutActive, setIsCalloutActive] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState('protect-high-acuity');
  const [webmcpReady, setWebmcpReady] = useState(false);
  const [toolCount, setToolCount] = useState(0);
  const [notification, setNotification] = useState(null);

  // Initial audit events demonstrating system startup and initial telemetry
  const [auditEvents, setAuditEvents] = useState([
    {
      id: 'audit-001',
      timestamp: '19:00:00 EST',
      type: 'WEBMCP_EXEC',
      actorType: 'WEBMCP',
      actor: 'WebMCP Agent',
      title: 'Shift Initial Telemetry Ingested',
      details: 'Registered 5 WebMCP tools into document.modelContext. Baseline census: 42 waiting, 7 active RNs.',
      payload: {
        tool: 'get_shift_snapshot',
        status: 'ready',
        guardrails: 'HITL_ENFORCED'
      }
    }
  ]);

  // Current reactive state based on callout toggle
  const currentState = isCalloutActive ? CALLOUT_STATE : BASELINE_STATE;
  const stateRef = useRef(currentState);
  stateRef.current = currentState;

  // Add event helper
  const addAuditEvent = useCallback((event) => {
    const formattedEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' EST',
      ...event
    };
    setAuditEvents(prev => [formattedEvent, ...prev]);
  }, []);

  // Show temporary toast notification
  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Register WebMCP Tools into document.modelContext on component mount
  useEffect(() => {
    const modelContext = initWebMCP();
    
    const handleToolExecuted = (toolName, params, result) => {
      if (toolName === 'submit_human_approval') {
        addAuditEvent({
          type: 'GUARDRAIL_BLOCKED',
          actorType: 'WEBMCP',
          actor: 'WebMCP Autonomous Agent',
          title: 'Autonomous Staffing Approval Blocked by Guardrail',
          details: `Tool submit_human_approval executed for plan "${params.planId}". Returned status: "human_confirmation_required". Charge nurse must manually approve in UI.`,
          payload: { tool: toolName, params, result }
        });
      } else {
        addAuditEvent({
          type: 'WEBMCP_EXEC',
          actorType: 'WEBMCP',
          actor: 'WebMCP Client',
          title: `Tool Executed: ${toolName}()`,
          details: `Tool invoked with params ${JSON.stringify(params)}. Returned payload successfully.`,
          payload: { tool: toolName, params, result }
        });
      }
    };

    const registered = registerWebMcpTools(() => stateRef.current, handleToolExecuted);
    setToolCount(registered.length);
    setWebmcpReady(true);
  }, [addAuditEvent]);

  // Handle Call-out Toggle
  const handleToggleCallout = (active) => {
    setIsCalloutActive(active);
    if (active) {
      addAuditEvent({
        type: 'WEBMCP_EXEC',
        actorType: 'HUMAN',
        actor: 'Charge Nurse',
        title: 'Scenario Triggered: Model Nurse Call-Out',
        details: 'Simulated unplanned Pod B nurse call-out. Active nurses reduced from 7 to 6. Projected wait surged to 118 min.',
        payload: { callout: true, nurseDelta: -1, availableNurses: 6, forecastWait: 118 }
      });
      showToast('Nurse Call-Out Simulated: Available RNs = 6, Forecast Wait = 118m', 'warning');
    } else {
      addAuditEvent({
        type: 'WEBMCP_EXEC',
        actorType: 'HUMAN',
        actor: 'Charge Nurse',
        title: 'Scenario Reset: Baseline Shift Staffing',
        details: 'Restored standard roster of 7 Registered Nurses. Forecast wait normalized to 96 min.',
        payload: { callout: false, availableNurses: 7, forecastWait: 96 }
      });
      showToast('Shift Roster Restored to 7 RNs (Wait = 96m)', 'info');
    }
  };

  // Handle Human Charge Nurse Plan Approval
  const handleApprovePlan = (plan) => {
    addAuditEvent({
      type: 'APPROVAL',
      actorType: 'HUMAN',
      actor: 'J. Miller, RN (Charge Nurse)',
      title: `Plan Approved: ${plan.title}`,
      details: `Charge nurse signed off on ${plan.title}. Target wait: ${plan.predictedWaitMinutes}m. Financial impact: ${plan.costImpact}.`,
      payload: {
        planId: plan.id,
        planTitle: plan.title,
        predictedWaitMinutes: plan.predictedWaitMinutes,
        action: 'HUMAN_APPROVAL_GRANTED',
        signoffTimestamp: new Date().toISOString()
      }
    });
    showToast(`Staffing Plan Authorized: ${plan.title}`, 'success');
  };

  // Handle Human Charge Nurse Plan Override
  const handleOverridePlan = (targetPlan, rationale) => {
    addAuditEvent({
      type: 'OVERRIDE',
      actorType: 'HUMAN',
      actor: 'J. Miller, RN (Charge Nurse)',
      title: `Recommendation Overridden → ${targetPlan.title}`,
      details: `Charge nurse overrode system default. Clinical rationale: "${rationale}"`,
      payload: {
        overriddenToPlanId: targetPlan.id,
        overriddenPlanTitle: targetPlan.title,
        clinicalRationale: rationale,
        action: 'HUMAN_OVERRIDE_RECORDED',
        signoffTimestamp: new Date().toISOString()
      }
    });
    setSelectedOptionId(targetPlan.id);
    showToast(`Recommendation Overridden to: ${targetPlan.title}`, 'warning');
  };

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: notification.type === 'success' ? '#065f46' : notification.type === 'warning' ? '#92400e' : '#1e293b',
          color: '#ffffff',
          padding: '0.875rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(6, 182, 212, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          animation: 'slideUp 0.2s ease-out'
        }}>
          {notification.type === 'success' ? <CheckCircle2 size={18} color="#34d399" /> : <AlertTriangle size={18} color="#fbbf24" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 1. Header */}
      <Header
        webmcpReady={webmcpReady}
        toolCount={toolCount}
        isCalloutActive={isCalloutActive}
      />

      {/* 2. Safety and Human-In-The-Loop Banner */}
      <SafetyBanner />

      {/* 3. Shift Snapshot Metrics */}
      <ShiftSnapshot
        waitingPatients={currentState.waitingPatients}
        highAcuityArrivals={currentState.highAcuityArrivals}
        availableNurses={currentState.availableNurses}
        forecastWaitMinutes={currentState.forecastWaitTimeMinutes}
        safeTargetMinutes={currentState.safeTargetMinutes}
        isCalloutActive={isCalloutActive}
      />

      {/* 4. Scenario Stress-Testing: Model Nurse Call-Out Toggle */}
      <ScenarioControl
        isCalloutActive={isCalloutActive}
        onToggleCallout={handleToggleCallout}
      />

      {/* 5. Triage Acuity Breakdown */}
      <AcuityDistribution breakdown={currentState.breakdown} />

      {/* 6. Selectable Staffing Options */}
      <StaffingOptions
        selectedOptionId={selectedOptionId}
        onSelectOption={setSelectedOptionId}
        isCalloutActive={isCalloutActive}
      />

      {/* 7. Visible Human Decision Controls (Approve / Override) */}
      <DecisionControls
        selectedOptionId={selectedOptionId}
        onApprovePlan={handleApprovePlan}
        onOverridePlan={handleOverridePlan}
        isCalloutActive={isCalloutActive}
      />

      {/* 8. WebMCP Live Tool Console & Inspector */}
      <WebMcpInspector
        isCalloutActive={isCalloutActive}
        onToolExecutedInUI={(toolName, params, result) => {
          // Handled by webmcpService callback
        }}
      />

      {/* 9. Chronological Audit Trail & Governance Log */}
      <AuditTrail
        events={auditEvents}
        onClearLogs={() => setAuditEvents([])}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        color: 'var(--text-muted)',
        fontSize: '0.78rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        <div>
          SafeStaff Shift Commander — WebMCP Demonstration • MIT Licensed
        </div>
        <div>
          Synthetic ED Operational Simulation • No Real Patient Data or PHI • Autonomous Staffing Changes Disallowed
        </div>
      </footer>
    </div>
  );
}
