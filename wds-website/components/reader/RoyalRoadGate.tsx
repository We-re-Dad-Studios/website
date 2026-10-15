"use client";

import Link from "next/link";
import { ArrowUpRight, Crown } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { BrandStripes } from "@/components/BrandStripes";

// Shown in place of the rest of a chapter that is published on Royal Road.
// Fixed brand colours (not reader-theme tokens) so it reads on all four themes.
export function RoyalRoadGate({
  url,
  novelSlug,
  novelName,
  chapterNumber,
  onSiteLimit,
}: {
  url: string;
  novelSlug: string;
  novelName: string;
  chapterNumber: number;
  onSiteLimit: number;
}) {
  const posthog = usePostHog();

  return (
    <section
      aria-labelledby="rr-gate-heading"
      className="cut-tr-sm relative mt-10 overflow-hidden bg-brand-indigo p-6 font-agdasima text-white sm:p-8"
    >
      <BrandStripes className="right-0 top-0 h-[220px] w-[100px] -scale-x-100 opacity-70" />
      <div className="relative">
        <span className="inline-flex items-center gap-2 bg-brand-ink px-2.5 py-1 text-[15px] font-bold uppercase tracking-[0.12em] text-brand-green">
          <Crown className="h-4 w-4" aria-hidden="true" />
          Chapter {chapterNumber} continues on Royal Road
        </span>
        <h2
          id="rr-gate-heading"
          className="mb-3 mt-4 font-plaguard text-[34px] font-normal leading-none sm:text-[44px]"
        >
          Keep reading
          <span className="block text-brand-pink">on Royal Road</span>
        </h2>
        <p className="m-0 max-w-[520px] text-[19px] leading-[1.45] text-brand-mist sm:text-[21px]">
          Chapters 1–{onSiteLimit} of {novelName} are free to read here. The rest of the
          story — including the rest of this chapter — lives on Royal Road, where new
          chapters go up first.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              posthog?.capture("royal_road_gate_click", { novelSlug, chapterNumber })
            }
            className="cut-corners-sm inline-flex min-h-[52px] items-center justify-center gap-2.5 bg-brand-pink px-6 text-[19px] font-bold uppercase tracking-[0.06em] text-brand-ink transition-colors hover:bg-[#F87FE2] sm:text-[20px]"
          >
            Continue on Royal Road
            <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          </a>
          <Link
            href={`/projects/${novelSlug}`}
            className="inline-flex min-h-[52px] items-center justify-center border-2 border-white/70 px-6 text-[19px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:border-white hover:bg-white/10 sm:text-[20px]"
          >
            All chapters
          </Link>
        </div>
      </div>
    </section>
  );
}
