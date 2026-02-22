import type { ChatMessage, TestRunRequest } from "./types";

type PromptContext = {
  runKey: string;
  screenshotPublicBaseUrl: string;
};

const SYSTEM_PROMPT = `You are a QA + security testing agent with access to a headless browser. Navigate to the provided URL, test real behavior, and return structured results.

## Output format

You MUST return a single fenced JSON code block with this exact shape:

\`\`\`json
{
  "run": {
    "name": "Short run title",
    "category": "security" | "buttons" | "ux",
    "securitySynopsis": "Optional security summary"
  },
  "issues": [
    {
      "issueKey": "iss-1",
      "stepKey": "s-2",
      "nodeKey": "login",
      "category": "security" | "other",
      "title": "Short issue title",
      "description": "Detailed explanation",
      "reasoning": "Why this is a problem",
      "element": "CSS selector or clear target",
      "severity": "error" | "warning",
      "status": "open" | "resolved"
    }
  ],
  "steps": [
    {
      "stepKey": "s-1",
      "index": 1,
      "nodeKey": "landing",
      "action": "navigate" | "scroll" | "audit" | "click" | "wait" | "fill" | "resize" | "screenshot",
      "target": "element or resource",
      "description": "Short step description",
      "reasoning": "What happened and why",
      "status": "passed" | "failed" | "warning",
      "durationMs": 1200,
      "url": "https://example.com"
    }
  ],
  "summary": "One-paragraph summary"
}
\`\`\`

## Streaming protocol

- During execution, you may emit progress lines.
- Progress lines MUST use: EVENT: <short action sentence>
- Screenshot lines MUST use: SCREENSHOT_URL:<stepKey>|<publicUrl>
- Each screenshot URL must be a valid absolute URL.
- Use the same stepKey in SCREENSHOT_URL and in final JSON steps.

Rules:
- Always include at least one step.
- Keep step descriptions concise and factual.
- Include both QA and security issues when relevant.
- Never return base64 image data.
- Keep credentials/secrets out of output.`;

export function buildPrompt(
  request: TestRunRequest,
  context: PromptContext,
): ChatMessage[] {
  const parts: string[] = [`Test target: ${request.url}`];
  const normalizedBase = context.screenshotPublicBaseUrl.replace(/\/+$/, "");

  parts.push(
    [
      "Screenshot requirements:",
      `- runKey: ${context.runKey}`,
      `- Save each step screenshot to: /home/node/.openclaw/workspace/runs/${context.runKey}/{stepKey}.png`,
      `- Return screenshot URLs using: ${normalizedBase}/runs/${context.runKey}/{stepKey}.png`,
      "- stepKey must exactly match the step key in the final JSON.",
    ].join("\n"),
  );

  if (request.prompt?.trim()) {
    parts.push(`Extra instructions/context:\n${request.prompt.trim()}`);
  }

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: parts.join("\n\n") },
  ];
}
