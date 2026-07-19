import { hogql, PostHogNotConfiguredError } from "@/lib/posthog-query";

// Reader drop-off dashboard. Unlisted (noindex via app/internal/layout.tsx).
// Shows, per chapter, how far readers get: started → 25% → 50% → 75% → finished.
export const dynamic = "force-dynamic";

interface ChapterFunnel {
  chapter: string;
  title: string;
  number: number;
  started: number;
  p25: number;
  p50: number;
  p75: number;
  finished: number;
}

const FUNNEL_QUERY = `
SELECT
  properties.chapterSlug AS chapter,
  any(properties.chapterTitle) AS title,
  any(properties.chapterNumber) AS number,
  uniqIf(person_id, event = 'chapter_progress' AND properties.milestone = 0) AS started,
  uniqIf(person_id, event = 'chapter_progress' AND properties.milestone = 25) AS p25,
  uniqIf(person_id, event = 'chapter_progress' AND properties.milestone = 50) AS p50,
  uniqIf(person_id, event = 'chapter_progress' AND properties.milestone = 75) AS p75,
  uniqIf(person_id, event = 'chapter_finished') AS finished
FROM events
WHERE event IN ('chapter_progress', 'chapter_finished')
  AND timestamp > now() - INTERVAL 30 DAY
GROUP BY chapter
ORDER BY number ASC
`;

async function loadFunnels(): Promise<
  { data: ChapterFunnel[] } | { error: "not-configured" } | { error: string }
> {
  try {
    const { results } = await hogql(FUNNEL_QUERY);
    const data: ChapterFunnel[] = results.map((row) => ({
      chapter: String(row[0] ?? ""),
      title: String(row[1] ?? row[0] ?? ""),
      number: Number(row[2] ?? 0),
      started: Number(row[3] ?? 0),
      p25: Number(row[4] ?? 0),
      p50: Number(row[5] ?? 0),
      p75: Number(row[6] ?? 0),
      finished: Number(row[7] ?? 0),
    }));
    return { data };
  } catch (err) {
    if (err instanceof PostHogNotConfiguredError) return { error: "not-configured" };
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

function Stage({ label, value, base }: { label: string; value: number; base: number }) {
  const percent = pct(value, base);
  return (
    <td className="px-3 py-2 align-middle">
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full rounded-full bg-amber-400"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="w-10 tabular-nums text-gray-300">{value}</span>
        <span className="w-10 text-right tabular-nums text-gray-500">{percent}%</span>
        <span className="sr-only">{label}</span>
      </div>
    </td>
  );
}

export default async function InsightsPage() {
  const result = await loadFunnels();

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-gray-900 px-6 py-12 text-gray-100">
      <h1 className="text-2xl font-bold">Reader drop-off</h1>
      <p className="mt-1 text-sm text-gray-400">
        Unique readers reaching each point of a chapter. Last 30 days.
      </p>

      {"error" in result && result.error === "not-configured" && (
        <div className="mt-8 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <p className="font-medium text-amber-300">PostHog Query API not configured.</p>
          <p className="mt-2 text-gray-300">
            Set <code className="text-amber-200">POSTHOG_PERSONAL_API_KEY</code> and{" "}
            <code className="text-amber-200">POSTHOG_PROJECT_ID</code> in your environment,
            then redeploy. Data appears once readers have triggered{" "}
            <code className="text-amber-200">chapter_progress</code> events.
          </p>
        </div>
      )}

      {"error" in result && result.error !== "not-configured" && (
        <div className="mt-8 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {result.error}
        </div>
      )}

      {"data" in result && result.data.length === 0 && (
        <p className="mt-8 text-gray-400">
          No chapter events yet. Read a chapter to start collecting data.
        </p>
      )}

      {"data" in result && result.data.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-left text-xs uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-3 py-2">Chapter</th>
                <th className="px-3 py-2">Started</th>
                <th className="px-3 py-2">25%</th>
                <th className="px-3 py-2">50%</th>
                <th className="px-3 py-2">75%</th>
                <th className="px-3 py-2">Finished</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {result.data.map((row) => (
                <tr key={row.chapter}>
                  <td className="px-3 py-2">
                    <div className="font-medium">{row.title}</div>
                    <div className="text-xs text-gray-500">#{row.number}</div>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-gray-300">{row.started}</td>
                  <Stage label="25%" value={row.p25} base={row.started} />
                  <Stage label="50%" value={row.p50} base={row.started} />
                  <Stage label="75%" value={row.p75} base={row.started} />
                  <Stage label="Finished" value={row.finished} base={row.started} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
