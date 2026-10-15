"use client";

// Shared landing page for each novel (/projects/dawnshipper, /projects/project_osiris).
// Brand layout: indigo hero with poster, deck-style section headers, and the
// novel's identity accent (Dawnshipper = Pink Fantasy, Osiris = Electric Green).

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Entry } from "contentful";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { BrandStripes } from "@/components/BrandStripes";
import { ChapterListComponent } from "@/app/projects/components/chapter-list-component";
import { ContinueReadingCard } from "@/components/reader/ContinueReadingCard";
import { ReaderStatsCard } from "@/components/reader/ReaderStatsCard";
import { getOnSiteChapterLimit, getRoyalRoadLink } from "@/lib/royal-road";

export type NovelChapter = {
  id: string;
  slug: string;
  title: string;
  chapterNumber: number | string;
  isFree: boolean;
  releaseDate: string;
};

// Accents are fills with Ink text — never text on light grounds (pink is ~2.9:1 on white).
const ACCENTS = {
  pink: {
    fill: "bg-brand-pink",
    hover: "hover:bg-[#F87FE2]",
    border: "border-brand-pink",
    plate: "bg-brand-pink text-brand-ink",
  },
  green: {
    fill: "bg-brand-green",
    hover: "hover:bg-[#5CF7A3]",
    border: "border-brand-green",
    plate: "bg-brand-green text-brand-ink",
  },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function NovelPage({
  slug,
  title,
  genre,
  accent,
  poster,
  hook,
  story,
  tags,
  reasonsTitle,
  reasons,
  cadence,
  chapters,
  relatedPosts,
}: {
  slug: string;
  title: string;
  genre: string;
  accent: keyof typeof ACCENTS;
  poster: { src: string; alt: string; position?: string };
  /** One or two sentences; wrap the key phrase in <Highlight> */
  hook: ReactNode;
  story: string[];
  tags: string[];
  reasonsTitle: string;
  reasons: string[];
  cadence: string;
  chapters: NovelChapter[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedPosts: Entry<any>[];
}) {
  const a = ACCENTS[accent];
  const first = chapters[0];
  const firstHref = first ? `/novels/${slug}/chapters/${first.slug}` : null;
  const royalRoadUrl = getRoyalRoadLink(slug);
  const onSiteLimit = getOnSiteChapterLimit(
    slug,
    chapters.map((c) => Number(c.chapterNumber))
  );
  const splitNote =
    royalRoadUrl && Number.isFinite(onSiteLimit) && chapters.length > 0
      ? `Chapters 1–${onSiteLimit} free here · the rest on Royal Road`
      : "Free to start";

  return (
    <div className="w-full">
      {/* ============ HERO — always Mystical Indigo ============ */}
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

            <div>
              <span className={`inline-block px-3 py-1 text-[15px] font-bold uppercase tracking-[0.12em] sm:text-[16px] ${a.plate}`}>
                {genre}
              </span>
            </div>

            <h1 className="my-5 font-plaguard text-[48px] font-normal leading-[0.95] sm:text-[72px] lg:text-[78px] xl:text-[96px]">
              {title}
            </h1>

            <p className="mb-6 max-w-[620px] text-[21px] leading-[1.4] text-brand-mist sm:text-[24px]">
              {hook}
            </p>

            <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-[16px] uppercase tracking-[0.1em] text-brand-mist sm:text-[18px]">
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {chapters.length > 0 ? `${chapters.length} chapters` : "Coming soon"}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-brand-green" aria-hidden="true" />
                {cadence}
              </li>
              <li>{splitNote}</li>
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              {firstHref ? (
                <Link
                  href={firstHref}
                  className={`cut-corners group inline-flex min-h-14 items-center justify-center gap-3 px-8 text-[20px] font-bold uppercase tracking-[0.06em] text-brand-ink transition-colors sm:text-[22px] ${a.fill} ${a.hover}`}
                >
                  Start reading chapter 1
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                </Link>
              ) : (
                <span className="inline-flex min-h-14 items-center justify-center border-2 border-white/40 px-8 text-[20px] font-bold uppercase tracking-[0.06em] text-white/70">
                  Chapters coming soon
                </span>
              )}
              {royalRoadUrl && (
                <a
                  href={royalRoadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-2 border-2 border-white px-7 text-[20px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white hover:text-brand-indigo sm:text-[22px]"
                >
                  Read on Royal Road
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                </a>
              )}
            </div>
            {royalRoadUrl && (
              <p className="mt-3 text-[16px] text-brand-mist sm:text-[18px]">
                New chapters go up first on Royal Road.
              </p>
            )}
          </motion.div>

          {/* Poster */}
          <motion.div
            className="flex min-w-0 flex-[1_1_340px] justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative w-full max-w-[400px]">
              <div aria-hidden="true" className={`cut-corners-lg absolute inset-0 translate-x-[14px] translate-y-[14px] sm:translate-x-[18px] sm:translate-y-[18px] ${a.fill}`} />
              <figure className="cut-corners-lg relative m-0 aspect-[4/5] overflow-hidden bg-brand-ink">
                <Image
                  src={poster.src}
                  alt={poster.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 400px, 90vw"
                  className={`object-cover ${poster.position ?? "object-center"}`}
                />
                <Image
                  src="/images/wds-mark-white.svg"
                  alt=""
                  width={64}
                  height={26}
                  className="absolute left-5 top-5 h-auto w-[56px] sm:w-[64px]"
                />
              </figure>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <div className="mx-auto max-w-7xl px-4 pb-32 pt-14 sm:px-6 sm:pt-20 lg:pb-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Story column */}
          <div className="min-w-0 flex-1">
            <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeader>The story</SectionHeader>
              <div className="mt-6 max-w-[680px] space-y-5 text-[20px] leading-[1.55] text-wds-text-secondary sm:text-[22px]">
                {story.map((p) => (
                  <p key={p.slice(0, 32)} className="m-0">{p}</p>
                ))}
              </div>
            </motion.section>

            {first && (
              <motion.section
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-14"
              >
                <SectionHeader>Begin here</SectionHeader>
                <Link
                  href={firstHref as string}
                  className="group mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border px-1 py-5 text-foreground transition-colors hover:bg-foreground/5"
                >
                  <span className={`px-2.5 py-0.5 text-[15px] font-bold uppercase tracking-[0.1em] ${a.plate}`}>
                    Ch. {first.chapterNumber}
                  </span>
                  <span className="min-w-0 flex-[1_1_240px] text-[24px] font-bold leading-tight">{first.title}</span>
                  <span className="inline-flex items-center gap-2 text-[18px] font-bold uppercase tracking-[0.06em] text-primary-0">
                    Read free
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </span>
                </Link>
              </motion.section>
            )}

            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-14"
            >
              <SectionHeader>{reasonsTitle}</SectionHeader>
              <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {reasons.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[19px] leading-snug text-foreground sm:text-[20px]">
                    <span aria-hidden="true" className={`mt-[7px] h-3 w-3 shrink-0 -skew-x-[30deg] ${a.fill}`} />
                    {r}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="border border-primary-0 px-3 py-1 text-[17px] text-primary-0">
                    {t}
                  </span>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <aside className="flex w-full flex-col gap-8 lg:w-[400px]">
            <ContinueReadingCard novelSlug={slug} />
            <ReaderStatsCard />

            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              aria-labelledby={`${slug}-chapters`}
              className="border border-border border-t-4 border-t-primary-0 bg-card p-5 sm:p-6"
            >
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 id={`${slug}-chapters`} className="m-0 font-plaguard text-[30px] font-normal leading-none text-primary-0">
                  Chapters
                </h2>
                <span className="text-[16px] text-wds-text-secondary">
                  {chapters.length > 0 ? `${chapters.length} published` : "Coming soon"}
                </span>
              </div>
              <ChapterListComponent chapters={chapters} projectSlug={slug} />
            </motion.section>

            <section className="border border-border bg-card p-5 text-center sm:p-6">
              <p className="m-0 mb-4 text-[18px] font-bold uppercase tracking-[0.1em] text-foreground">
                Follow for updates
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href="https://www.tiktok.com/@weredadstudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-12 w-12 items-center justify-center bg-brand-indigo text-white transition-colors hover:bg-brand-indigo-deep"
                >
                  <FaTiktok className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/weredadstudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-12 w-12 items-center justify-center bg-brand-indigo text-white transition-colors hover:bg-brand-indigo-deep"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
              </div>
            </section>
          </aside>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-20"
          >
            <SectionHeader>From the studio blog</SectionHeader>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.slice(0, 6).map((post) => (
                <Link
                  key={post.sys.id}
                  href={`/blog/${post.sys.id}`}
                  className="group flex flex-col border border-border border-t-4 border-t-primary-0 bg-card p-5 transition-colors hover:bg-foreground/5"
                >
                  <span className="text-[22px] font-bold leading-tight text-foreground line-clamp-2">
                    {post.fields.title as unknown as string}
                  </span>
                  <span className="mt-2 text-[17px] text-wds-text-secondary line-clamp-2">
                    {post.fields.description as unknown as string}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-[16px] font-bold uppercase tracking-[0.08em] text-primary-0">
                    Read post
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Mobile sticky CTA */}
      {firstHref && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur-lg lg:hidden">
          <Link
            href={firstHref}
            className={`cut-corners-sm flex min-h-[52px] w-full items-center justify-center gap-2 text-[19px] font-bold uppercase tracking-[0.06em] text-brand-ink ${a.fill}`}
          >
            Start reading free
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-t-2 border-primary-0 pb-4 pt-3">
      <h2 className="m-0 font-plaguard text-[30px] font-normal leading-none text-primary-0 sm:text-[40px]">
        {children}
      </h2>
    </div>
  );
}

/** Marks the key phrase of a hook: accent plate with Ink text (readable on indigo). */
export function Highlight({
  accent,
  children,
}: {
  accent: keyof typeof ACCENTS;
  children: ReactNode;
}) {
  return (
    <span className={`px-1.5 font-bold [box-decoration-break:clone] [-webkit-box-decoration-break:clone] ${ACCENTS[accent].plate}`}>
      {children}
    </span>
  );
}
