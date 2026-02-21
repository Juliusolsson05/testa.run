import type { ChatMessage, EngineConfig } from "./types.js";

function resolveConfig(config?: EngineConfig) {
  return {
    url: config?.engineUrl ?? process.env["TESTING_ENGINE_URL"] ?? "",
    token: config?.engineToken ?? process.env["TESTING_ENGINE_TOKEN"] ?? "",
  };
}

export async function callEngine(
  messages: ChatMessage[],
  config?: EngineConfig,
): Promise<string> {
  const { url, token } = resolveConfig(config);

  if (!url) {
    throw new Error(
      "TESTING_ENGINE_URL is not set. Provide it via env or EngineConfig.",
    );
  }

  const response = await fetch(`${url}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      model: "default",
      messages,
      temperature: 0.2,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Engine request failed: ${String(response.status)} ${response.statusText} — ${body}`,
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Engine returned empty response");
  }

  return content;
}
