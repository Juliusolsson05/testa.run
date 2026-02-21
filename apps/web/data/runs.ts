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

export const runSteps: RunStep[] = [
  {
    id: "step-1",
    index: 1,
    action: "navigate",
    target: "https://timeedit.com",
    description: "Navigated to the landing page.",
    reasoning:
      "Entry point of the test journey. The agent opened a fresh browser context with no cookies or cached assets to simulate a first-time visitor. Viewport was set to 1440×900 (desktop default). Page loaded successfully with HTTP 200.",
    duration: "0.9s",
    status: "passed",
    nodeId: "1",
  },
  {
    id: "step-2",
    index: 2,
    action: "scroll",
    target: "window",
    description: "Scrolled to 40% of page height to expose hero section.",
    reasoning:
      "The agent scrolled to bring the primary CTA into the visible viewport before interacting with it. This mimics natural user behaviour and ensures any lazy-loaded content in the hero area is fully rendered before the next action.",
    duration: "0.3s",
    status: "passed",
    nodeId: "1",
  },
  {
    id: "step-3",
    index: 3,
    action: "audit",
    target: "document",
    description: "Ran accessibility and contrast audit on landing page.",
    reasoning:
      "Before proceeding the agent ran a full DOM accessibility tree snapshot and WCAG contrast check. Two issues were detected: low contrast on the CTA button and a missing alt attribute on the hero image. Both flagged for review. The agent decided to continue the journey rather than halt, as neither issue prevents navigation.",
    duration: "0.4s",
    status: "warning",
    nodeId: "1",
  },
  {
    id: "step-4",
    index: 4,
    action: "click",
    target: "button.cta-primary",
    description: "Clicked the primary 'Get Started' CTA button.",
    reasoning:
      "The agent identified the main conversion action on the landing page. The button was visible, enabled, and had pointer cursor. Click event dispatched; the page initiated a navigation to /login. No console errors were recorded during this interaction.",
    duration: "0.2s",
    status: "passed",
    nodeId: "1",
  },
  {
    id: "step-5",
    index: 5,
    action: "wait",
    target: "form#login-form",
    description: "Waited for login form to appear in the DOM.",
    reasoning:
      "After the CTA click the agent waited for the login form to be present and visible before proceeding. The form appeared after 620ms, which is within acceptable range. The agent confirmed the form has email and password fields before continuing.",
    duration: "0.6s",
    status: "passed",
    nodeId: "2",
  },
  {
    id: "step-6",
    index: 6,
    action: "audit",
    target: "form#login-form",
    description: "Audited login form for accessibility issues.",
    reasoning:
      "The agent inspected all form controls for associated labels. The email and password inputs have correct <label for=…> bindings. However a search input in the page header has no programmatic label — only a placeholder. This was flagged as a warning and added to the issue list.",
    duration: "0.2s",
    status: "warning",
    nodeId: "2",
  },
  {
    id: "step-7",
    index: 7,
    action: "fill",
    target: "input[type='email']",
    description: "Filled email field with test account credentials.",
    reasoning:
      "The agent typed the configured test email address into the email input using simulated keystrokes (not value injection) to trigger all attached event listeners, including live validation. No validation errors appeared.",
    duration: "0.3s",
    status: "passed",
    nodeId: "2",
  },
  {
    id: "step-8",
    index: 8,
    action: "fill",
    target: "input[type='password']",
    description: "Filled password field.",
    reasoning:
      "Password typed using simulated keystrokes. The field masked input correctly. No autocomplete popups or overlays interfered with the interaction.",
    duration: "0.2s",
    status: "passed",
    nodeId: "2",
  },
  {
    id: "step-9",
    index: 9,
    action: "click",
    target: "button[type='submit']",
    description: "Submitted the login form.",
    reasoning:
      "The agent clicked the submit button and immediately began measuring response time via the Performance API. The POST /auth/login request was sent. The agent waited up to 8s for navigation to complete.",
    duration: "4.1s",
    status: "failed",
    nodeId: "2",
  },
  {
    id: "step-10",
    index: 10,
    action: "wait",
    target: "#dashboard-root",
    description: "Waited for dashboard root element to render.",
    reasoning:
      "Navigation to /dashboard completed but the main content container took an additional 6.8s to reach LCP. The agent observed three sequential XHR requests in the network timeline that could be parallelised. Marked as failed — exceeds the 4s render budget defined in test config.",
    duration: "6.8s",
    status: "failed",
    nodeId: "3",
  },
  {
    id: "step-11",
    index: 11,
    action: "resize",
    target: "window",
    description: "Resized viewport to 1280×900 to test responsive layout.",
    reasoning:
      "The agent ran a responsive layout check at the 1280px breakpoint, a common screen width for 13-inch laptops. The resize was performed after the dashboard had fully loaded to isolate layout issues from load-time issues.",
    duration: "0.1s",
    status: "passed",
    nodeId: "3",
  },
  {
    id: "step-12",
    index: 12,
    action: "audit",
    target: ".analytics-widget",
    description: "Checked analytics widget for overflow and clipping.",
    reasoning:
      "The agent used getBoundingClientRect on the widget and its parent container. The widget's right edge exceeded the parent's right edge by 14px. This overflow is hidden by CSS overflow:hidden on the parent, causing the chart to be visually clipped. The bug is specific to exactly 1280px — 1279px and 1281px both render correctly.",
    duration: "0.3s",
    status: "failed",
    nodeId: "3",
  },
  {
    id: "step-13",
    index: 13,
    action: "screenshot",
    target: "document",
    description: "Captured final screenshot and completed run.",
    reasoning:
      "The agent captured a full-page screenshot at the end of the test run to provide visual evidence of the state at completion. All detected issues have been logged. Run marked as 'passed with warnings' — 2 errors and 2 warnings found, no blocking failures that prevented completion of the journey.",
    duration: "0.4s",
    status: "passed",
    nodeId: "3",
  },
]
