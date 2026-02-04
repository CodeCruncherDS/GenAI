Capstones Projects to be implemented

## Field Intelligence Copilot
A mobile-first copilot that captures onsite media, retrieves SOPs, spins workflow agents, and logs eval-ready evidence.

### Capture → Multimodal Gateway → RAG Service → AgentKit Workflow → Codex Form Auto-fill → Eval Logger
#### End-to-End Flow
Technician captures video/audio and syncs via Realtime session
Transcripts + media are chunked, embedded, and stored in the RAG estate
AgentKit workflow selects remediation tools (tickets, orders, alerts)
Codex sidecar fills compliance forms and infrastructure updates
Nightly evals grade coverage, accuracy, and safety before promotion
#### Requirements
• Include bilingual voice channel with fallback text
• Surface citations for every SOP reference
• Integrate at least two tools (ticketing + inventory)
• Provide instructor-ready runbook documenting deployment
#### Evaluation Rubric
• Coverage: ≥30% scenes annotated with SOP links
• Action Accuracy: ≥80% eval-approved resolutions
• Multimodal Clarity: transcripts + snapshots stored in repo
• Observability: traces + eval IDs viewable in Instructor Console
• UX Polish: mobile-friendly, offline queue, status indicators


## Autonomous Builder Control Tower
An instructor console that fuses modules, labs, evals, and agents into a single automation and scoring surface.

### Instructor Console → Metrics Aggregator → Agents (Planner/Executor) → RAG & Evals Pipelines → Codex Briefing Generator → Realtime Narrator
End-to-End Flow
Instructor triggers a scenario (e.g., RAG regression)
Planner agent gathers module metrics via APIs
Executor agent runs automations (redeploy, rerun evals, notify)
RAG/Evals results feed Codex summarizer for human briefing
Realtime narrator delivers spoken recap to the cohort
####  Requirements
• Display module + lab health cards with eval deltas
• Allow instructor overrides + manual grading inputs
• Integrate Realtime assistant for Q&A
• Expose exportable scoring reports
#### Evaluation Rubric
• Automation Depth: >35% of tasks run via agents
• Accuracy: metrics reflect live module data
• Instructor UX: <2 clicks to access labs, evals, capstones
• Resilience: failure mode + retry strategy documented