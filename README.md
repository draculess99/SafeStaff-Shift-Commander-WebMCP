# SafeStaff Shift Commander — WebMCP

> **A synthetic emergency-department nurse-staffing decision-support dashboard demonstrating the imperative WebMCP API (`document.modelContext.registerTool`).**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![WebMCP](https://img.shields.io/badge/WebMCP-Imperative%20Tools-06B6D4)](https://github.com)
[![HITL Guardrails](https://img.shields.io/badge/Safety-HITL%20Enforced-10B981)](#safety--governance-statement)

---

## Overview

**SafeStaff Shift Commander** is a hospital operations command-center interface designed to showcase how client-side AI agents can interface with complex operational web apps through **WebMCP** while maintaining strict **Human-In-The-Loop (HITL)** governance and clinical safety boundaries.

In an active Level-1 Trauma Emergency Department, nurse staffing shortages and patient surges present critical trade-offs. While AI tools excel at high-speed census telemetry ingestion, non-linear queue forecasting, and candidate scenario generation, **clinical staffing actions must never be enacted autonomously by an AI agent**.

SafeStaff Shift Commander demonstrates this dual paradigm:
1. **Rich AI Assistance via WebMCP**: Agents can inspect live department state, forecast door-to-provider wait times, generate evidence-informed staffing options, and run multi-scenario comparisons.
2. **Immutable HITL Guardrails**: The approval tool strictly blocks autonomous execution, returning `{"status": "human_confirmation_required"}`. A licensed Charge Nurse must visually review and authorize or override every decision.

---

## Key Product Flow

1. **Shift Snapshot Telemetry**:
   - Waiting Patients: **42**
   - High-Acuity Arrivals: **3** (ESI 1-2 Resuscitation / Emergent)
   - Available Nurses: **7**
   - Forecast Wait Time: **96 minutes** vs Safe Target: **60 minutes**
   - ESI Triage Census Breakdown (ESI-1 through ESI-5)
2. **"Model Nurse Call-Out" Scenario**:
   - Simulates an unplanned absence mid-shift.
   - When enabled: Available nurses drop to **6 RNs**, and forecast wait surges to **118 minutes** (+58m over safe target).
3. **Three Selectable Staffing Action Plans**:
   - **Protect High-Acuity Flow**: Ring-fences dedicated 1:1 and 1:2 coverage for critical pods (zero delay for life-threats, minor low-acuity queue delay).
   - **Call-In Contingency**: Dispatches on-call ED Float Pool RN (drops wait to 68m, incurs $450 differential).
   - **Hold and Monitor**: Preserves float hours, monitors surge threshold with 30-minute re-evaluation alert.
4. **Human Decision Controls & Signoff**:
   - **Approve Plan**: Authorizes the selected recommendation with cryptographic audit trail logging.
   - **Override Recommendation**: Allows the Charge Nurse to select an alternate strategy and submit a mandatory clinical rationale.
5. **Interactive WebMCP Console**:
   - Built-in live API workbench allowing direct testing of all 5 registered tools, parameter editing, JSON schema inspection, and execution timing.
6. **Compliance Audit Trail**:
   - Chronological, exportable event log tracking all AI tool calls, human approvals, and overrides with actor attribution and JSON payloads.

---

## WebMCP Tool Specifications

All 5 tools are imperatively registered into `document.modelContext.registerTool(...)` upon mounting:

| Tool Identifier | Purpose | Input Parameters | Key Return Characteristics |
|---|---|---|---|
| `get_shift_snapshot` | Returns current synthetic census, triage acuity, nurse count, and ratio. | `departmentId` (str), `includeBreakdown` (bool) | Current department metrics & ESI breakdown |
| `forecast_wait_time` | Calculates projected door-to-provider wait time based on staffing. | `waitingPatients` (int), `highAcuityArrivals` (int), `availableNurses` (int) | `predictedWaitMinutes`, `varianceFromSafeTarget`, `urgencyStatus` |
| `generate_staffing_options` | Generates candidate staffing allocations with pros/cons and risk levels. | `nurseCalloutActive` (bool), `targetRiskTolerance` (enum) | Candidate options matrix and primary recommendation |
| `compare_staffing_scenario` | Generates side-by-side comparison of baseline, call-out, and mitigations. | `scenarioIds` (array) | Matrix comparing nurses, wait times, risk, and financial impact |
| `submit_human_approval` | **HITL Safety Guardrail** | `planId` (str), `approverRole` (str), `rationale` (str) | **Always returns** `{"status": "human_confirmation_required"}` |

### WebMCP Tool Execution Guide & Test Suite

You can execute and verify all 5 tools directly in the embedded **WebMCP Imperative Tool Console & Inspector** at the bottom of the dashboard or programmatically via `document.modelContext.executeTool(name, params)`:

#### 1. `get_shift_snapshot`
* **Purpose**: Ingests real-time synthetic census, triage breakdown, and nurse headcount.
* **Sample Input**: `{"departmentId": "ED-MAIN", "includeBreakdown": true}`
* **Expected Output**:
  ```json
  {
    "shiftId": "SHIFT-ED-2026-N02",
    "department": "Main Emergency Department (Level 1 Trauma)",
    "waitingPatients": 42,
    "highAcuityArrivals": 3,
    "availableNurses": 7,
    "forecastWaitTimeMinutes": 96,
    "safeTargetMinutes": 60,
    "patientToNurseRatio": "6.0:1",
    "acuityBreakdown": { "esi1_resus": 1, "esi2_emergent": 2, "esi3_urgent": 19, "esi4_lessUrgent": 14, "esi5_nonUrgent": 6 }
  }
  ```

#### 2. `forecast_wait_time`
* **Purpose**: Calculates projected queue delays based on volume, acuity, and staffing.
* **Sample Input**: `{"waitingPatients": 42, "highAcuityArrivals": 3, "availableNurses": 6}`
* **Expected Output**:
  ```json
  {
    "predictedWaitMinutes": 118,
    "safeTargetMinutes": 60,
    "varianceFromSafeTarget": "+58 min",
    "isTargetBreached": true,
    "urgencyStatus": "CRITICAL_RISK"
  }
  ```

#### 3. `generate_staffing_options`
* **Purpose**: Proposes candidate staffing allocations with pros/cons and risk ratings.
* **Sample Input**: `{"nurseCalloutActive": true, "targetRiskTolerance": "balanced"}`
* **Expected Output**:
  ```json
  {
    "recommendedPrimaryOptionId": "protect-high-acuity",
    "candidateOptions": [
      { "id": "protect-high-acuity", "title": "Protect High-Acuity Flow", "riskLevel": "Moderate", "predictedWaitMinutes": 104 },
      { "id": "call-in-contingency", "title": "Call-In Contingency", "riskLevel": "Low", "predictedWaitMinutes": 68 },
      { "id": "hold-and-monitor", "title": "Hold and Monitor", "riskLevel": "High", "predictedWaitMinutes": 118 }
    ],
    "governanceNotice": "AI recommendations require human charge nurse approval before implementation."
  }
  ```

#### 4. `compare_staffing_scenario`
* **Purpose**: Generates a side-by-side comparative matrix of operational outcomes.
* **Sample Input**: `{"scenarioIds": ["baseline", "callout", "protect-high-acuity", "call-in-contingency"]}`
* **Expected Output**:
  ```json
  {
    "comparisonMatrix": [
      { "scenario": "Baseline Shift", "nurses": 7, "forecastWaitMinutes": 96, "financialImpact": "$0" },
      { "scenario": "Unmitigated Call-Out", "nurses": 6, "forecastWaitMinutes": 118, "financialImpact": "$0" },
      { "scenario": "Plan A: Protect High-Acuity", "nurses": 6, "forecastWaitMinutes": 104, "financialImpact": "$0" },
      { "scenario": "Plan B: Call-In Contingency", "nurses": 7, "forecastWaitMinutes": 68, "financialImpact": "+$450" }
    ],
    "bestClinicalSafety": "Plan A: Protect High-Acuity Flow",
    "bestWaitReduction": "Plan B: Call-In Contingency"
  }
  ```

#### 5. `submit_human_approval` (Strict HITL Guardrail)
* **Purpose**: Intercepts autonomous approval requests and forces licensed human signoff.
* **Sample Input**: `{"planId": "protect-high-acuity", "approverRole": "Charge Nurse"}`
* **Enforced Output**:
  ```json
  {
    "status": "human_confirmation_required",
    "guardrailPolicy": "HITL-SAFE-001",
    "message": "Autonomous AI approval is disallowed. A licensed Charge Nurse must visually review and physically confirm or override this staffing decision via the Command Center interface.",
    "submittedPlanId": "protect-high-acuity"
  }
  ```

---

## Design System & Aesthetics

- **Command Center Visuals**: Deep slate navy background (`#060a14`, `#0c1427`), glowing cyan accents (`#06b6d4`), and glassmorphism.
- **Color-Coded Clinical Alert Tiers**:
  - `Cyan (#06b6d4)`: Optimal / Telemetry Active
  - `Emerald (#10b981)`: Human Approval Granted / Safe Capacity
  - `Amber (#f59e0b)`: Elevated Wait Time / Call-Out Active / Clinical Override
  - `Rose (#f43f5e)`: Critical Acuity Surge / Autonomous Approval Blocked
- **Typography**: Inter (UI Structure) and JetBrains Mono (Telemetry, Timers, and JSON schemas).

---

## Safety & Governance Statement

> [!CAUTION]
> **Non-Clinical Disclaimer & Synthetic Data Guarantee**:
> SafeStaff Shift Commander is a synthetic demonstration dashboard for WebMCP agent interactions and decision-support architecture.
> - Contains **NO Protected Health Information (PHI)** or real patient records.
> - Is **NOT** a certified Medical Device or clinical diagnostic system.
> - **Autonomous execution is architecturally prohibited**: Clinical staffing allocations require licensed human confirmation.

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/draculess99/SafeStaff-Shift-Commander-WebMCP.git
cd SafeStaff-Shift-Commander-WebMCP

# Install dependencies
npm install
```

### Development Server

```bash
# Start local Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Production Build & Preview

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Browser Verification & Test Evidence

The application underwent full end-to-end automated browser verification on `http://localhost:5173/`. All 5 verification milestones passed with 0 console errors:

| Step | Verification Milestone | Observed Behavior | Evidence Screenshot |
|---|---|---|---|
| **01** | **Shift Telemetry & Call-Out Mode** | Toggling "Model Nurse Call-Out" switches nurses from 7 to 6 and forecast wait time from 96m to 118m. | [`evidence/01-dashboard-callout.png`](evidence/01-dashboard-callout.png) |
| **02** | **Staffing Strategy Selection** | Successfully selected "Call-In Contingency" showing pod allocations and 68m projected wait time. | [`evidence/02-staffing-options.png`](evidence/02-staffing-options.png) |
| **03** | **Human Approval Signoff** | Clicked "Approve Plan"; visual feedback confirmed and immutable signoff event was added to the audit trail. | [`evidence/03-human-approval-audit.png`](evidence/03-human-approval-audit.png) |
| **04** | **Clinical Override & Governance** | Overrode recommendation with mandatory clinical justification; recorded with actor attribution in audit trail. | [`evidence/04-override-audit.png`](evidence/04-override-audit.png) |
| **05** | **WebMCP HITL Safety Guardrail** | In the live WebMCP Console, executed `submit_human_approval()` and received `{"status": "human_confirmation_required"}`. | [`evidence/05-webmcp-hitl-guardrail.png`](evidence/05-webmcp-hitl-guardrail.png) |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
