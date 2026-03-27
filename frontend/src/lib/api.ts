const API_BASE =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || "http://backend:8000/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchResume() {
  const res = await fetch(`${API_BASE}/resume`);
  if (!res.ok) throw new Error("Failed to fetch resume");
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/resume/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function fetchGithubStats() {
  const res = await fetch(`${API_BASE}/github/stats`);
  if (!res.ok) return null;
  return res.json();
}

export async function* streamChat(
  message: string,
  history: { role: string; content: string }[]
): AsyncGenerator<string> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok || !res.body) throw new Error("Chat request failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) yield parsed.text;
        } catch {
          // skip malformed
        }
      }
    }
  }
}
