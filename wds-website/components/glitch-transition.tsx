"use client";

// Page transition: a quick brand wipe — Mystical Indigo panel with a Pink
// Fantasy leading edge and the white logo — played only when the route
// changes. Pages render immediately underneath; nothing waits on the wipe.
// (Export name kept for the root layout import.)

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isChromeless } from "@/lib/chrome";

const PREF_KEY = "glitch-transitions-enabled";

export const GlitchTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(true);
  const [wipe, setWipe] = useState<number | null>(null);
  const lastPath = useRef(pathname);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREF_KEY);
      if (saved !== null) setEnabled(saved === "true");
    } catch {
      // storage unavailable — keep the default
    }
  }, []);

  // Route changes only. Re-renders that hand us new `children` for the same
  // path must not replay the wipe.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (enabled) setWipe(Date.now());
  }, [pathname, enabled]);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (!next) setWipe(null);
    try {
      localStorage.setItem(PREF_KEY, String(next));
    } catch {
      // ignore
    }
  };

  return (
    <>
      {!isChromeless(pathname) && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={enabled}
          aria-label={enabled ? "Turn page transitions off" : "Turn page transitions on"}
          className="fixed bottom-4 left-4 z-[990] hidden h-9 items-center gap-2 border border-white/30 bg-brand-ink/90 px-3 text-[13px] font-bold uppercase tracking-[0.1em] text-brand-mist backdrop-blur transition-colors hover:text-white md:inline-flex"
        >
          <span aria-hidden="true" className={`h-2 w-2 ${enabled ? "bg-brand-green" : "bg-white/30"}`} />
          Transitions {enabled ? "on" : "off"}
        </button>
      )}

      <AnimatePresence>
        {wipe !== null && (
          <motion.div
            key={wipe}
            aria-hidden="true"
            className="pointer-events-none fixed inset-y-0 -left-[25vw] z-[99990] flex w-[150vw] items-center justify-center"
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "0%", "0%", "100%"] }}
            transition={{ duration: 0.65, times: [0, 0.4, 0.55, 1], ease: "easeInOut" }}
            onAnimationComplete={() => setWipe(null)}
          >
            {/* Pink leading edge + indigo panel, slanted like the logo's cuts */}
            <div className="absolute inset-y-0 right-0 w-full -skew-x-12 bg-brand-pink" />
            <div className="absolute inset-y-0 right-6 w-full -skew-x-12 bg-brand-indigo" />
            <Image
              src="/images/wds-mark-white.svg"
              alt=""
              width={140}
              height={57}
              className="relative h-auto w-[110px] sm:w-[140px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
};
