import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Document } from "@contentful/rich-text-types";
import { getWikiEntries, getWikiEntryBySlug } from "@/lib/contentful";
import { SpoilerBody } from "@/components/wiki/SpoilerBody";

export const revalidate = 3600;
export const dynamicParams = true;

const TYPE_LABELS: Record<string, string> = {
  character: "Character",
  place: "Place",
  faction: "Faction",
  term: "Term",
  other: "Lore",
};

export async function generateStaticParams() {
  const entries = await getWikiEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = await getWikiEntryBySlug(slug);
  if (!entry) return { title: "Codex | We're Dad Studios" };

  const title = `${entry.name} | Codex | We're Dad Studios`;
  const desc =
    entry.spoilerFreeSummary ?? `Read about ${entry.name} in the WDS codex.`;
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: entry.imageUrl ? [{ url: entry.imageUrl }] : undefined,
    },
    alternates: { canonical: `https://weredadstudios.com/wiki/${slug}` },
  };
}

export default async function WikiEntryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const entry = await getWikiEntryBySlug(slug);
  if (!entry) notFound();

  const hasBody = (entry.body as Document | undefined)?.nodeType === "document";

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <Link
        href="/wiki"
        className="inline-flex items-center gap-1 text-sm text-wds-text-secondary transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Codex
      </Link>

      <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
        {entry.imageUrl ? (
          <Image
            src={entry.imageUrl}
            alt={entry.name}
            width={120}
            height={120}
            className="h-28 w-28 flex-shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-0/10 text-4xl font-bold text-primary-0">
            {entry.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary-0">
            {TYPE_LABELS[entry.type] ?? "Lore"}
          </div>
          <h1 className="text-3xl font-bold text-foreground">{entry.name}</h1>
          {entry.aliases && entry.aliases.length > 0 && (
            <p className="mt-1 text-sm text-wds-text-secondary">
              Also known as {entry.aliases.join(", ")}
            </p>
          )}
          {entry.firstAppearanceChapter && (
            <p className="mt-1 text-xs text-wds-text-secondary">
              First appears: {entry.firstAppearanceChapter}
            </p>
          )}
        </div>
      </header>

      {entry.spoilerFreeSummary && (
        <p className="mt-8 text-lg leading-relaxed text-foreground/90">
          {entry.spoilerFreeSummary}
        </p>
      )}

      {hasBody && (
        <section className="mt-8">
          <SpoilerBody
            body={entry.body as Document}
            gated={entry.hasSpoilers ?? false}
          />
        </section>
      )}
    </article>
  );
}
