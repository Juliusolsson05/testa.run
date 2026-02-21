export type IssueSeverity = "error" | "warning"
export type IssueStatus = "open" | "resolved"

export type Issue = {
  id: string
  nodeId: string
  title: string
  description: string
  reasoning: string
  severity: IssueSeverity
  status: IssueStatus
  element: string
}

export const issues: Issue[] = [
  {
    id: "iss-1",
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
    nodeId: "3",
    title: "Widget overflow at 1280px",
    description: "Analytics widget clips outside its container at exactly 1280px viewport width.",
    reasoning:
      "The agent resized the viewport to 1280px wide — a common breakpoint for 13-inch laptops — and observed the analytics chart widget overflowing its parent card by 14px on the right side. The chart library (Recharts) is rendering at a fixed width of 1294px derived from an incorrect percentage calculation when the sidebar is collapsed. The issue does not reproduce at 1279px or 1281px, suggesting a precise off-by-one in the responsive breakpoint logic. At 1440px and above the layout is correct.",
    severity: "warning",
    status: "open",
    element: ".analytics-widget",
  },
]
