// app/links/page.tsx — link-in-bio for social profiles.
// Rendered without site chrome (see lib/chrome.ts).
import { Metadata } from "next";
import Image from "next/image";
import { BrandStripes } from "@/components/BrandStripes";
import { LinkTree } from "@/components/links/LinkTree";

export const metadata: Metadata = {
  title: "Links | We're Dad Studios",
  description:
    "Read Dawnshipper and Project Osiris, follow our games Afterlives and Stryfe, and join the We're Dad Studios community.",
  openGraph: {
    title: "We're Dad Studios — Links",
    description: "Novels, games and community from We're Dad Studios.",
    url: "https://weredadstudios.com/links",
  },
  alternates: { canonical: "https://weredadstudios.com/links" },
};

export default function LinksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-indigo px-4 pb-14 pt-12 text-white sm:pt-16">
      <BrandStripes className="left-0 top-0 h-[300px] w-[120px] sm:h-[420px] sm:w-[180px]" />
      <BrandStripes className="bottom-0 right-0 h-[300px] w-[120px] rotate-180 sm:h-[420px] sm:w-[180px]" />

      <div className="relative mx-auto flex w-full max-w-[520px] flex-col gap-9">
        <header className="flex flex-col items-center text-center">
          <Image
            src="/images/wds-mark-white.svg"
            alt="We're Dad Studios"
            width={160}
            height={65}
            priority
            className="h-auto w-[140px] sm:w-[160px]"
          />
          <h1 className="mb-0 mt-7 font-plaguard text-[30px] font-normal leading-none sm:text-[36px]">
            We&apos;re Dad Studios
          </h1>
          <p className="m-0 mt-3 text-[19px] text-brand-mist sm:text-[20px]">
            We make the stories that make creators.
          </p>
        </header>

        <LinkTree />

        <footer className="text-center text-[15px] uppercase tracking-[0.12em] text-brand-mist">
          © {new Date().getFullYear()} We&apos;re Dad Studios
        </footer>
      </div>
    </main>
  );
}
