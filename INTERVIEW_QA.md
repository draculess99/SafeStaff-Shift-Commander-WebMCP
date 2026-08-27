# SafeStaff Shift Commander — WebMCP: Technical Interview & Judge Q&A Guide

This guide prepares you for questions from judges, technical reviewers, or hiring managers examining the architecture, clinical safety philosophy, and WebMCP implementation.

---

## Top 10 Interview Questions & Model Answers

### 1. "What is WebMCP and why did you choose the imperative `registerTool` pattern?"
**Answer:**
> "WebMCP allows web applications to expose structured tools, live telemetry, and actions directly to client-side AI agents. We used the imperative `document.modelContext.registerTool(...)` API because it gives us fine-grained programmatic control over parameter validation, execution timing, and return payloads. It registers 5 production tools directly into the browser runtime without requiring an external backend middleware or proxy."

---

### 2. "Why doesn't the AI agent automatically approve staffing changes?"
**Answer:**
> "In a healthcare setting, autonomous clinical decision-making is a major patient safety risk. SafeStaff strictly enforces a **Human-In-The-Loop (HITL)** boundary. The AI excels at heavy computational tasks—ingesting census data, modeling non-linear wait times, and proposing options—while the licensed Charge Nurse retains 100% authority. Our `submit_human_approval` tool intentionally returns `{"status": "human_confirmation_required"}` to prove that autonomous execution is blocked at the architectural level."

---

### 3. "How does the 'Model Nurse Call-Out' simulation work?"
**Answer:**
> "When an unplanned nurse absence occurs (e.g. Pod B nurse calls out), available nurses drop from 7 to 6. Our simulation engine models the non-linear impact of nurse-to-patient ratios on door-to-provider wait time, causing the projected wait to jump from 96 minutes to 118 minutes (nearly double the 60-minute safe operational ceiling). This simulates real-world ED bottlenecks where minor staffing drops cause major queue compounding."

---

### 4. "How do the three staffing strategies differ?"
**Answer:**
> "1. **Protect High-Acuity Flow**: Ring-fences dedicated 1:1 and 1:2 nurse ratios for resuscitation and emergent patients (ESI 1-2), allowing non-urgent queues to buffer slightly ($0 cost).
> 2. **Call-In Contingency**: Dispatches an on-call Float Pool RN, restoring headcount to 7 and reducing wait time down to 68 minutes (+$450 float cost).
> 3. **Hold and Monitor**: Conserves float pool resources for midnight surges and sets an automated 30-minute re-evaluation threshold."

---

### 5. "What happens when a Charge Nurse overrides the AI recommendation?"
**Answer:**
> "If the clinician disagrees with the AI's primary recommendation, they click **Override Recommendation**, select an alternative plan, and are required to input a clinical rationale (e.g. *'Holding contingency nurse on standby due to simultaneous trauma activations'*). This ensures full accountability and creates a complete record in the immutable audit trail."

---

### 6. "How is data privacy and PHI handled?"
**Answer:**
> "SafeStaff operates purely on synthetic census telemetry and aggregate triage classifications (ESI 1 through ESI 5). There is zero Protected Health Information (PHI) and no connection to real medical records, ensuring complete HIPAA/GDPR alignment by design."

---

### 7. "How is the Compliance Audit Trail structured?"
**Answer:**
> "The audit trail captures every event chronologically with an event ID, timestamp, actor type (HUMAN vs WEBMCP), action title, details, and full JSON payload. It provides filtering (All, Human Signoffs, WebMCP Logs) and can be exported as structured JSON for compliance reviews."

---

### 8. "How can external AI agents or judges interact with this dashboard?"
**Answer:**
> "Any WebMCP-compatible browser agent can query `document.modelContext.getTools()` and invoke functions like `document.modelContext.executeTool('forecast_wait_time', { waitingPatients: 42, availableNurses: 6 })`. We also built an embedded **WebMCP Live Inspector** right into the UI so anyone can test the tools interactively."

---

### 9. "What was the biggest technical challenge during development?"
**Answer:**
> "Designing the strict safety boundary. We had to ensure that while the agent has full visibility to forecast and formulate recommendations, any attempt by an autonomous agent to execute an authorization action is intercepted and logged as `AUTONOMOUS APPROVAL BLOCKED`."

---

### 10. "What are the future enhancements for SafeStaff?"
**Answer:**
> "1. Ingesting synthetic HL7/FHIR hospital streams to coordinate multi-unit float pools (ICU, Med-Surg, Stepdown).
> 2. Predictive 12-hour surge heatmaps factoring in regional EMS ambulance telemetry."
