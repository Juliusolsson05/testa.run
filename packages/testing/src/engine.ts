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
    throw new Error(
      `Engine request failed: ${String(response.status)} ${response.statusText} — ${body}`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
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
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      let separatorIndex = buffer.indexOf("\n\n");

      while (separatorIndex !== -1) {
        const eventBlock = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + 2);

        const data = parseSseData(eventBlock);
        if (data) {
          const content = extractChunkContent(data);
          if (content) {
            yield { content };
          }
          if (data === "[DONE]") {
            return;
          }
        }

        separatorIndex = buffer.indexOf("\n\n");
      }
    }

    const tail = buffer.trim();
    if (tail) {
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
