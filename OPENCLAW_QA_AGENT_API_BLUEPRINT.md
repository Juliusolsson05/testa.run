# OpenClaw as a QA Testing API — Full Build Blueprint

## Why this doc

You want to rebuild your OpenClaw integration in another project, but this time with a clear target:

- OpenClaw acts as your **QA testing API backend**
- You send a website + path + bug rules
- Agent runs autonomous browser QA
- You get back:
  - live thinking/progress feed
  - screenshots while running
  - structured findings/bugs
  - final report

This doc is a practical blueprint for that system.

---

## 1) Product definition (what you are building)

Build a **QA Agent Platform** with these capabilities:

1. **Test Plan Input**
   - target URL
   - required user path(s)
   - optional credentials
   - bug definition / severity rules
   - environment metadata (browser, viewport, locale)

2. **Autonomous Execution**
   - navigates site
   - follows steps
   - validates expectations
   - detects bugs (UI + functional + performance-ish smoke)

3. **Live Streaming Output**
   - progress state events in real time
   - “thinking feed” (safe, redacted summaries)
   - periodic screenshots
   - immediate issue events when a bug is found

4. **Final Outputs**
   - structured findings JSON
   - markdown summary
   - screenshot bundle
   - replayable execution trail

OpenClaw provides the agent runtime, tools, orchestration hooks, and scheduling backbone.

---

## 2) Core architecture

## 2.1 High-level components

1. **Client App (your new project)**
   - dashboard + run creation + live timeline

2. **QA Orchestrator API (your backend)**
   - stores runs
   - validates inputs
   - calls OpenClaw endpoints
   - handles streaming fan-out to frontend

3. **OpenClaw Gateway (VPS)**
   - `/v1/chat/completions` for agent runs
   - `/hooks/agent` for async event-triggered runs
   - `/tools/invoke` (optional control-plane use)
   - browser automation via OpenClaw browser tools

4. **Artifact Storage**
   - screenshots, logs, raw events, final report JSON
   - S3 / R2 / Supabase Storage recommended

5. **Realtime Channel**
   - WebSocket/SSE from your backend to frontend
   - emits run events + screenshot links + findings

## 2.2 Execution model recommendation

Use **async run model**:

- Start test run → enqueue job in your backend
- Backend calls OpenClaw (`/hooks/agent` preferred for fire-and-forget)
- OpenClaw runs test in isolated session
- Agent posts intermediate events via webhook callbacks to your backend
- Backend streams events to UI
- Final report persisted + shown in UI

This scales better than keeping one long synchronous HTTP request open.

---

## 3) OpenClaw endpoint strategy

## 3.1 Endpoints to use

1. `POST /v1/chat/completions`
   - Use for synchronous / short QA checks or debugging

2. `POST /hooks/agent`
   - Use for production async QA runs
   - Trigger isolated agent turn

3. `POST /tools/invoke` (optional)
   - Use sparingly for operational tooling
   - e.g., query sessions/runs status in controlled ways

## 3.2 Session isolation pattern

Use dedicated session key scheme per run, e.g.:

- `qa:run:<runId>`

Benefits:
- clean context per run
- easier traceability
- easier retries/replays

---

## 4) QA run input contract (API schema)

Create a strict run request schema in your backend.

```json
{
  "runId": "uuid",
  "target": {
    "baseUrl": "https://example.com",
    "environment": "prod|staging|preview",
    "viewport": { "width": 1440, "height": 900 },
    "locale": "en-US",
    "timezone": "Europe/Stockholm"
  },
  "auth": {
    "mode": "none|form|cookie|header",
    "username": "optional",
    "passwordSecretRef": "optional-secret-id",
    "otpSecretRef": "optional"
  },
  "journey": {
    "name": "Checkout happy path",
    "steps": [
      { "id": "s1", "action": "goto", "url": "/" },
      { "id": "s2", "action": "click", "selector": "text=Login" },
      { "id": "s3", "action": "fill", "selector": "#email", "valueFrom": "auth.username" },
      { "id": "s4", "action": "fill", "selector": "#password", "valueFrom": "auth.password" },
      { "id": "s5", "action": "click", "selector": "button[type=submit]" }
    ]
  },
  "assertions": [
    { "id": "a1", "type": "url_contains", "value": "/dashboard" },
    { "id": "a2", "type": "element_visible", "selector": "[data-testid='welcome']" }
  ],
  "bugPolicy": {
    "severityRules": {
      "blocker": ["data_loss", "security_exposure", "checkout_broken"],
      "critical": ["core_journey_failure", "login_failure"],
      "major": ["broken_navigation", "api_5xx", "severe_ui_break"],
      "minor": ["copy_issue", "layout_shift_small"],
      "trivial": ["cosmetic"]
    },
    "classifyAsBug": [
      "console_error_unhandled",
      "network_5xx",
      "failed_assertion",
      "visible_js_exception",
      "stuck_loading_over_15s"
    ]
  },
  "outputs": {
    "streamEvents": true,
    "screenshotEveryStep": true,
    "screenshotOnError": true,
    "includeDomSnapshot": true
  }
}
```

---

## 5) Define what counts as a bug (taxonomy)

You need deterministic bug rules so results are consistent.

## 5.1 Bug categories

1. **Functional Bug**
   - expected path fails
   - button action wrong or no-op
   - login/logout broken

2. **Validation/Logic Bug**
   - invalid form accepted
   - valid form rejected
   - wrong calculations shown

3. **UI/UX Bug**
   - element overlap/hide
   - non-clickable CTA
   - broken responsive layout

4. **Performance Smoke Bug**
   - page unusable due to load > threshold
   - key action timeout

5. **Integration/API Bug**
   - API 4xx/5xx in core flow
   - response schema mismatch visible in UI behavior

6. **Security-Surface Bug (basic app-level)**
   - sensitive data visible in client errors
   - auth bypass in obvious path

## 5.2 Severity logic

Make severity deterministic:

- **Blocker**: core business flow impossible (e.g., cannot purchase/login when required)
- **Critical**: major feature unusable for many users
- **Major**: feature degraded but workaround exists
- **Minor**: noticeable but does not block goal
- **Trivial**: cosmetic/no business impact

---

## 6) Real-time stream design

You asked for thinking feed + screenshots + findings in real time.

## 6.1 Event types

Standardize event bus:

```ts
RUN_STARTED
STEP_STARTED
STEP_ACTION
STEP_SCREENSHOT
STEP_ASSERTION_PASSED
STEP_ASSERTION_FAILED
BUG_FOUND
THINKING_UPDATE
NETWORK_ERROR
CONSOLE_ERROR
RUN_WARNING
RUN_FAILED
RUN_COMPLETED
```

## 6.2 Event payload baseline

```json
{
  "runId": "uuid",
  "timestamp": "ISO-8601",
  "type": "BUG_FOUND",
  "stepId": "s5",
  "severity": "critical",
  "message": "Login submit returns 500",
  "screenshotUrl": "https://...",
  "evidence": {
    "url": "https://.../login",
    "selector": "button[type=submit]",
    "console": ["..."],
    "network": [{"url":"...","status":500}]
  }
}
```

## 6.3 “Thinking feed” guidance

Expose **safe summarized thoughts**, not raw chain-of-thought.

Good:
- “Investigating why submit did not redirect”
- “Retrying click with scroll into view”
- “Classified as Critical due to core journey failure”

Avoid:
- secrets
n- raw private prompt internals
- full credentials

---

## 7) Screenshots and evidence strategy

## 7.1 Capture policy

At minimum:

- after each step
- on every assertion failure
- on every bug classification
- at run completion

Optional:
- full-page screenshots on page transitions
- viewport screenshot on interactions

## 7.2 Naming convention

Use deterministic names:

`<runId>/<stepIndex>_<stepId>_<eventType>_<timestamp>.png`

## 7.3 Evidence bundle

For each bug include:

- screenshot URL
- page URL
- step metadata
- minimal DOM excerpt or selector info
- related network/console entries

---

## 8) Credentials and secrets handling

You explicitly want optional email/password support.

## 8.1 Rules

- Never send raw passwords from frontend directly into logs
- Store credentials in secret manager (1Password/Vault/etc)
- API request carries `secretRef`, not value
- Backend resolves secret at execution time
- Redact secrets from streamed events and final reports

## 8.2 Practical pattern

- UI: user selects saved credential set
- Backend: fetch secret values server-side
- Inject into run context just-in-time
- Destroy in-memory references after run

## 8.3 Must-have guardrails

- redact regex in all logs
- disallow screenshots on password field focus if needed
- never echo credentials in prompt or agent messages

---

## 9) Prompt/runtime design for QA agent

Use a stable system-style instruction template for QA runs.

## 9.1 Behavior contract for agent

Agent should always:

1. Follow provided path strictly unless blocked
2. Emit progress events continuously
3. Take screenshots at configured milestones
4. Classify defects using provided bug policy
5. Continue testing after non-blocking bugs
6. Stop only on blocker or hard timeout

## 9.2 Retry rules

Per step retries:
- click/fill actions: retry up to 2 with fallback selector strategy
- waits: bounded explicit waits (no long blind sleeps)
- navigation: timeout + one retry

## 9.3 Determinism

- fixed viewport
- fixed locale/timezone
- optional seeded test data
- stable selectors (`data-testid`) where possible

---

## 10) OpenClaw implementation pattern (practical)

## 10.1 Start run (backend)

1. Create run row in DB: `queued`
2. Build run prompt + config payload
3. Call OpenClaw `/hooks/agent` with:
   - `message`: serialized run brief
   - `sessionKey`: `qa:run:<runId>`
   - `agentId`: e.g. `qa`
   - optional `model`, `thinking`, `timeoutSeconds`
4. Mark run `running`

## 10.2 During run

- Agent produces intermediate updates
- Send updates back via webhook callback endpoint on your backend
- Backend pushes to frontend via WS/SSE

## 10.3 End run

- Persist final findings JSON
- Persist report markdown
- mark run `completed` or `failed`
- notify UI

---

## 11) Data model (DB tables)

Minimum:

1. `qa_runs`
   - id, status, startedAt, finishedAt, targetUrl, env, model, summary

2. `qa_steps`
   - runId, stepId, action, status, startedAt, finishedAt

3. `qa_events`
   - runId, type, payload(json), createdAt

4. `qa_findings`
   - runId, severity, category, title, description, evidence(json), dedupeHash

5. `qa_artifacts`
   - runId, type(screenshot/log/report), url, metadata(json)

6. `qa_credentials_refs`
   - userId, label, provider, secretRef (never raw secret)

---

## 12) API design (your project)

## 12.1 Suggested endpoints

- `POST /api/qa/runs` create run
- `GET /api/qa/runs/:id` run summary
- `GET /api/qa/runs/:id/events` history
- `GET /api/qa/runs/:id/findings` findings
- `GET /api/qa/runs/:id/artifacts` screenshots/reports
- `POST /api/qa/runs/:id/cancel` stop run
- `WS /api/qa/runs/:id/stream` live events

## 12.2 Webhook receiver from OpenClaw side

- `POST /api/qa/openclaw-events`
  - validates signature/token
  - maps to runId/sessionKey
  - stores event and fan-outs to stream

---

## 13) Reliability and failure handling

## 13.1 Timeouts

- global run timeout (e.g. 15–30 min)
- step timeout (e.g. 10–30 sec)
- navigation timeout (e.g. 30 sec)

## 13.2 Retries

- one full-run retry if infra/network fails
- no auto-retry for deterministic assertion failures (those are likely true bugs)

## 13.3 Idempotency

- run creation endpoint should support idempotency key
- event ingestion should dedupe by eventId

## 13.4 Concurrency

- run queue + worker pool
- cap concurrent browser sessions per node

---

## 14) Security hardening checklist (critical)

1. Use HTTPS in front of OpenClaw (no plain public HTTP)
2. Separate tokens:
   - gateway token
   - hooks token
3. Rotate tokens periodically
4. Keep OpenClaw bind loopback where possible + reverse proxy/tunnel
5. Restrict hook routing (`allowedAgentIds`)
6. Keep `allowRequestSessionKey=false` unless needed
7. Restrict `/tools/invoke` policy surface
8. Add IP allowlist/rate limiting at proxy layer
9. Redact secrets in logs/events/screenshots metadata
10. Audit log every external trigger with request ID

---

## 15) QA quality strategy (to avoid noisy false positives)

1. Use explicit assertion DSL and expected outcomes
2. Require 2+ evidence points for high severity where possible
3. Distinguish flaky vs deterministic failures
4. Add baseline visual snapshots for stable pages
5. Add “known issues” suppression list with expiry dates

---

## 16) Suggested phased rollout

## Phase 1 — MVP (1–2 weeks)

- single website run
- static step list
- screenshots + final report
- no live stream (or basic)

## Phase 2 — Realtime + bug taxonomy

- full event stream
- severity rules
- evidence bundle per finding

## Phase 3 — Credentials + auth flows

- secure credential refs
- login journey templates

## Phase 4 — Scale and enterprise hardening

- parallel run workers
- retries, dedupe, run analytics
- policy controls per workspace/team

---

## 17) Example OpenClaw run message template

Use a strict machine-readable + human-readable hybrid prompt:

```md
You are QA Agent.

Mission:
Execute the provided journey on the target site, detect defects, classify severity, and report evidence.

Rules:
- Follow steps in order.
- Emit progress updates after each step.
- Capture screenshot after each step and on failures.
- Use severity rules exactly as provided.
- Do not expose secrets.

Target:
- Base URL: {{baseUrl}}
- Viewport: {{viewport}}
- Locale: {{locale}}

Journey:
{{steps}}

Assertions:
{{assertions}}

Bug policy:
{{bugPolicy}}

Output contract:
1) Stream events continuously
2) Report findings as structured JSON list
3) Final markdown summary
```

---

## 18) What to decide before coding (decision checklist)

1. Sync-only vs async-by-default? (recommend async)
2. WS vs SSE for event stream? (either works; WS richer)
3. Where screenshots live? (S3/R2/Supabase)
4. How strict bug classification should be?
5. How to handle flaky steps?
6. Should run pause on blocker or continue collecting more issues?
7. Which model(s) per run type (fast smoke vs deep analysis)?
8. Max concurrent runs per environment?
9. Who can provide credentials and how are they scoped?
10. What report format do downstream tools need (Jira, Slack, email)?

---

## 19) Recommended default policy for your use case

For a practical high-signal QA agent:

- Run type: async isolated
- Stream: enabled
- Screenshot: every step + on error
- Severity: blocker/critical/major/minor/trivial
- Stop rule: stop on blocker; continue otherwise
- Credentials: secretRef only
- Report: JSON + markdown + screenshot links
- Integrations: Jira push optional after human review

---

## 20) Final take

OpenClaw is a strong fit as the runtime/API layer for this QA agent product **if** you treat it as:

- secure agent gateway
- deterministic run orchestrator
- event producer (not just chat)

The key to success is not just “autonomous browser control” — it’s:

- strict input schema
- deterministic bug taxonomy
- evidence-rich outputs
- reliable realtime event pipeline
- strong security around secrets and API exposure

If you want, next step I can write:

1) a concrete `qa-agent` OpenClaw config template,
2) exact backend endpoint contracts (TypeScript interfaces), and
3) first-pass implementation tasks you can drop directly into Jira.
