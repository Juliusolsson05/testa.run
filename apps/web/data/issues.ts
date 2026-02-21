export type IssueSeverity = "error" | "warning"
export type IssueStatus   = "open" | "resolved"

export type Issue = {
  id: string
  runId: string
  nodeId: string
  title: string
  description: string
  reasoning: string
  severity: IssueSeverity
  status: IssueStatus
  element: string
}

export const issues: Issue[] = [

  // ── UX & Accessibility Review (run-ux-1) ──────────────────────────────────

  {
    id: "iss-1",
    runId: "run-ux-1",
    nodeId: "1",
    title: "Low contrast on CTA",
    description: "Primary CTA button fails WCAG AA contrast ratio (3.2:1 vs required 4.5:1).",
    reasoning:
      "The agent computed the contrast ratio between the button label (#ffffff) and its background (#5b9cf6) using the WCAG 2.1 relative luminance formula. The result of 3.2:1 falls below the 4.5:1 minimum for normal text. Users with low vision or colour deficiency are likely to struggle reading this button, especially on high-glare screens. Flagged as warning rather than error because the element is large enough that WCAG AA Large (3:1) is technically satisfied, but the button copy is 14px — below the 18px large-text threshold.",
    severity: "warning",
    status: "open",
    element: "button.cta-primary",
  },
  {
    id: "iss-2",
    runId: "run-ux-1",
    nodeId: "1",
    title: "Missing alt text on hero",
    description: "Hero image has no alt attribute, causing screen reader failures.",
    reasoning:
      "During DOM inspection the agent found an <img> tag with src='/hero.png' and no alt attribute present. Screen readers will either skip the image silently or announce the file path verbatim, neither of which conveys meaning. The image is the first prominent visual on the page and appears to depict the product in use — making it informational rather than decorative, which would require alt=\"\". This was resolved in the follow-up deploy by adding alt='Product dashboard showing a live test run'.",
    severity: "warning",
    status: "resolved",
    element: "#hero-image",
  },
  {
    id: "iss-3",
    runId: "run-ux-1",
    nodeId: "2",
    title: "Login timeout > 3s",
    description: "Authentication POST request exceeds 3s SLA (measured 4.1s at P95).",
    reasoning:
      "The agent submitted valid credentials and measured time-to-response on the POST /auth/login endpoint using the browser's Performance API. At P95 over 10 sampled runs the response took 4.1s, consistently exceeding the 3s SLA defined in the test config. Network conditions were throttled to 'Fast 4G' (40 Mbps down, 20ms RTT) to simulate a realistic mobile user. The delay appears server-side — TTFB alone accounts for 3.8s — suggesting a cold-start or unindexed DB query on the authentication path.",
    severity: "error",
    status: "open",
    element: "form#login-form",
  },
  {
    id: "iss-4",
    runId: "run-ux-1",
    nodeId: "2",
    title: "Form label not bound",
    description: "Search input is missing a bound <label> element; for/id pairing absent.",
    reasoning:
      "The agent ran an accessibility tree audit on the login page and detected a text input with placeholder='Search…' that has no programmatically associated label. The input has id='site-search' but no <label for='site-search'> exists in the DOM, and aria-label / aria-labelledby are also absent. Placeholder text alone is not an accessible label — it disappears on input and is not reliably announced by all screen readers. Marked resolved after a <label> element was added in the subsequent patch.",
    severity: "warning",
    status: "resolved",
    element: "input[type=\"search\"]",
  },
  {
    id: "iss-5",
    runId: "run-ux-1",
    nodeId: "3",
    title: "Dashboard render lag",
    description: "Initial dashboard paint takes 6.8s on throttled 4G (budget: 4s).",
    reasoning:
      "After successful login the agent navigated to /dashboard and recorded Largest Contentful Paint (LCP) via PerformanceObserver. LCP settled at 6.8s under Fast 4G throttling. Waterfall analysis shows three sequential blocking API calls — /api/widgets, /api/recent-activity, and /api/user-stats — each waiting for the previous to complete before initiating. Parallelising these requests via Promise.all would reduce LCP to an estimated 2.1s. Additionally, three 400 KB uncompressed JS bundles are loaded synchronously in <head>, adding ~1.4s of parse time.",
    severity: "error",
    status: "open",
    element: "#dashboard-root",
  },
  {
    id: "iss-6",
    runId: "run-ux-1",
    nodeId: "3",
    title: "Widget overflow at 1280px",
    description: "Analytics widget clips outside its container at exactly 1280px viewport width.",
    reasoning:
      "The agent resized the viewport to 1280px wide — a common breakpoint for 13-inch laptops — and observed the analytics chart widget overflowing its parent card by 14px on the right side. The chart library (Recharts) is rendering at a fixed width of 1294px derived from an incorrect percentage calculation when the sidebar is collapsed. The issue does not reproduce at 1279px or 1281px, suggesting a precise off-by-one in the responsive breakpoint logic. At 1440px and above the layout is correct.",
    severity: "warning",
    status: "open",
    element: ".analytics-widget",
  },

  // ── Security Audit (run-sec-1) ─────────────────────────────────────────────

  {
    id: "iss-7",
    runId: "run-sec-1",
    nodeId: "1",
    title: "Missing Content-Security-Policy",
    description: "No CSP header is sent with the landing page response, leaving the site open to XSS.",
    reasoning:
      "Agent inspected all HTTP response headers for the landing page. Content-Security-Policy was completely absent. Without CSP, any injected script — via a compromised third-party CDN, a DOM-based XSS, or a malicious browser extension — can execute with full page privileges. A restrictive default-src 'self' policy should be added as a baseline, with specific allowlists for necessary CDN resources.",
    severity: "error",
    status: "open",
    element: "HTTP response headers",
  },
  {
    id: "iss-8",
    runId: "run-sec-1",
    nodeId: "1",
    title: "HSTS max-age too short",
    description: "Strict-Transport-Security max-age is 300s (5 min) — recommended minimum is 1 year.",
    reasoning:
      "The HSTS header is present, which is good, but its max-age of 300 seconds provides negligible protection. A browser will only enforce HTTPS for 5 minutes after the last visit. An attacker performing an SSL-strip attack on a returning visitor would succeed if the user hasn't visited the site in the past 5 minutes. The max-age should be set to at least 31536000 (1 year), and includeSubDomains should be added.",
    severity: "warning",
    status: "open",
    element: "Strict-Transport-Security header",
  },
  {
    id: "iss-9",
    runId: "run-sec-1",
    nodeId: "2",
    title: "CSRF token absent on login form",
    description: "Login form submits without a CSRF token; cross-site request forgery is possible.",
    reasoning:
      "Agent parsed all hidden inputs in the login form and inspected POST request headers on submission. No CSRF token was found in the request body, and no custom header (e.g. X-Requested-With) was required. The server accepted the request from a cross-origin context in agent testing. An attacker hosting a malicious page could silently submit the login form on behalf of a victim, or — more critically — abuse any authenticated state-changing endpoint that shares this lack of CSRF protection.",
    severity: "error",
    status: "open",
    element: "form#login-form",
  },
  {
    id: "iss-10",
    runId: "run-sec-1",
    nodeId: "2",
    title: "Session cookie missing Secure flag",
    description: "The session cookie is transmitted over HTTP due to missing Secure flag.",
    reasoning:
      "After authentication the Set-Cookie header was inspected. The session cookie has HttpOnly (protects against XSS-based cookie theft), but the Secure flag is absent. This means the browser will send the cookie over plain HTTP connections. Combined with the short HSTS max-age, a network-level attacker performing SSL stripping can intercept the session cookie in the first HTTP request made after the HSTS grace period expires.",
    severity: "warning",
    status: "open",
    element: "Set-Cookie: session",
  },
  {
    id: "iss-11",
    runId: "run-sec-1",
    nodeId: "3",
    title: "JWT stored in localStorage",
    description: "Auth token persisted in localStorage is accessible to any JavaScript on the page.",
    reasoning:
      "Agent executed localStorage.getItem enumeration after login and found the key 'auth_token' containing a raw JWT with a 30-day expiry. localStorage is accessible to any JavaScript running on the origin, including scripts injected via XSS. An attacker exploiting any XSS vulnerability on the domain can silently exfiltrate this token and use it to impersonate the user for up to 30 days without further interaction. Tokens should be stored in HttpOnly cookies instead.",
    severity: "error",
    status: "open",
    element: "localStorage[auth_token]",
  },

  // ── Button & Interaction Test (run-btn-1) ──────────────────────────────────

  {
    id: "iss-12",
    runId: "run-btn-1",
    nodeId: "1",
    title: "CTA missing role description",
    description: "Primary CTA has no aria-label or description clarifying it starts a free trial.",
    reasoning:
      "The CTA button's accessible name is 'Get Started' derived from its text content, which is valid. However screen reader users have no indication that activating this button begins a free trial sign-up flow. An aria-description='Start your 14-day free trial' would provide critical context. Without it, users who navigate by button role may not understand the consequence of activating this element, particularly since 'Get Started' is generic and context-dependent.",
    severity: "warning",
    status: "open",
    element: "button.cta-primary",
  },
  {
    id: "iss-13",
    runId: "run-btn-1",
    nodeId: "2",
    title: "Form submit triggers full page reload on error",
    description: "Invalid login clears the form and reloads the page with no error message.",
    reasoning:
      "Agent submitted the login form with intentionally incorrect credentials. The server returned a 401, which triggered a full page reload via a traditional form POST rather than an async fetch. The reloaded page rendered a blank login form — no error toast, no inline field error, no HTTP-level error message. Users cannot determine whether their email or password was wrong, and must retype their email from scratch. This should be replaced with an async submission that shows an inline error without clearing the form.",
    severity: "error",
    status: "open",
    element: "button[type='submit']",
  },
  {
    id: "iss-14",
    runId: "run-btn-1",
    nodeId: "3",
    title: "Logout button unreachable via keyboard",
    description: "Logout is inside a display:none dropdown with no keyboard trigger to open it.",
    reasoning:
      "Agent tabbed through the entire dashboard in DOM order. The logout button exists in the DOM inside a user-menu dropdown but is hidden via display:none when the menu is closed. While display:none correctly removes it from the tab order, the only way to open the dropdown is by clicking the user avatar — there is no keyboard event listener on the avatar element, no aria-haspopup attribute, and no keyboard shortcut documented. Keyboard-only users have no path to log out.",
    severity: "error",
    status: "open",
    element: "button#logout",
  },
  {
    id: "iss-15",
    runId: "run-btn-1",
    nodeId: "3",
    title: "Export button gives no disabled feedback",
    description: "Export button accepts clicks with no rows selected but performs no action or feedback.",
    reasoning:
      "Agent deselected all table rows and clicked the Export button. The button appeared interactive (cursor:pointer, normal opacity) and accepted the click event without any visual change, toast notification, or error message. No network request was initiated. Users have no way to know the action is unavailable. The button should either be visually disabled (disabled attribute + aria-disabled) with a tooltip explaining why, or show an immediate error toast explaining that a row selection is required.",
    severity: "warning",
    status: "open",
    element: "button#export-data",
  },
]
