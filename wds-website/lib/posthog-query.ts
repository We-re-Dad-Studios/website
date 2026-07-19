// Server-side helper for PostHog's HogQL Query API.
// Requires a personal API key (Project Settings → Personal API Keys) and the
// numeric project id. These are server-only secrets — never expose them.
//
//   POSTHOG_PERSONAL_API_KEY=phx_...
//   POSTHOG_PROJECT_ID=12345
//
// Host falls back to the public ingestion host already configured for the app.

export interface HogQLResult {
  columns: string[];
  results: unknown[][];
}

export class PostHogNotConfiguredError extends Error {
  constructor() {
    super("PostHog Query API is not configured");
    this.name = "PostHogNotConfiguredError";
  }
}

export async function hogql(query: string): Promise<HogQLResult> {
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const host =
    process.env.POSTHOG_API_HOST ||
    process.env.NEXT_PUBLIC_POSTHOG_HOST ||
    "https://us.i.posthog.com";

  if (!apiKey || !projectId) {
    throw new PostHogNotConfiguredError();
  }

  const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    // Always fetch fresh analytics; never cache on the server.
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PostHog query failed (${res.status}): ${text}`);
  }

  return (await res.json()) as HogQLResult;
}
