"use client";

import { useEffect, useState } from "react";
import { Crown, X } from "lucide-react";
import { ROYAL_ROAD_LINKS } from "@/lib/royal-road";

const DISMISS_KEY = "wds:rr-banner-dismissed";

export function RoyalRoadBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(localStorage.getItem(DISMISS_KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage failures
    }
  };

  if (!show) return null;

  return (
    <div className="relative w-full bg-[#3b6ea5] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-3 gap-y-1.5 px-10 py-2 text-center text-xs sm:text-sm flex-wrap">
        <Crown className="hidden sm:block w-4 h-4 shrink-0 text-amber-300" />
        <span className="font-medium">
          We now post new chapters first on{" "}
          <span className="font-bold">Royal Road</span>.
        </span>
        <span className="hidden sm:inline text-white/50">·</span>
        <a
          href={ROYAL_ROAD_LINKS.dawnshipper}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-white/40 underline-offset-2 hover:decoration-white"
        >
          Dawnshipper
        </a>
        <span className="text-white/40">/</span>
        <a
          href={ROYAL_ROAD_LINKS.project_osiris}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-white/40 underline-offset-2 hover:decoration-white"
        >
          Project Osiris
        </a>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
