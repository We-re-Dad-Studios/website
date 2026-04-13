import { NextRequest, NextResponse } from "next/server";
import { createClient } from "contentful";
import { extractPlainText } from "@/lib/extract-doc-text";
import { getStore } from "@netlify/blobs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const ELEVENLABS_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
const ELEVENLABS_MODEL_ID =
  process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";

// ElevenLabs limit per request — try full text first, chunk only if rejected
const MAX_CHUNK_CHARS = 4500;
const CONTEXT_CHARS = 500; // chars of previous/next text for voice consistency

// ---------------------------------------------------------------------------
// Contentful
// ---------------------------------------------------------------------------
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CDAPI!,
});

// ---------------------------------------------------------------------------
// Netlify Blobs — simple cache
// ---------------------------------------------------------------------------
function blobKey(chapterId: string) {
  return chapterId.replace(/[^a-zA-Z0-9_-]/g, "_") + ".mp3";
}

async function getCached(chapterId: string): Promise<ArrayBuffer | null> {
  try {
    const store = getStore("tts-audio");
    const blob = await store.get(blobKey(chapterId), { type: "arrayBuffer" });
    return blob ?? null;
  } catch {
    return null;
  }
}

async function saveToCache(chapterId: string, audio: ArrayBuffer) {
  try {
    const store = getStore("tts-audio");
    await store.set(blobKey(chapterId), audio);
  } catch (err) {
    console.error("Blob cache write failed:", err);
  }
}

// ---------------------------------------------------------------------------
// Text chunking — sentence-boundary split with context overlap
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
// ElevenLabs — plain fetch
// ---------------------------------------------------------------------------
async function ttsRequest(
  text: string,
  previousText?: string,
  nextText?: string
): Promise<ArrayBuffer> {
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
        // previous_text / next_text keep voice tone consistent across chunks
        ...(previousText ? { previous_text: previousText } : {}),
        ...(nextText ? { next_text: nextText } : {}),
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
    console.error(`ElevenLabs ${res.status}:`, body);
    throw new Error(`ElevenLabs API error (${res.status})`);
  }

  return res.arrayBuffer();
}

async function generateAudio(text: string): Promise<ArrayBuffer> {
  // Try sending the full text as one request
  if (text.length <= MAX_CHUNK_CHARS) {
    return ttsRequest(text);
  }

  // Text is too long — chunk with context for voice consistency
  const chunks = chunkText(text);
  const parts: ArrayBuffer[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const prevText = i > 0
      ? chunks[i - 1].slice(-CONTEXT_CHARS)
      : undefined;
    const nextTxt = i < chunks.length - 1
      ? chunks[i + 1].slice(0, CONTEXT_CHARS)
      : undefined;

    parts.push(await ttsRequest(chunks[i], prevText, nextTxt));
  }

  // Concatenate MP3 frames (strip ID3 tags from subsequent parts)
  if (parts.length === 1) return parts[0];

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

function getID3Length(bytes: Uint8Array): number {
  if (bytes.length < 10 || bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return 0;
  const size = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
  return 10 + size + (bytes[5] & 0x10 ? 10 : 0);
}

// ---------------------------------------------------------------------------
// Route — GET /api/tts/[chapterId]
// ---------------------------------------------------------------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const { chapterId } = await params;

  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 });
  }

  // 1. Serve from cache
  const cached = await getCached(chapterId);
  if (cached) {
    return new NextResponse(cached, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // 2. Fetch chapter text
  let text: string;
  try {
    const entry = await client.getEntry(chapterId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (entry.fields as any).content;
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

  // 3. Generate + cache + return
  try {
    const audio = await generateAudio(text);
    saveToCache(chapterId, audio);

    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("TTS generation failed:", err);
    return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}
