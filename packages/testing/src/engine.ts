import type { ChatMessage, EngineConfig } from "./types";

const DEBUG_ENABLED = /^(1|true|yes)$/i.test(
  process.env["TESTING_DEBUG"] ?? "",
);

function debugLog(message: string, details?: unknown): void {
  if (!DEBUG_ENABLED) {
    return;
  }
  // eslint-disable-next-line no-console
  console.error(
    JSON.stringify({
      type: "debug",
      scope: "testing-engine",
      at: new Date().toISOString(),
      message,
      ...(details !== undefined ? { details } : {}),
    }),
  );
}

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

type StreamChunk = {
  content: string;
};

function parseSseData(eventBlock: string): string | null {
  const lines = eventBlock.split("\n");
  const dataLines = lines
    .map((line) => line.trimEnd())
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart());

  if (dataLines.length === 0) {
    return null;
  }

  return dataLines.join("\n");
}

function extractChunkContent(payload: string): string {
  if (payload === "[DONE]") {
    return "";
  }

  const parsed = JSON.parse(payload) as {
    choices?: Array<{
      delta?: { content?: string };
      message?: { content?: string };
    }>;
  };

  const content =
    parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.message?.content;

  return typeof content === "string" ? content : "";
}

export async function* streamEngine(
  messages: ChatMessage[],
  config?: EngineConfig,
  signal?: AbortSignal,
): AsyncGenerator<StreamChunk> {
  const { url, token } = resolveConfig(config);
  debugLog("Starting streamed engine call", {
    hasUrl: Boolean(url),
    hasToken: Boolean(token),
    messageCount: messages.length,
  });

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
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    debugLog("Engine response not OK", {
      status: response.status,
      statusText: response.statusText,
      bodyPreview: body.slice(0, 300),
    });
    throw new Error(
      `Engine request failed: ${String(response.status)} ${response.statusText} — ${body}`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  debugLog("Received engine response", {
    status: response.status,
    contentType,
  });
  if (!contentType.includes("text/event-stream")) {
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Engine returned empty response");
    }
    yield { content };
    return;
  }

  if (!response.body) {
    throw new Error("Engine returned no response body for stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        debugLog("SSE reader done");
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      debugLog("SSE chunk received", {
        bytes: value.byteLength,
        bufferChars: buffer.length,
      });
      let separatorIndex = buffer.indexOf("\n\n");

      while (separatorIndex !== -1) {
        const eventBlock = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + 2);

        const data = parseSseData(eventBlock);
        if (data) {
          const content = extractChunkContent(data);
          if (content) {
            debugLog("Yielding stream content chunk", {
              chars: content.length,
              preview: content.slice(0, 180),
            });
            yield { content };
          }
          if (data === "[DONE]") {
            debugLog("Received [DONE] marker");
            return;
          }
        }

        separatorIndex = buffer.indexOf("\n\n");
      }
    }

    const tail = buffer.trim();
    if (tail) {
      debugLog("Processing tail buffer", { tailChars: tail.length });
      const data = parseSseData(tail);
      if (data) {
        const content = extractChunkContent(data);
        if (content) {
          yield { content };
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
