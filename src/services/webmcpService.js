/**
 * WebMCP Tool Registration Service
 * 
 * Registers 5 imperative WebMCP tools via `document.modelContext.registerTool(...)`
 * 
 * Registered tools:
 * 1. get_shift_snapshot - Inspect current synthetic census, triage acuity, nurse headcount
 * 2. forecast_wait_time - Forecast ED waiting room wait time based on staffing and census
 * 3. generate_staffing_options - Generate clinical operational strategy options
 * 4. compare_staffing_scenario - Compare baseline vs callout vs contingency scenarios
 * 5. submit_human_approval - Strictly returns {"status": "human_confirmation_required"}
 */

import { initWebMCP } from '../types/webmcp';
import { BASELINE_STATE, CALLOUT_STATE, STAFFING_OPTIONS, calculateForecast } from './simulationEngine';

export function registerWebMcpTools(getCurrentState, onToolExecuted) {
  const modelContext = initWebMCP();
  if (!modelContext || !modelContext.registerTool) {
    console.warn('[WebMCP] document.modelContext not available to register tools');
    return [];
  }

  const registered = [];

  // 1. get_shift_snapshot
  const toolSnapshot = {
    name: 'get_shift_snapshot',
    description: 'Retrieves current synthetic emergency department shift metrics including census, triage acuity levels, nurse count, and safe target.',
    parameters: {
      type: 'object',
      properties: {
        departmentId: {
          type: 'string',
          description: 'Optional department identifier (default: "ED-MAIN")'
        },
        includeBreakdown: {
          type: 'boolean',
          description: 'Whether to include ESI 1-5 triage acuity breakdown'
        }
      },
      required: []
    },
    execute: async (params = {}) => {
      const state = getCurrentState ? getCurrentState() : BASELINE_STATE;
      const result = {
        shiftId: state.shiftId,
        department: state.department,
        timestamp: new Date().toISOString(),
        waitingPatients: state.waitingPatients,
        highAcuityArrivals: state.highAcuityArrivals,
        availableNurses: state.availableNurses,
        forecastWaitTimeMinutes: state.forecastWaitTimeMinutes,
        safeTargetMinutes: state.safeTargetMinutes,
        nurseCalloutActive: !!state.nurseCalloutActive,
        bedOccupancyPercent: state.bedOccupancyPercent,
        patientToNurseRatio: (state.waitingPatients / state.availableNurses).toFixed(1) + ':1'
      };

      if (params.includeBreakdown !== false) {
        result.acuityBreakdown = state.breakdown;
      }

      if (onToolExecuted) onToolExecuted('get_shift_snapshot', params, result);
      return result;
    }
  };

  // 2. forecast_wait_time
  const toolForecast = {
    name: 'forecast_wait_time',
    description: 'Forecasts emergency department door-to-provider wait time based on patient volume, high-acuity arrivals, and nurse headcount.',
    parameters: {
      type: 'object',
      properties: {
        waitingPatients: {
          type: 'integer',
          description: 'Total number of waiting room patients'
        },
        highAcuityArrivals: {
          type: 'integer',
          description: 'Number of ESI 1-2 critical resuscitation/emergent patients'
        },
        availableNurses: {
          type: 'integer',
          description: 'Number of active floor Registered Nurses'
        }
      },
      required: ['waitingPatients', 'highAcuityArrivals', 'availableNurses']
    },
    execute: async (params = {}) => {
      const state = getCurrentState ? getCurrentState() : BASELINE_STATE;
      const waiting = params.waitingPatients ?? state.waitingPatients;
      const acuity = params.highAcuityArrivals ?? state.highAcuityArrivals;
      const nurses = params.availableNurses ?? state.availableNurses;

      const forecastMin = calculateForecast(waiting, acuity, nurses);
      const varianceFromSafeTarget = forecastMin - state.safeTargetMinutes;

      const result = {
        predictedWaitMinutes: forecastMin,
        safeTargetMinutes: state.safeTargetMinutes,
        varianceFromSafeTarget: (varianceFromSafeTarget > 0 ? `+${varianceFromSafeTarget}` : `${varianceFromSafeTarget}`) + ' min',
        isTargetBreached: forecastMin > state.safeTargetMinutes,
        urgencyStatus: forecastMin > 100 ? 'CRITICAL_RISK' : forecastMin > 60 ? 'ELEVATED_RISK' : 'OPTIMAL',
        inputsUsed: { waitingPatients: waiting, highAcuityArrivals: acuity, availableNurses: nurses }
      };

      if (onToolExecuted) onToolExecuted('forecast_wait_time', params, result);
      return result;
    }
  };

  // 3. generate_staffing_options
  const toolOptions = {
    name: 'generate_staffing_options',
    description: 'Generates evidence-informed staffing scenario recommendations for charge nurse review based on acuity stress and call-out status.',
    parameters: {
      type: 'object',
      properties: {
        nurseCalloutActive: {
          type: 'boolean',
          description: 'Whether an unplanned nurse call-out scenario is active'
        },
        targetRiskTolerance: {
          type: 'string',
          enum: ['low', 'balanced', 'cost_conscious'],
          description: 'Desired operational prioritization'
        }
      },
      required: []
    },
    execute: async (params = {}) => {
      const state = getCurrentState ? getCurrentState() : BASELINE_STATE;
      const options = STAFFING_OPTIONS.map(opt => ({
        id: opt.id,
        title: opt.title,
        category: opt.category,
        predictedWaitMinutes: opt.predictedWaitMinutes,
        riskLevel: opt.riskLevel,
        costImpact: opt.costImpact,
        description: opt.description,
        allocations: opt.allocations,
        pros: opt.pros,
        cons: opt.cons
      }));

      const result = {
        generatedAt: new Date().toISOString(),
        currentCalloutActive: params.nurseCalloutActive ?? !!state.nurseCalloutActive,
        recommendedPrimaryOptionId: 'protect-high-acuity',
        candidateOptions: options,
        governanceNotice: 'AI recommendations require human charge nurse approval before implementation.'
      };

      if (onToolExecuted) onToolExecuted('generate_staffing_options', params, result);
      return result;
    }
  };

  // 4. compare_staffing_scenario
  const toolCompare = {
    name: 'compare_staffing_scenario',
    description: 'Compares multiple staffing scenarios (Baseline, Call-Out Unmitigated, Protect High Acuity, Call-in Contingency) side-by-side.',
    parameters: {
      type: 'object',
      properties: {
        scenarioIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of scenario IDs to compare (e.g. ["baseline", "callout", "protect-high-acuity", "call-in-contingency"])'
        }
      },
      required: []
    },
    execute: async (params = {}) => {
      const comparison = [
        {
          scenario: 'Baseline Shift',
          nurses: BASELINE_STATE.availableNurses,
          forecastWaitMinutes: BASELINE_STATE.forecastWaitTimeMinutes,
          safeTargetVariance: '+36m',
          riskLevel: 'Moderate',
          financialImpact: '$0'
        },
        {
          scenario: 'Unmitigated Call-Out',
          nurses: CALLOUT_STATE.availableNurses,
          forecastWaitMinutes: CALLOUT_STATE.forecastWaitTimeMinutes,
          safeTargetVariance: '+58m',
          riskLevel: 'High',
          financialImpact: '$0'
        },
        {
          scenario: 'Plan A: Protect High-Acuity',
          nurses: 6,
          forecastWaitMinutes: 104,
          safeTargetVariance: '+44m',
          riskLevel: 'Moderate',
          financialImpact: '$0'
        },
        {
          scenario: 'Plan B: Call-In Contingency',
          nurses: 7,
          forecastWaitMinutes: 68,
          safeTargetVariance: '+8m',
          riskLevel: 'Low',
          financialImpact: '+$450'
        }
      ];

      const result = {
        comparisonMatrix: comparison,
        safeTargetMinutes: 60,
        bestClinicalSafety: 'Plan A: Protect High-Acuity Flow',
        bestWaitReduction: 'Plan B: Call-In Contingency',
        decisionNote: 'Charge nurse must weigh float pool cost against wait time reduction.'
      };

      if (onToolExecuted) onToolExecuted('compare_staffing_scenario', params, result);
      return result;
    }
  };

  // 5. submit_human_approval (MANDATORY HITL GUARDRAIL)
  const toolApproval = {
    name: 'submit_human_approval',
    description: 'Submits a staffing plan for validation. ALWAYS returns human_confirmation_required to enforce that autonomous AI cannot enact staffing changes.',
    parameters: {
      type: 'object',
      properties: {
        planId: {
          type: 'string',
          description: 'Identifier of the staffing plan to submit'
        },
        approverRole: {
          type: 'string',
          description: 'Role requesting approval'
        },
        rationale: {
          type: 'string',
          description: 'Optional clinical rationale provided by requester'
        }
      },
      required: ['planId']
    },
    execute: async (params = {}) => {
      // STRICT REQUIREMENT:
      // The submit_human_approval tool must return:
      // { "status": "human_confirmation_required" }
      // It must not approve any plan itself.
      const result = {
        status: 'human_confirmation_required',
        guardrailPolicy: 'HITL-SAFE-001',
        message: 'Autonomous AI approval is disallowed. A licensed Charge Nurse must visually review and physically confirm or override this staffing decision via the Command Center interface.',
        submittedPlanId: params.planId || 'unknown',
        timestamp: new Date().toISOString()
      };

      if (onToolExecuted) onToolExecuted('submit_human_approval', params, result);
      return result;
    }
  };

  // Register all 5 tools imperative into document.modelContext
  registered.push(modelContext.registerTool(toolSnapshot));
  registered.push(modelContext.registerTool(toolForecast));
  registered.push(modelContext.registerTool(toolOptions));
  registered.push(modelContext.registerTool(toolCompare));
  registered.push(modelContext.registerTool(toolApproval));

  return registered;
}
