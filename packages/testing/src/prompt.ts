import type { ChatMessage, TestRunRequest } from "./types.js";

const SYSTEM_PROMPT = `You are a QA + security testing agent with access to a headless browser. Navigate to the provided URL, test real behavior, and return structured findings.

## Output format

You MUST return a single fenced JSON code block with this exact shape:

\`\`\`json
{
  "findings": [
    {
      "id": "f-1",
      "domain": "qa" | "security",
      "category": "short category label",
      "title": "Short descriptive title",
      "description": "Detailed explanation of the issue",
      "severity": "error" | "warning",
      "status": "open",
      "element": "CSS selector or description of the element",
      "evidence": "Optional screenshot reference or measurement"
    }
  ],
  "steps": [
    {
      "id": "s-1",
      "label": "What this step did",
      "url": "URL at this point",
      "status": "passed" | "failed" | "running" | "pending",
      "duration": 1200,
      "screenshotBase64": "base64 encoded PNG screenshot for this step"
    }
  ],
  "summary": "One-paragraph summary of the test run"
}
\`\`\`

Rules:
- Add BOTH qa and security findings when relevant.
- For security findings, set domain="security" and a concrete category (example: "csrf", "xss", "auth", "sensitive-data-exposure").
- For general quality findings, set domain="qa".
- Include ALL issues found, including minor issues.
- Always include at least one step.
- Every step must include screenshotBase64 (PNG).
- If nothing fails, return empty findings and a meaningful summary.
- Keep credentials or secrets out of findings/evidence unless strictly required for debugging.`;

export function buildPrompt(request: TestRunRequest): ChatMessage[] {
  const parts: string[] = [`Test target: ${request.url}`];

  if (request.prompt?.trim()) {
    parts.push(`Extra instructions/context:\n${request.prompt.trim()}`);
  }

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: parts.join("\n\n") },
  ];
}
