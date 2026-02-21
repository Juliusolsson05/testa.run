export type IssueSeverity = 'error' | 'warning'
export type IssueStatus   = 'open' | 'resolved'

export type Issue = {
  id: string
  nodeId: string
  title: string
  description: string
  severity: IssueSeverity
  status: IssueStatus
  element: string
}

export const issues: Issue[] = [
  {
    id: 'iss-1',
    nodeId: '1',
    title: 'Low contrast on CTA',
    description: 'Primary CTA button fails WCAG AA contrast ratio (3.2:1 vs required 4.5:1).',
    severity: 'warning',
    status: 'open',
    element: 'button.cta-primary',
  },
  {
    id: 'iss-2',
    nodeId: '1',
    title: 'Missing alt text on hero',
    description: 'Hero image has no alt attribute, causing screen reader failures.',
    severity: 'warning',
    status: 'resolved',
    element: '#hero-image',
  },
  {
    id: 'iss-3',
    nodeId: '2',
    title: 'Login timeout > 3s',
    description: 'Authentication POST request exceeds 3s SLA (measured 4.1s at P95).',
    severity: 'error',
    status: 'open',
    element: 'form#login-form',
  },
  {
    id: 'iss-4',
    nodeId: '2',
    title: 'Form label not bound',
    description: 'Search input is missing a bound <label> element; for/id pairing absent.',
    severity: 'warning',
    status: 'resolved',
    element: 'input[type="search"]',
  },
  {
    id: 'iss-5',
    nodeId: '3',
    title: 'Dashboard render lag',
    description: 'Initial dashboard paint takes 6.8s on throttled 4G (budget: 4s).',
    severity: 'error',
    status: 'open',
    element: '#dashboard-root',
  },
  {
    id: 'iss-6',
    nodeId: '3',
    title: 'Widget overflow at 1280px',
    description: 'Analytics widget clips outside its container at exactly 1280px viewport width.',
    severity: 'warning',
    status: 'open',
    element: '.analytics-widget',
  },
]
