export type RunStatus     = "passed" | "failed" | "running" | "warning"
export type RunStepStatus = "passed" | "failed" | "warning"

export type RunStep = {
  id: string
  index: number
  action: string
  target: string
  description: string
  reasoning: string
  duration: string
  status: RunStepStatus
  nodeId: string
}

export type Run = {
  id: string        // internal key
  label: string     // display hash e.g. #a3f7c1
  name: string
  category: "security" | "buttons" | "ux"
  url: string
  date: string
  ago: string
  duration: string
  status: RunStatus
  steps: RunStep[]
}

// ─── Security Audit ───────────────────────────────────────────────────────────

const securitySteps: RunStep[] = [
  {
    id: "sec-1", index: 1, action: "navigate", nodeId: "1",
    target: "https://timeedit.com",
    description: "Navigated to landing page in a clean context.",
    reasoning: "Agent opened a fresh browser context with no cookies, cache, or extensions to simulate an unauthenticated attacker. HTTP 200 received. TLS 1.3 confirmed.",
    duration: "0.9s", status: "passed",
  },
  {
    id: "sec-2", index: 2, action: "audit", nodeId: "1",
    target: "HTTP response headers",
    description: "Checked for Content-Security-Policy header.",
    reasoning: "Agent inspected the response headers for the landing page. No Content-Security-Policy header was present. Without CSP, the site is susceptible to XSS payloads injected via third-party scripts or DOM manipulation. Flagged as error.",
    duration: "0.2s", status: "failed",
  },
  {
    id: "sec-3", index: 3, action: "audit", nodeId: "1",
    target: "Strict-Transport-Security header",
    description: "Verified HSTS header configuration.",
    reasoning: "HSTS header is present but max-age is set to 300 seconds — far below the recommended minimum of 31536000 (1 year). This means the HSTS protection expires in 5 minutes, offering minimal protection against SSL-stripping attacks.",
    duration: "0.1s", status: "warning",
  },
  {
    id: "sec-4", index: 4, action: "screenshot", nodeId: "1",
    target: "document",
    description: "Captured landing page state.",
    reasoning: "Screenshot taken to document the landing page as seen during the security audit. Provides visual evidence of the state at this point in the test.",
    duration: "0.3s", status: "passed",
  },
  {
    id: "sec-5", index: 5, action: "navigate", nodeId: "2",
    target: "https://timeedit.com/login",
    description: "Navigated to login page.",
    reasoning: "The login page is a high-value target for security testing — it handles authentication credentials and is a common attack vector. Agent navigated directly via URL to bypass the CTA click flow.",
    duration: "0.7s", status: "passed",
  },
  {
    id: "sec-6", index: 6, action: "audit", nodeId: "2",
    target: "form#login-form",
    description: "Inspected login form for CSRF protection.",
    reasoning: "Agent parsed the login form's HTML and inspected all hidden input fields and request headers on submission. No CSRF token was found in the form body, and the server did not require a custom header for state-changing POST requests. A CSRF attack from a malicious third-party site would succeed.",
    duration: "0.4s", status: "failed",
  },
  {
    id: "sec-7", index: 7, action: "audit", nodeId: "2",
    target: "Set-Cookie response header",
    description: "Checked session cookie security flags.",
    reasoning: "After form submission the agent inspected the Set-Cookie header. The session cookie has HttpOnly set (good) but is missing the Secure flag, meaning it can be transmitted over plain HTTP. Combined with the short HSTS max-age, this is a realistic risk on networks that can intercept HTTP traffic.",
    duration: "0.2s", status: "warning",
  },
  {
    id: "sec-8", index: 8, action: "screenshot", nodeId: "2",
    target: "document",
    description: "Captured login page with form visible.",
    reasoning: "Screenshot taken immediately after audit to document the login form state including field layout and visible UI elements.",
    duration: "0.3s", status: "passed",
  },
  {
    id: "sec-9", index: 9, action: "navigate", nodeId: "3",
    target: "https://timeedit.com/dashboard",
    description: "Navigated to dashboard after authentication.",
    reasoning: "Agent submitted valid credentials to reach the authenticated dashboard. This is necessary to test client-side storage of sensitive data which only appears post-login.",
    duration: "4.2s", status: "passed",
  },
  {
    id: "sec-10", index: 10, action: "audit", nodeId: "3",
    target: "localStorage / sessionStorage",
    description: "Scanned client-side storage for sensitive data.",
    reasoning: "Agent executed a script to enumerate all localStorage and sessionStorage keys. Found key 'auth_token' storing a raw JWT in localStorage. JWTs in localStorage are accessible to any JavaScript on the page — a successful XSS attack could exfiltrate the token and allow account takeover without needing the user's password.",
    duration: "0.2s", status: "failed",
  },
  {
    id: "sec-11", index: 11, action: "screenshot", nodeId: "3",
    target: "document",
    description: "Captured authenticated dashboard state.",
    reasoning: "Final screenshot of the authenticated dashboard to document the end state of the security audit run.",
    duration: "0.4s", status: "passed",
  },
]

// ─── Button & Interaction Testing ─────────────────────────────────────────────

const buttonSteps: RunStep[] = [
  {
    id: "btn-1", index: 1, action: "navigate", nodeId: "1",
    target: "https://timeedit.com",
    description: "Navigated to landing page.",
    reasoning: "Agent started the button testing journey from the landing page in a standard 1440×900 viewport. Cookies cleared to test unauthenticated state.",
    duration: "0.8s", status: "passed",
  },
  {
    id: "btn-2", index: 2, action: "audit", nodeId: "1",
    target: "document",
    description: "Enumerated all interactive elements on landing page.",
    reasoning: "Agent queried all button, a, input, select and [role='button'] elements. Found 7 interactive elements: 2 nav links, 1 CTA button, 1 login link, 1 hamburger menu, 1 demo form input, and 1 submit button.",
    duration: "0.2s", status: "passed",
  },
  {
    id: "btn-3", index: 3, action: "click", nodeId: "1",
    target: "button.cta-primary",
    description: "Clicked primary CTA 'Get Started'.",
    reasoning: "Agent clicked the CTA button and confirmed navigation to /login was triggered. Click response time was under 100ms. No JavaScript errors were thrown.",
    duration: "0.2s", status: "passed",
  },
  {
    id: "btn-4", index: 4, action: "audit", nodeId: "1",
    target: "button.cta-primary",
    description: "Checked CTA for accessible name.",
    reasoning: "The CTA button has visible text 'Get Started' but no aria-label or aria-describedby. For screen reader users the accessible name is derived solely from the text content, which is technically valid — however the button also lacks a role description explaining that it starts a free trial. Flagged as warning for improvement, not a hard failure.",
    duration: "0.2s", status: "warning",
  },
  {
    id: "btn-5", index: 5, action: "screenshot", nodeId: "1",
    target: "document",
    description: "Captured CTA interaction state.",
    reasoning: "Screenshot taken to capture the CTA button's visual state before navigation.",
    duration: "0.3s", status: "passed",
  },
  {
    id: "btn-6", index: 6, action: "navigate", nodeId: "2",
    target: "https://timeedit.com/login",
    description: "Navigated to login page.",
    reasoning: "Agent navigated to the login page to test form submission interactions and keyboard accessibility of the submit button.",
    duration: "0.6s", status: "passed",
  },
  {
    id: "btn-7", index: 7, action: "fill", nodeId: "2",
    target: "input[type='email']",
    description: "Filled email field.",
    reasoning: "Agent typed test credentials using simulated keystrokes. Live validation ran on each keystroke — no errors shown during typing.",
    duration: "0.3s", status: "passed",
  },
  {
    id: "btn-8", index: 8, action: "fill", nodeId: "2",
    target: "input[type='password']",
    description: "Filled password field with an intentionally incorrect value.",
    reasoning: "Agent deliberately used wrong credentials to trigger the error state and observe the form's error handling behaviour on submit.",
    duration: "0.2s", status: "passed",
  },
  {
    id: "btn-9", index: 9, action: "click", nodeId: "2",
    target: "button[type='submit']",
    description: "Submitted login form with invalid credentials.",
    reasoning: "Agent clicked submit and observed the response. Instead of showing an inline error message the form triggered a full page reload, returning the user to a blank login form with no error message. All field content was lost. This is a significant UX failure — users do not know what went wrong and must retype their email.",
    duration: "0.9s", status: "failed",
  },
  {
    id: "btn-10", index: 10, action: "audit", nodeId: "2",
    target: "button[type='submit']",
    description: "Verified keyboard focus ring on submit button.",
    reasoning: "Agent tabbed to the submit button and inspected its CSS outline. The button's focus ring is removed via outline:none with no replacement style. Keyboard users cannot visually identify when the submit button is focused, making it effectively unusable for keyboard-only navigation.",
    duration: "0.2s", status: "warning",
  },
  {
    id: "btn-11", index: 11, action: "screenshot", nodeId: "2",
    target: "document",
    description: "Captured login form in post-submit state.",
    reasoning: "Screenshot taken after the failed submission to document the blank form with no error feedback.",
    duration: "0.3s", status: "passed",
  },
  {
    id: "btn-12", index: 12, action: "navigate", nodeId: "3",
    target: "https://timeedit.com/dashboard",
    description: "Navigated to dashboard with valid session.",
    reasoning: "Agent re-authenticated with valid credentials to reach the dashboard for button accessibility testing.",
    duration: "4.1s", status: "passed",
  },
  {
    id: "btn-13", index: 13, action: "audit", nodeId: "3",
    target: "button#logout",
    description: "Tested keyboard reachability of logout button.",
    reasoning: "Agent tabbed through all interactive elements on the dashboard in DOM order. The logout button is rendered inside a CSS-positioned dropdown that is always present in the DOM but set to display:none. Because it is hidden via display:none (not visibility:hidden), it is correctly removed from the tab order when closed — however the agent found no keyboard mechanism to open the dropdown, making logout unreachable without a mouse.",
    duration: "0.5s", status: "failed",
  },
  {
    id: "btn-14", index: 14, action: "audit", nodeId: "3",
    target: "button#export-data",
    description: "Verified export button disabled state feedback.",
    reasoning: "The 'Export' button is non-functional when no data rows are selected. The agent cleared all selections and clicked the button — it appeared to accept the click (no visual change, no error message). The button has no disabled attribute and no aria-disabled, giving no feedback that the action is unavailable.",
    duration: "0.3s", status: "warning",
  },
  {
    id: "btn-15", index: 15, action: "screenshot", nodeId: "3",
    target: "document",
    description: "Captured final dashboard button state.",
    reasoning: "Final screenshot capturing the dashboard with the export button and logout area visible.",
    duration: "0.4s", status: "passed",
  },
]

// ─── UX & Accessibility Review ────────────────────────────────────────────────

const uxSteps: RunStep[] = [
  {
    id: "ux-1", index: 1, action: "navigate", nodeId: "1",
    target: "https://timeedit.com",
    description: "Navigated to landing page in a clean context.",
    reasoning: "Entry point of the UX test journey. Agent opened a fresh browser context with no cookies or cached assets to simulate a first-time visitor. Viewport set to 1440×900 (desktop default). Page loaded successfully with HTTP 200.",
    duration: "0.9s", status: "passed",
  },
  {
    id: "ux-2", index: 2, action: "scroll", nodeId: "1",
    target: "window",
    description: "Scrolled to 40% of page height to expose hero section.",
    reasoning: "The agent scrolled to bring the primary CTA into the visible viewport before auditing it. This ensures any lazy-loaded content in the hero area is fully rendered before inspection.",
    duration: "0.3s", status: "passed",
  },
  {
    id: "ux-3", index: 3, action: "audit", nodeId: "1",
    target: "document",
    description: "Ran accessibility and contrast audit on landing page.",
    reasoning: "Before proceeding the agent ran a full DOM accessibility tree snapshot and WCAG contrast check. Two issues were detected: low contrast on the CTA button (3.2:1 vs 4.5:1 required) and a missing alt attribute on the hero image. Both flagged for review.",
    duration: "0.4s", status: "warning",
  },
  {
    id: "ux-4", index: 4, action: "click", nodeId: "1",
    target: "button.cta-primary",
    description: "Clicked the primary 'Get Started' CTA button.",
    reasoning: "The agent identified the main conversion action on the landing page. Click event dispatched; the page initiated a navigation to /login. No console errors were recorded during this interaction.",
    duration: "0.2s", status: "passed",
  },
  {
    id: "ux-5", index: 5, action: "wait", nodeId: "2",
    target: "form#login-form",
    description: "Waited for login form to appear in the DOM.",
    reasoning: "After the CTA click the agent waited for the login form to be present and visible. The form appeared after 620ms, which is within acceptable range.",
    duration: "0.6s", status: "passed",
  },
  {
    id: "ux-6", index: 6, action: "audit", nodeId: "2",
    target: "form#login-form",
    description: "Audited login form for accessibility issues.",
    reasoning: "The agent inspected all form controls for associated labels. The email and password inputs have correct <label for=…> bindings. However a search input in the page header has no programmatic label — only a placeholder. Flagged as warning.",
    duration: "0.2s", status: "warning",
  },
  {
    id: "ux-7", index: 7, action: "fill", nodeId: "2",
    target: "input[type='email']",
    description: "Filled email field with test account credentials.",
    reasoning: "Agent typed the test email using simulated keystrokes to trigger all attached event listeners including live validation. No validation errors appeared.",
    duration: "0.3s", status: "passed",
  },
  {
    id: "ux-8", index: 8, action: "fill", nodeId: "2",
    target: "input[type='password']",
    description: "Filled password field.",
    reasoning: "Password typed using simulated keystrokes. The field masked input correctly. No autocomplete popups or overlays interfered.",
    duration: "0.2s", status: "passed",
  },
  {
    id: "ux-9", index: 9, action: "click", nodeId: "2",
    target: "button[type='submit']",
    description: "Submitted the login form.",
    reasoning: "Agent clicked submit and measured response time via the Performance API. POST /auth/login was sent. The agent waited up to 8s for navigation. P95 response time 4.1s — exceeds the 3s SLA.",
    duration: "4.1s", status: "failed",
  },
  {
    id: "ux-10", index: 10, action: "wait", nodeId: "3",
    target: "#dashboard-root",
    description: "Waited for dashboard root element to render.",
    reasoning: "Navigation to /dashboard completed but the main container took an additional 6.8s to reach LCP. Three sequential XHR requests in the network timeline could be parallelised. Marked failed — exceeds the 4s render budget.",
    duration: "6.8s", status: "failed",
  },
  {
    id: "ux-11", index: 11, action: "resize", nodeId: "3",
    target: "window",
    description: "Resized viewport to 1280×900 to test responsive layout.",
    reasoning: "The agent ran a responsive layout check at the 1280px breakpoint, a common screen width for 13-inch laptops. Resize performed after the dashboard had fully loaded to isolate layout issues from load-time issues.",
    duration: "0.1s", status: "passed",
  },
  {
    id: "ux-12", index: 12, action: "audit", nodeId: "3",
    target: ".analytics-widget",
    description: "Checked analytics widget for overflow and clipping.",
    reasoning: "Agent used getBoundingClientRect on the widget and its parent container. The widget's right edge exceeded the parent's by 14px. The bug is specific to exactly 1280px — 1279px and 1281px both render correctly.",
    duration: "0.3s", status: "failed",
  },
  {
    id: "ux-13", index: 13, action: "screenshot", nodeId: "3",
    target: "document",
    description: "Captured final screenshot and completed run.",
    reasoning: "Full-page screenshot captured to provide visual evidence of the state at completion. All detected issues have been logged. 2 errors and 2 warnings found.",
    duration: "0.4s", status: "passed",
  },
]

// ─── Assembled runs ───────────────────────────────────────────────────────────

export const runs: Run[] = [
  {
    id: "run-sec-1",
    label: "#a3f7c1",
    name: "Security Audit",
    category: "security",
    url: "timeedit.com",
    date: "2026-02-21",
    ago: "2m ago",
    duration: "8.7s",
    status: "running",
    steps: securitySteps,
  },
  {
    id: "run-btn-1",
    label: "#f7b3d1",
    name: "Button & Interaction Test",
    category: "buttons",
    url: "timeedit.com",
    date: "2026-02-21",
    ago: "1h ago",
    duration: "9.6s",
    status: "warning",
    steps: buttonSteps,
  },
  {
    id: "run-ux-1",
    label: "#c9a2e3",
    name: "UX & Accessibility Review",
    category: "ux",
    url: "timeedit.com",
    date: "2026-02-20",
    ago: "1d ago",
    duration: "14.3s",
    status: "warning",
    steps: uxSteps,
  },
]

// Legacy flat export kept for any consumers that used it
export const runSteps = runs.flatMap((r) => r.steps)
