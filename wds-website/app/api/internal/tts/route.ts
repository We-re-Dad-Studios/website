import { NextRequest, NextResponse } from "next/server";
import { createContentfulClient } from "@/lib/contentful";
import { extractPlainText } from "@/lib/extract-doc-text";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const ELEVENLABS_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
const ELEVENLABS_MODEL_ID =
  process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";
const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

const MAX_CHUNK_CHARS = 4500;
const CONTEXT_CHARS = 500;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
function isAuthorized(req: NextRequest): boolean {
  if (!INTERNAL_SECRET) return false;
  const token = req.headers.get("x-internal-secret");
  return token === INTERNAL_SECRET;
}

// ---------------------------------------------------------------------------
// Text chunking
// ---------------------------------------------------------------------------
function chunkText(text: string): string[] {
  if (text.length <= MAX_CHUNK_CHARS) return [text];

  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    if (s.length > MAX_CHUNK_CHARS) {
      if (current) { chunks.push(current); current = ""; }
      const words = s.split(/\s+/);
      let buf = "";
      for (const w of words) {
        const next = buf ? `${buf} ${w}` : w;
        if (next.length > MAX_CHUNK_CHARS) {
          if (buf) chunks.push(buf);
          buf = w;
        } else {
          buf = next;
        }
      }
      if (buf) current = buf;
      continue;
    }
    const next = current ? `${current} ${s}` : s;
    if (next.length > MAX_CHUNK_CHARS) {
      if (current) chunks.push(current);
      current = s;
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// ---------------------------------------------------------------------------
// ElevenLabs
// ---------------------------------------------------------------------------
async function ttsRequest(
  text: string,
  previousText?: string,
  nextText?: string
): Promise<ArrayBuffer> {
  const supportsContext = !ELEVENLABS_MODEL_ID.startsWith("eleven_v3");

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL_ID,
        ...(supportsContext && previousText ? { previous_text: previousText } : {}),
        ...(supportsContext && nextText ? { next_text: nextText } : {}),
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.4,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${res.status}: ${body}`);
  }

  return res.arrayBuffer();
}

function getID3Length(bytes: Uint8Array): number {
  if (bytes.length < 10 || bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return 0;
  const size =
    ((bytes[6] & 0x7f) << 21) |
    ((bytes[7] & 0x7f) << 14) |
    ((bytes[8] & 0x7f) << 7) |
    (bytes[9] & 0x7f);
  return 10 + size + (bytes[5] & 0x10 ? 10 : 0);
}

async function generateAudio(text: string): Promise<ArrayBuffer> {
  const chunks = chunkText(text);

  if (chunks.length === 1) {
    return ttsRequest(chunks[0]);
  }

  const parts: ArrayBuffer[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const prev = i > 0 ? chunks[i - 1].slice(-CONTEXT_CHARS) : undefined;
    const next = i < chunks.length - 1 ? chunks[i + 1].slice(0, CONTEXT_CHARS) : undefined;
    parts.push(await ttsRequest(chunks[i], prev, next));
  }

  let totalLen = 0;
  const slices = parts.map((buf, i) => {
    const bytes = new Uint8Array(buf);
    const slice = i === 0 ? bytes : bytes.slice(getID3Length(bytes));
    totalLen += slice.byteLength;
    return slice;
  });

  const merged = new Uint8Array(totalLen);
  let offset = 0;
  for (const s of slices) {
    merged.set(s, offset);
    offset += s.byteLength;
  }
  return merged.buffer;
}

// ---------------------------------------------------------------------------
// POST /api/internal/tts
// Body: { chapterId: string }
// Returns: audio/mpeg download
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 });
  }

  const { chapterId } = await req.json();
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId is required" }, { status: 400 });
  }

  // Fetch chapter text
  let text: string;
  let title: string;
  try {
    const client = createContentfulClient();
    const entry = await client.getEntry(chapterId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = entry.fields as any;
    title = fields.title ?? "chapter";
    const content = fields.content;
    if (!content) {
      return NextResponse.json({ error: "Chapter has no content" }, { status: 404 });
    }
    text = extractPlainText(content).replace(/\s+/g, " ").trim();
    if (!text) {
      return NextResponse.json({ error: "Chapter has no readable text" }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  // Generate audio
  try {
    const audio = await generateAudio(text);
    const safeName = title.replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/\s+/g, "_");

    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${safeName}.mp3"`,
      },
    });
  } catch (err) {
    console.error("TTS generation failed:", err);
    const msg = err instanceof Error ? err.message : "Failed to generate audio";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
