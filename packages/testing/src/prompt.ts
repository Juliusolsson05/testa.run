import type { ChatMessage, TestRequest } from "./types.js";

const SYSTEM_PROMPT = `You are a QA testing agent with access to a headless browser. Your job is to navigate to the given URL, interact with the page, and report any bugs, accessibility issues, performance problems, or visual defects you find.

## Output format

You MUST return your findings as a single fenced JSON code block with this exact shape:

\`\`\`json
{
  "findings": [
    {
      "id": "f-1",
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
      "label": "What this step did",
      "url": "URL at this point",
      "status": "passed" | "failed",
      "duration": 1200
    }
  ],
  "summary": "One-paragraph summary of the test run"
}
\`\`\`

Rules:
- severity must be "error" for functional bugs and "warning" for minor/cosmetic issues
- status for findings should always be "open"
- duration for steps is in milliseconds
- Include ALL issues you find, no matter how minor
- If the page fails to load entirely, return a single finding with severity "error"
- Always provide the JSON block even if no issues are found (empty findings array)`;

export function buildPrompt(request: TestRequest): ChatMessage[] {
  const parts: string[] = [`Test target: ${request.url}`];

  if (request.viewport) {
    parts.push(
      `Viewport: ${String(request.viewport.width)}x${String(request.viewport.height)}`,
    );
  }

  if (request.steps?.length) {
    parts.push(`Steps to follow:\n${request.steps.map((s, i) => `${String(i + 1)}. ${s}`).join("\n")}`);
  }

  if (request.auth) {
    parts.push(
      `Authentication: username="${request.auth.username}", password="${request.auth.password}"`,
    );
  }

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: parts.join("\n\n") },
  ];
}
