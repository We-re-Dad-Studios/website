import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "contentful";
import { extractPlainText } from "@/lib/extract-doc-text";
import { getStore } from "@netlify/blobs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const ELEVENLABS_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM"; // default: Rachel
const ELEVENLABS_MODEL_ID =
  process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";
const BLOB_STRONG_CONSISTENCY = { consistency: "strong" as const };
const LOCK_TIMEOUT_MS = 5 * 60 * 1000;
const LOCK_POLL_INTERVAL_MS = 1000;
const LOCK_WAIT_TIMEOUT_MS = 45 * 1000;

// ---------------------------------------------------------------------------
// Contentful client (server-side only)
// ---------------------------------------------------------------------------
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CDAPI!,
});

// ---------------------------------------------------------------------------
// Netlify Blobs cache
// ---------------------------------------------------------------------------
function ttsStore() {
  return getStore("tts-audio");
}

function sanitizeKeyPart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function versionHash(chapterId: string, text: string) {
  return createHash("sha256")
    .update([chapterId, ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL_ID, text].join("::"))
    .digest("hex")
    .slice(0, 24);
}

function blobKey(chapterId: string, hash: string) {
  return `${sanitizeKeyPart(chapterId)}-${hash}.mp3`;
}

function lockKey(cacheKey: string) {
  return `locks/${cacheKey}.lock`;
}

function audioHeaders(hash: string) {
  return {
    "Content-Type": "audio/mpeg",
    // Keep browser caching conservative because the request URL is stable.
    "Cache-Control": "public, max-age=0, must-revalidate",
    // Let Netlify's shared cache absorb global reads and reduce invocations.
    "CDN-Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400, durable",
    "Netlify-CDN-Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400, durable",
    ETag: `"${hash}"`,
    "X-TTS-Version": hash,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCached(cacheKey: string): Promise<ArrayBuffer | null> {
  try {
    const store = ttsStore();
    const blob = await store.get(cacheKey, {
      type: "arrayBuffer",
      ...BLOB_STRONG_CONSISTENCY,
    });
    return blob ?? null;
  } catch {
    return null;
  }
}

async function saveToCache(cacheKey: string, audio: ArrayBuffer) {
  try {
    const store = ttsStore();
    await store.set(cacheKey, audio, {
      onlyIfNew: true,
      ...BLOB_STRONG_CONSISTENCY,
      metadata: { contentType: "audio/mpeg", createdAt: new Date().toISOString() },
    });
  } catch (err) {
    console.error("Failed to save TTS to blob store:", err);
  }
}

async function fetchChapterText(chapterId: string) {
  try {
    const entry = await client.getEntry(chapterId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (entry.fields as any).content;
    if (!content) {
      return { error: "Chapter has no content", status: 404 as const };
    }

    const text = extractPlainText(content).replace(/\s+/g, " ").trim();
    if (!text) {
      return { error: "Chapter has no readable text", status: 404 as const };
    }

    return { text };
  } catch {
    return { error: "Chapter not found", status: 404 as const };
  }
}

async function acquireLock(cacheKey: string) {
  const store = ttsStore();
  const key = lockKey(cacheKey);
  const now = Date.now();

  const attempt = await store.setJSON(
    key,
    { createdAt: now },
    {
      onlyIfNew: true,
      ...BLOB_STRONG_CONSISTENCY,
      metadata: { createdAt: new Date(now).toISOString() },
    }
  );

  if (attempt.modified) {
    return true;
  }

  const existing = await store.getWithMetadata(key, {
    type: "json",
    ...BLOB_STRONG_CONSISTENCY,
  });
  const createdAt = typeof existing?.data?.createdAt === "number" ? existing.data.createdAt : 0;

  if (createdAt && now - createdAt > LOCK_TIMEOUT_MS) {
    await store.delete(key);

    const retry = await store.setJSON(
      key,
      { createdAt: now },
      {
        onlyIfNew: true,
        ...BLOB_STRONG_CONSISTENCY,
        metadata: { createdAt: new Date(now).toISOString() },
      }
    );

    return retry.modified;
  }

  return false;
}

async function releaseLock(cacheKey: string) {
  try {
    await ttsStore().delete(lockKey(cacheKey));
  } catch {
    // Ignore unlock failures; the stale lock timeout will recover.
  }
}

async function waitForCachedAudio(cacheKey: string) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < LOCK_WAIT_TIMEOUT_MS) {
    const cached = await getCached(cacheKey);
    if (cached) {
      return cached;
    }

    await sleep(LOCK_POLL_INTERVAL_MS);
  }

  return null;
}

// ---------------------------------------------------------------------------
// ElevenLabs text-to-speech
// ---------------------------------------------------------------------------
async function generateSpeech(text: string): Promise<ArrayBuffer> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: ELEVENLABS_MODEL_ID,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.4,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs API error (${res.status}): ${err}`);
  }

  return res.arrayBuffer();
}

// ---------------------------------------------------------------------------
// Route handler — GET /api/tts/[chapterId]
// ---------------------------------------------------------------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const { chapterId } = await params;

  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 }
    );
  }

  // 1. Resolve the current chapter text so the cache key changes if
  // the chapter text, voice, or model changes.
  const chapter = await fetchChapterText(chapterId);
  if ("error" in chapter) {
    return NextResponse.json(
      { error: chapter.error },
      { status: chapter.status }
    );
  }

  const hash = versionHash(chapterId, chapter.text);
  const cacheKey = blobKey(chapterId, hash);

  // 2. Check the shared blob cache first.
  const cached = await getCached(cacheKey);
  if (cached) {
    return new NextResponse(cached, {
      headers: audioHeaders(hash),
    });
  }

  // 3. Acquire a generation lock so concurrent first hits don't all
  // generate the same MP3 at once.
  const hasLock = await acquireLock(cacheKey);
  if (!hasLock) {
    const pendingAudio = await waitForCachedAudio(cacheKey);
    if (pendingAudio) {
      return new NextResponse(pendingAudio, {
        headers: audioHeaders(hash),
      });
    }

    return NextResponse.json(
      { error: "Audio generation is in progress. Please try again in a moment." },
      {
        status: 503,
        headers: { "Retry-After": "5" },
      }
    );
  }

  // 4. Generate audio via ElevenLabs
  try {
    const audio = await generateSpeech(chapter.text);
    await saveToCache(cacheKey, audio);

    return new NextResponse(audio, {
      headers: audioHeaders(hash),
    });
  } catch (err) {
    console.error("TTS generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  } finally {
    await releaseLock(cacheKey);
  }
}
