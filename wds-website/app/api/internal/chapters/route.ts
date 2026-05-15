import { NextRequest, NextResponse } from "next/server";
import { createContentfulClient } from "@/lib/contentful";

const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-internal-secret");
  if (!INTERNAL_SECRET || token !== INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectSlug = req.nextUrl.searchParams.get("project");
  if (!projectSlug) {
    return NextResponse.json({ error: "project query param required" }, { status: 400 });
  }

  try {
    const client = createContentfulClient();
    const response = await client.getEntries({
      content_type: "chapter",
      "fields.projectSlug": projectSlug,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: "fields.chapterNumber" as any,
      limit: 1000,
      select: ["sys.id", "fields.title", "fields.chapterNumber", "fields.slug"],
    });

    const chapters = response.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title as string,
      chapterNumber: item.fields.chapterNumber as number,
      slug: item.fields.slug as string,
    }));

    return NextResponse.json({ chapters });
  } catch (err) {
    console.error("Failed to fetch chapters:", err);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
