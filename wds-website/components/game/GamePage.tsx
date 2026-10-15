"use client";

// Shared landing page for WDS games (/projects/afterlives, /projects/stryfe).
// Same brand frame as the novel pages — indigo hero, deck-style headers —
// with game-specific sections passed in as children.

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FaDiscord, FaTiktok } from "react-icons/fa6";
import { BrandStripes } from "@/components/BrandStripes";

const ACCENTS = {
  pink: { fill: "bg-brand-pink", hover: "hover:bg-[#F87FE2]", plate: "bg-brand-pink text-brand-ink", text: "text-brand-pink" },
  green: { fill: "bg-brand-green", hover: "hover:bg-[#5CF7A3]", plate: "bg-brand-green text-brand-ink", text: "text-brand-green" },
} as const;

export type GameAccent = keyof typeof ACCENTS;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function GamePage({
  title,
  eyebrow,
  genre,
  accent,
  hook,
  facts,
  posterLines,
  posterTagline,
  children,
}: {
  title: string;
  /** Small line above the title, e.g. a codename */
  eyebrow?: string;
  genre: string;
  accent: GameAccent;
  hook: ReactNode;
  /** Short status facts, e.g. ["In development", "Unreal Engine"] */
  facts: string[];
  /** Words stacked on the typographic poster */
  posterLines: string[];
  posterTagline: string;
  children: ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-brand-indigo text-white">
        <BrandStripes className="left-0 top-0 h-[260px] w-[110px] sm:h-[400px] sm:w-[180px]" />
        <BrandStripes className="bottom-0 right-0 h-[260px] w-[110px] rotate-180 sm:h-[400px] sm:w-[180px]" />

        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-12 px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:gap-16">
          <motion.div
            className="min-w-0 flex-[2_1_520px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/projects"
              className="mb-6 inline-flex items-center gap-2 text-[17px] uppercase tracking-[0.1em] text-brand-mist transition-colors hover:text-white"
            >
              <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
              All projects
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 text-[15px] font-bold uppercase tracking-[0.12em] sm:text-[16px] ${a.plate}`}>
                {genre}
              </span>
              {eyebrow && (
                <span className="border border-white/45 px-3 py-1 text-[15px] uppercase tracking-[0.12em] text-brand-mist sm:text-[16px]">
                  {eyebrow}
                </span>
              )}
            </div>

            <h1 className="my-5 font-plaguard text-[52px] font-normal leading-[0.95] sm:text-[80px] lg:text-[96px]">
              {title}
            </h1>

            <p className="mb-6 max-w-[620px] text-[21px] leading-[1.4] text-brand-mist sm:text-[24px]">{hook}</p>

            <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-[16px] uppercase tracking-[0.1em] text-brand-mist sm:text-[18px]">
              {facts.map((f, i) => (
                <li key={f} className="flex items-center gap-2">
                  {i === 0 && <span className="h-2 w-2 bg-brand-green" aria-hidden="true" />}
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="https://discord.gg/Vjjw2f42"
                target="_blank"
                rel="noopener noreferrer"
                className={`cut-corners group inline-flex min-h-14 items-center justify-center gap-3 px-8 text-[20px] font-bold uppercase tracking-[0.06em] text-brand-ink transition-colors sm:text-[22px] ${a.fill} ${a.hover}`}
              >
                <FaDiscord className="h-5 w-5" aria-hidden="true" />
                Follow development
              </a>
              <a
                href="https://www.tiktok.com/@weredadstudios"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 border-2 border-white px-7 text-[20px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white hover:text-brand-indigo sm:text-[22px]"
              >
                <FaTiktok className="h-5 w-5" aria-hidden="true" />
                Dev clips
                <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          {/* Typographic poster — no key art yet */}
          <motion.div
            className="flex min-w-0 flex-[1_1_340px] justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative w-full max-w-[400px]" aria-hidden="true">
              <div className={`cut-corners-lg absolute inset-0 translate-x-[14px] translate-y-[14px] sm:translate-x-[18px] sm:translate-y-[18px] ${a.fill}`} />
              <div className="cut-corners-lg relative flex aspect-[4/5] flex-col justify-between overflow-hidden bg-brand-ink p-7">
                <BrandStripes className="right-0 top-0 h-full w-[55%] -scale-x-100 opacity-60" />
                <span className="relative text-[15px] font-bold uppercase tracking-[0.14em] text-brand-mist">
                  We&apos;re Dad Studios
                </span>
                <div className="relative">
                  {posterLines.map((line, i) => (
                    <span
                      key={line}
                      className={`block font-plaguard text-[44px] leading-[0.95] sm:text-[52px] ${i === posterLines.length - 1 ? a.text : "text-white"}`}
                    >
                      {line}
                    </span>
                  ))}
                  <span className="mt-4 block text-[17px] uppercase tracking-[0.12em] text-brand-mist">{posterTagline}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BODY */}
      <div className="mx-auto max-w-7xl space-y-16 px-4 pb-24 pt-14 sm:space-y-20 sm:px-6 sm:pt-20">{children}</div>

      {/* CLOSING CTA */}
      <section className="relative w-full overflow-hidden bg-brand-indigo px-4 py-16 text-white sm:px-6 sm:py-20">
        <BrandStripes className="right-0 top-0 h-[300px] w-[130px] -scale-x-100 sm:h-[400px] sm:w-[180px]" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8">
          <div className="min-w-0 flex-[1_1_440px]">
            <h2 className="mb-4 font-plaguard text-[40px] font-normal leading-[0.98] sm:text-[60px]">
              Built in the open
              <span className={`block ${a.text}`}>join the crew</span>
            </h2>
            <p className="m-0 max-w-[520px] text-[20px] text-brand-mist sm:text-[22px]">
              Dev logs, early footage and playtest news land in our Discord first.
            </p>
          </div>
          <a
            href="https://discord.gg/Vjjw2f42"
            target="_blank"
            rel="noopener noreferrer"
            className={`cut-corners inline-flex min-h-14 items-center justify-center gap-3 px-8 text-[20px] font-bold uppercase tracking-[0.06em] text-brand-ink transition-colors sm:text-[22px] ${a.fill} ${a.hover}`}
          >
            <FaDiscord className="h-5 w-5" aria-hidden="true" />
            Join the Discord
          </a>
        </div>
      </section>
    </div>
  );
}

export function GameSection({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-t-2 border-primary-0 pb-4 pt-3">
        <h2 className="m-0 font-plaguard text-[32px] font-normal leading-none text-primary-0 sm:text-[44px]">{title}</h2>
        {intro && <p className="m-0 max-w-[460px] text-[18px] text-wds-text-secondary sm:text-[20px]">{intro}</p>}
      </div>
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}

/** Card grid used for realms, pillars, roles and heroes. */
export function CardGrid({
  accent,
  cards,
  columns = 3,
}: {
  accent: GameAccent;
  columns?: 2 | 3 | 4;
  cards: { kicker?: string; title: string; body: string; detail?: string }[];
}) {
  const a = ACCENTS[accent];
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <ul className={`m-0 grid list-none gap-5 p-0 ${cols}`}>
      {cards.map((c) => (
        <li key={c.title} className="flex flex-col border border-border border-t-4 border-t-primary-0 bg-card p-5 sm:p-6">
          {c.kicker && (
            <span className={`self-start px-2 py-0.5 text-[14px] font-bold uppercase tracking-[0.12em] ${a.plate}`}>
              {c.kicker}
            </span>
          )}
          <h3 className="mb-2 mt-3 font-plaguard text-[24px] font-normal leading-tight text-foreground sm:text-[26px]">{c.title}</h3>
          <p className="m-0 text-[18px] leading-[1.45] text-wds-text-secondary sm:text-[19px]">{c.body}</p>
          {c.detail && (
            <p className="m-0 mt-4 border-t border-border pt-3 text-[16px] uppercase tracking-[0.08em] text-foreground">{c.detail}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Long-form story text. */
export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-[760px] space-y-5 text-[20px] leading-[1.55] text-foreground sm:text-[22px]">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 32)} className="m-0">{p}</p>
      ))}
    </div>
  );
}
