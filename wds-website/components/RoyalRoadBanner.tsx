"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ROYAL_ROAD_LINKS } from "@/lib/royal-road";
import { isChromeless } from "@/lib/chrome";

const DISMISS_KEY = "wds:rr-banner-dismissed";

export function RoyalRoadBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

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

  if (!show || isChromeless(pathname)) return null;

  // Electric Green: "important information requiring attention" — ink text on top.
  return (
    <div className="relative w-full bg-brand-green text-brand-ink font-agdasima">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-4 gap-y-1 px-12 py-2 text-center text-[16px] sm:text-[18px] font-bold flex-wrap">
        <span className="hidden sm:inline bg-brand-ink px-2 py-0.5 font-plaguard font-normal text-[14px] tracking-[0.08em] text-brand-green">
          FIRST ON ROYAL ROAD
        </span>
        <span>New chapters go up first on Royal Road.</span>
        <a
          href={ROYAL_ROAD_LINKS.dawnshipper}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-[3px] decoration-2 hover:decoration-[3px]"
        >
          Dawnshipper
        </a>
        <a
          href={ROYAL_ROAD_LINKS.project_osiris}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-[3px] decoration-2 hover:decoration-[3px]"
        >
          Project Osiris
        </a>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-1 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-brand-ink transition-colors hover:bg-brand-ink/10"
      >
        <X className="w-5 h-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
