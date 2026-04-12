import { NextRequest, NextResponse } from "next/server";
import { createClient } from "contentful";
import { extractPlainText } from "@/lib/extract-doc-text";
import path from "path";
import fs from "fs/promises";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const ELEVENLABS_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM"; // default: Rachel
const ELEVENLABS_MODEL_ID =
  process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";

const CACHE_DIR = path.join(process.cwd(), ".cache", "tts");

// ---------------------------------------------------------------------------
// Contentful client (server-side only)
// ---------------------------------------------------------------------------
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CDAPI!,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function ensureCacheDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

function cachePath(chapterId: string) {
  // Sanitise the id so it's safe as a filename
  const safe = chapterId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(CACHE_DIR, `${safe}.mp3`);
}

async function getCached(chapterId: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(cachePath(chapterId));
  } catch {
    return null;
  }
}

async function saveToCache(chapterId: string, audio: Buffer) {
  await ensureCacheDir();
  await fs.writeFile(cachePath(chapterId), audio);
}

// ---------------------------------------------------------------------------
// ElevenLabs text-to-speech
// ---------------------------------------------------------------------------
async function generateSpeech(text: string): Promise<Buffer> {
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

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
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

  // 1. Check cache first
  const cached = await getCached(chapterId);
  if (cached) {
    return new NextResponse(cached, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // 2. Fetch chapter content from Contentful
  let text: string;
  try {
    const entry = await client.getEntry(chapterId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (entry.fields as any).content;
    if (!content) {
      return NextResponse.json(
        { error: "Chapter has no content" },
        { status: 404 }
      );
    }
    text = extractPlainText(content).replace(/\s+/g, " ").trim();
  } catch {
    return NextResponse.json(
      { error: "Chapter not found" },
      { status: 404 }
    );
  }

  if (!text) {
    return NextResponse.json(
      { error: "Chapter has no readable text" },
      { status: 404 }
    );
  }

  // 3. Generate audio via ElevenLabs
  try {
    const audio = await generateSpeech(text);
    await saveToCache(chapterId, audio);

    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("TTS generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
