import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "@/lib/contentful";

// On-demand revalidation triggered by a Contentful webhook.
//
// Configure a webhook in Contentful (Settings → Webhooks) that fires on
// Entry publish / unpublish and POSTs here with a shared secret header:
//   POST /api/revalidate
//   x-contentful-webhook-secret: <CONTENTFUL_REVALIDATE_SECRET>
//
// We read the entry's content type + slug from the payload and bust only the
// affected cache tags, so a single chapter publish refreshes just that page.

// Contentful localises field values: fields.slug = { "en-US": "the-slug" }.
// Grab the first locale's value without assuming the locale name.
function firstLocaleValue(field: unknown): string | undefined {
  if (field && typeof field === "object") {
    const values = Object.values(field as Record<string, unknown>);
    const first = values[0];
    return typeof first === "string" ? first : undefined;
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  const secret = process.env.CONTENTFUL_REVALIDATE_SECRET;
  const provided =
    req.headers.get("x-contentful-webhook-secret") ??
    req.nextUrl.searchParams.get("secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: {
    sys?: { contentType?: { sys?: { id?: string } } };
    fields?: Record<string, unknown>;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const contentType = payload?.sys?.contentType?.sys?.id;
  const slug = firstLocaleValue(payload?.fields?.slug);
  const revalidated: string[] = [];

  const bust = (tag: string) => {
    revalidateTag(tag);
    revalidated.push(tag);
  };

  switch (contentType) {
    case "chapter":
      bust(CACHE_TAGS.chapters);
      if (slug) bust(CACHE_TAGS.chapter(slug));
      revalidatePath("/library");
      break;
    case "novel":
      bust(CACHE_TAGS.novels);
      bust(CACHE_TAGS.chapters);
      break;
    case "blog":
      bust(CACHE_TAGS.blog);
      revalidatePath("/blog");
      break;
    case "wikiEntry":
      bust(CACHE_TAGS.wiki);
      if (slug) bust(`wiki:${slug}`);
      revalidatePath("/wiki");
      break;
    default:
      // Unknown/other content type — bust the broad tags to be safe.
      bust(CACHE_TAGS.chapters);
      bust(CACHE_TAGS.novels);
      bust(CACHE_TAGS.blog);
  }

  return NextResponse.json({ ok: true, contentType, slug, revalidated });
}
