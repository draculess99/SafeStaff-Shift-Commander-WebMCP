# Devpost Submission: SafeStaff Shift Commander — WebMCP

## Project Tagline
An Emergency Department nurse-staffing decision-support dashboard demonstrating imperative WebMCP (`document.modelContext.registerTool`) with strict Human-In-The-Loop (HITL) safety guardrails.

---

## Elevator Pitch
SafeStaff Shift Commander is a synthetic hospital operations command-center dashboard built for the WebMCP Hackathon. It demonstrates how AI agents can inspect live Emergency Department census telemetry, forecast non-linear wait times, and compare staffing mitigations via the **imperative WebMCP API** (`document.modelContext.registerTool`), while strictly enforcing clinical safety guardrails: **AI tools are architecturally prevented from autonomously enacting staffing decisions**—every plan requires explicit Charge Nurse approval or override with a timestamped session audit trail with JSON export.

---

## Devpost Submission Fields

### 1. Inspiration
Hospital Emergency Departments operate under extreme stress. Nurse shortages and unpredictable patient influxes force Charge Nurses to make complex re-allocation decisions under high cognitive load. While agentic AI has immense potential to ingest census telemetry, compute queuing delays, and formulate mitigation options, **autonomous AI execution in clinical environments is unsafe**.

We wanted to demonstrate how **WebMCP** enables client-side AI agents to serve as exceptional decision-support partners without ever stripping control from licensed clinicians.

### 2. What it Does
SafeStaff Shift Commander provides a rich operational command center interface:
- **Live Shift Snapshot**: Tracks waiting patients (42), high-acuity arrivals (3 ESI 1-2 resuscitations), available nurses (7), and forecast wait times (96 min vs 60 min safe target).
- **Scenario Stress-Testing ("Model Nurse Call-Out")**: Toggles an unplanned nurse absence, reducing staff to 6 RNs and surging forecast wait times to 118 minutes.
- **Selectable Staffing Plans**: Generates and compares 3 actionable strategies:
  1. *Protect High-Acuity Flow* (Dedicated critical care allocation, buffers fast-track queue).
  2. *Call-In Contingency* (Dispatches float pool nurse, drops wait to 68 min).
  3. *Hold and Monitor* (Resource conservation with a 30-min surge trigger).
- **Human-In-The-Loop Decision Controls**: Clear **Approve Plan** and **Override Recommendation** buttons requiring clinical justification for overrides.
- **Interactive WebMCP Console & Inspector**: Embedded playground to test and inspect all 5 imperative tools directly in the browser.
- **Compliance Audit Trail**: Timestamped session audit trail with JSON export capturing every AI tool invocation, inputSchema payload, human approval, and clinical override.

### 3. How We Built It
- **Frontend & Design System**: React 18, Vite 6, Lucide React, and custom CSS implementing a dark command-center aesthetic (deep navy `#060a14`, glowing cyan `#06b6d4`, amber alert `#f59e0b`).
- **WebMCP Integration**: Registered 5 tools directly into `document.modelContext.registerTool(...)`:
  - `get_shift_snapshot`: Ingests census, triage acuity, nurse count, and ratios.
  - `forecast_wait_time`: Calculates door-to-provider wait time based on staffing and census.
  - `generate_staffing_options`: Proposes candidate staffing allocations with pros/cons and risk scores.
  - `compare_staffing_scenario`: Compares baseline, call-out, and contingency scenarios side-by-side.
  - `submit_human_approval`: **HITL Guardrail** — Always returns `{"status": "human_confirmation_required"}` to prove agents cannot self-approve staffing changes.
- **Simulation Engine**: Realistic, deterministic queue modeling and ESI 1–5 triage breakdown without any real patient data or PHI.

### 4. Challenges We Ran Into
- **Enforcing the HITL Boundary**: Designing an agentic tool flow where the AI can simulate, forecast, and prepare recommendations while guaranteeing that autonomous execution calls fail safely with `{"status": "human_confirmation_required"}`.
- **Balancing Telemetry Density**: Delivering hospital command-center data density (ratios, variance chips, acuity bars, financial impacts) while maintaining an intuitive visual hierarchy.

### 5. Accomplishments That We're Proud Of
- **Zero External Backend Dependencies**: The entire WebMCP tool suite operates client-side via the browser's `document.modelContext`.
- **Interactive WebMCP Inspector**: Judges and developers can test tool schemas and live executions without needing external CLI tools.
- **Dual Perspective Demonstration**: Clear separation between what the AI Agent sees/does (WebMCP tools) and what the Human Clinician sees/does (Command Center UI + Audit Signoff).

### 6. What We Learned
WebMCP makes it straightforward to expose structured capabilities directly from web applications to AI agents without creating fragile scraping workflows or heavy custom servers. The imperative `registerTool` pattern is flexible and easy to govern.

### 7. What's Next for SafeStaff Shift Commander
- **Synthetic FHIR/HL7 Feeds**: Connecting synthetic hospital EHR streams for multi-department tracking (ICU, Med-Surg, Stepdown).
- **Predictive 12-Hour Surge Heatmaps**: Expanding queue forecasting to include EMS ambulance telemetry and community surge factors.

---

## Links & Repositories
- **GitHub Repository**: [https://github.com/draculess99/SafeStaff-Shift-Commander-WebMCP](https://github.com/draculess99/SafeStaff-Shift-Commander-WebMCP)
- **License**: MIT
