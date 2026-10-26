import { Metadata } from "next";
import { LibraryClient } from "@/components/library/LibraryClient";
import { BrandStripes } from "@/components/BrandStripes";

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
    <section className="w-full min-h-screen bg-background">
      <div className="relative overflow-hidden bg-brand-indigo text-white">
        <BrandStripes className="right-0 top-0 h-[220px] w-[100px] -scale-x-100 sm:h-[300px] sm:w-[140px]" />
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="m-0 font-plaguard text-[44px] font-normal leading-none sm:text-[64px]">My Library</h1>
          <p className="m-0 mt-3 max-w-[560px] text-[19px] text-brand-mist sm:text-[21px]">
            Everything you&apos;re reading, saving and tracking — on this device.
          </p>
        </div>
      </div>
      <LibraryClient />
    </section>
  );
}
