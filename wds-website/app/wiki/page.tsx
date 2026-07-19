import { Metadata } from "next";
import { getWikiEntries } from "@/lib/contentful";
import { WikiClient } from "@/components/wiki/WikiClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Codex | We're Dad Studios",
  description:
    "An illustrated codex of the characters, places, factions, and lore behind the We're Dad Studios novels.",
  alternates: { canonical: "https://weredadstudios.com/wiki" },
};

export default async function WikiPage() {
  const entries = await getWikiEntries();

  return (
    <section className="w-full min-h-screen">
      <div className="border-b border-border bg-wds-surface/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Codex</h1>
          <p className="mt-2 text-wds-text-secondary">
            Characters, places, factions, and lore from across the stories.
          </p>
        </div>
      </div>
      <WikiClient entries={entries} />
    </section>
  );
}
