import { Metadata } from "next";
import { LibraryClient } from "@/components/library/LibraryClient";

export const metadata: Metadata = {
  title: "My Library | We're Dad Studios",
  description:
    "Your reading progress, bookmarks, highlights, and streak — saved on this device.",
  // Personal, device-local content — no value to crawlers.
  robots: { index: false, follow: false },
  alternates: { canonical: "https://weredadstudios.com/library" },
};

export default function LibraryPage() {
  return (
    <section className="w-full min-h-screen">
      <div className="border-b border-border bg-wds-surface/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            My Library
          </h1>
          <p className="mt-2 text-wds-text-secondary">
            Everything you&apos;re reading, saving, and tracking — on this device.
          </p>
        </div>
      </div>
      <LibraryClient />
    </section>
  );
}
