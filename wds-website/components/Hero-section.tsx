"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FlagshipProgress } from "@/components/reader/FlagshipProgress";
import { ContinueReading } from "@/components/reader/ContinueReading";
import { LatestReleases } from "@/components/LatestReleases";
import { RoyalRoadButton } from "@/components/RoyalRoadButton";
import { BrandStripes } from "@/components/BrandStripes";

export const HeroSection = () => {
  return (
    <>
      {/* HERO — always Mystical Indigo, the brand's lead surface */}
      <section className="relative w-full overflow-hidden bg-brand-indigo text-white">
        <BrandStripes className="left-0 top-0 h-[260px] w-[110px] sm:h-[400px] sm:w-[180px]" />
        <BrandStripes className="bottom-0 right-0 h-[260px] w-[110px] rotate-180 sm:h-[400px] sm:w-[180px]" />

        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-12 px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:gap-16">
          <motion.div
            className="min-w-0 flex-[2_1_520px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 border border-white/45 px-3 py-1.5 text-[15px] uppercase tracking-[0.1em] sm:text-[18px]">
              <span className="h-2.5 w-2.5 bg-brand-green" aria-hidden="true" />
              New chapters dropping daily
            </div>

            {/* Main headline — Plaguard, pink only at display size (~3:1 on indigo) */}
            {/* Sizes keep each line on one row: "STORIES THAT" ≈ 6.43em wide */}
            <h1 className="my-6 font-plaguard text-[50px] font-normal leading-[0.95] tracking-[0.01em] sm:my-7 sm:text-[72px] lg:text-[78px] xl:text-[100px]">
              Stories that
              <span className="block text-brand-pink">won&apos;t let go</span>
            </h1>

            <p className="mb-8 max-w-[560px] text-[21px] leading-[1.35] text-brand-mist sm:mb-10 sm:text-[25px]">
              Dark fantasy. Supernatural thriller. Two flagship novels. Zero filler.{" "}
              <strong className="text-white">Start free, get hooked.</strong>
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="#flagships"
                className="cut-corners group inline-flex min-h-14 items-center justify-center gap-3 bg-brand-pink px-8 text-[20px] font-bold uppercase tracking-[0.06em] text-brand-ink transition-colors hover:bg-[#F87FE2] sm:text-[22px]"
              >
                Choose your story
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex min-h-14 items-center justify-center border-2 border-white px-7 text-[20px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white hover:text-brand-indigo sm:text-[22px]"
              >
                Browse all projects
              </Link>
            </div>
          </motion.div>

          {/* Poster — the billboard treatment from the guidelines */}
          <motion.div
            className="flex min-w-0 flex-[1_1_380px] justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative w-full max-w-[440px]">
              <div aria-hidden="true" className="cut-corners-lg absolute inset-0 translate-x-[14px] translate-y-[14px] bg-brand-pink sm:translate-x-[18px] sm:translate-y-[18px]" />
              <figure className="cut-corners-lg relative aspect-[4/5] overflow-hidden bg-brand-ink">
                <Image
                  src="/images/devvyn-hero.jpg"
                  alt="Devvyn, the hero of Dawnshipper, in torn overalls with pink Echo magic coiling around his fist"
                  fill
                  priority
                  sizes="(min-width: 1024px) 440px, 90vw"
                  className="object-cover object-[center_18%]"
                />
                <Image
                  src="/images/wds-mark-white.svg"
                  alt=""
                  width={72}
                  height={30}
                  className="absolute left-6 top-6 h-auto w-[64px] sm:w-[72px]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-brand-indigo px-6 pb-6 pt-5 sm:px-7">
                  <span className="block font-plaguard text-[34px] leading-[0.98] text-brand-pink sm:text-[42px]">
                    Feel the
                    <br />
                    experience
                  </span>
                  <span className="mt-2 block text-[16px] uppercase tracking-[0.1em] text-brand-mist sm:text-[18px]">
                    Dawnshipper · Dark fantasy
                  </span>
                </figcaption>
              </figure>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTINUE READING — only renders for returning readers with progress */}
      <ContinueReading />

      {/* STATS BAR */}
      <section aria-label="At a glance" className="w-full border-b-2 border-primary-0 bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-3 px-4 sm:px-6">
          <StatItem value="20+" label="Chapters live" />
          <StatItem value="Daily" label="New releases" />
          <StatItem value="2" label="Flagship novels" last />
        </div>
      </section>

      {/* LATEST RELEASES — freshest chapters, the reason readers return */}
      <LatestReleases />

      {/* FLAGSHIP NOVELS SECTION */}
      <section id="flagships" className="w-full scroll-mt-20 bg-secondary px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-t-2 border-primary-0 pb-5 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="m-0 font-plaguard text-[34px] font-normal leading-[1.05] text-primary-0 sm:text-[46px] lg:text-[60px]">
              Two worlds. Two stories.{" "}
              <span className="whitespace-nowrap bg-brand-pink px-3 text-brand-ink">Your choice.</span>
            </h2>
            <p className="m-0 max-w-[380px] text-[19px] text-wds-text-secondary sm:text-[21px]">
              Each novel stands alone. Pick the one that calls to you — or read both.
            </p>
          </motion.div>

          {/* Two Flagship Cards — always ink: cinematic cards */}
          <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-2">
            <FlagshipCard
              slug="dawnshipper"
              title="Dawnshipper"
              genre="Dark fantasy"
              accent="pink"
              image="https://res.cloudinary.com/duorxojmh/image/upload/v1765045757/IMG_1190_1_hkbii6.jpg"
              imageAlt="Dawnshipper"
              imagePosition="object-top"
              readHref="/novels/dawnshipper/chapters/echoes-and-embers"
              chaptersHref="/projects/dawnshipper"
              tags={["Magic system", "Political intrigue", "Found family"]}
              hook="An accident waiting to happen."
              delay={0}
            >
              <strong className="font-bold text-white">Devvyn never asked for power.</strong> But
              when an Echo — a fragment of ancient, catastrophic magic — bonds to him without
              permission, he becomes the most dangerous thing in the empire:
            </FlagshipCard>

            <FlagshipCard
              slug="project_osiris"
              title="Project Osiris"
              genre="Sci-fi thriller"
              accent="green"
              image="https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg"
              imageAlt="Project Osiris"
              imagePosition="object-center"
              readHref="/novels/project_osiris/chapters/chapter-1"
              chaptersHref="/projects/project_osiris"
              tags={["Soul retrieval", "Corporate horror", "Team Zero"]}
              hook="Vania knows what she saw in there. And it's getting stronger."
              delay={0.1}
            >
              <strong className="font-bold text-white">Death has become negotiable</strong> — but
              only for the wealthy. Osiris Inc. retrieves souls from a liminal realm called the
              Light. But missions are failing. Teams are disappearing.
            </FlagshipCard>
          </div>
        </div>
      </section>

      {/* CLOSING CTA — drop readers straight into Chapter 1 */}
      <section className="relative w-full overflow-hidden bg-brand-indigo px-4 py-16 text-white sm:px-6 sm:py-24">
        <BrandStripes className="right-0 top-0 h-[300px] w-[130px] -scale-x-100 sm:h-[400px] sm:w-[180px]" />
        <motion.div
          className="relative mx-auto flex max-w-7xl flex-wrap items-end gap-10 lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="min-w-0 flex-[1_1_440px]">
            <h2 className="mb-5 font-plaguard text-[44px] font-normal leading-[0.98] sm:text-[64px] lg:text-[84px]">
              Start reading
              <span className="block text-brand-green">it&apos;s free</span>
            </h2>
            <p className="m-0 max-w-[480px] text-[21px] text-brand-mist sm:text-[24px]">
              No signup. No paywall on the opening arc. Just pick a world and fall in.
            </p>
          </div>

          <div className="grid min-w-0 flex-[1_1_520px] gap-4 sm:grid-cols-2">
            <StartCard
              href="/novels/dawnshipper/chapters/echoes-and-embers"
              genre="Dark fantasy"
              title="Dawnshipper"
              className="bg-brand-pink hover:bg-[#F87FE2]"
            />
            <StartCard
              href="/novels/project_osiris/chapters/chapter-1"
              genre="Sci-fi thriller"
              title="Project Osiris"
              className="bg-brand-green hover:bg-[#5CF7A3]"
            />
          </div>
        </motion.div>
      </section>
    </>
  );
};

// Pink pairs with Dawnshipper, green with Project Osiris. Both take ink text.
const ACCENTS = {
  pink: {
    badge: "bg-brand-pink",
    hook: "text-brand-pink",
    tag: "border-brand-pink",
    cta: "bg-brand-pink hover:bg-[#F87FE2]",
    progress: "brand-pink",
  },
  green: {
    badge: "bg-brand-green",
    hook: "text-brand-green",
    tag: "border-brand-green",
    cta: "bg-brand-green hover:bg-[#5CF7A3]",
    progress: "brand-green",
  },
} as const;

const FlagshipCard = ({
  slug,
  title,
  genre,
  accent,
  image,
  imageAlt,
  imagePosition,
  readHref,
  chaptersHref,
  tags,
  hook,
  delay,
  children,
}: {
  slug: string;
  title: string;
  genre: string;
  accent: keyof typeof ACCENTS;
  image: string;
  imageAlt: string;
  imagePosition: string;
  readHref: string;
  chaptersHref: string;
  tags: string[];
  hook: string;
  delay: number;
  children: React.ReactNode;
}) => {
  const a = ACCENTS[accent];
  return (
    <motion.article
      className="group relative flex flex-col overflow-hidden border border-white/10 bg-brand-ink text-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="cut-tr relative aspect-[16/9] overflow-hidden sm:aspect-[16/10]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 620px, 100vw"
          className={`object-cover ${imagePosition} transition-transform duration-700 group-hover:scale-105`}
        />

        <span className={`absolute left-3 top-3 px-3 py-1 text-[15px] font-bold uppercase tracking-[0.12em] text-brand-ink sm:left-4 sm:top-4 sm:text-[16px] ${a.badge}`}>
          {genre}
        </span>

        {/* Status sits above the reader-progress strip */}
        <span className="absolute bottom-10 left-3 inline-flex items-center gap-2 bg-brand-ink px-3 py-1 text-[14px] uppercase tracking-[0.1em] sm:bottom-12 sm:left-4 sm:text-[16px]">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping bg-brand-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-brand-green" />
          </span>
          Actively updating
        </span>
        <FlagshipProgress novelSlug={slug} accentColor={a.progress} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:gap-5 sm:p-7 lg:p-8">
        <h3 className="m-0 font-plaguard text-[36px] font-normal leading-none sm:text-[46px]">{title}</h3>

        <p className="m-0 text-[19px] leading-[1.45] text-[#C9C8EE] sm:text-[21px]">{children}</p>
        <p className={`m-0 text-[21px] font-bold leading-snug sm:text-[24px] ${a.hook}`}>{hook}</p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className={`border px-3 py-0.5 text-[16px] tracking-[0.04em] sm:text-[17px] ${a.tag}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={readHref}
            className={`cut-corners-sm group/cta inline-flex min-h-[50px] items-center justify-center gap-2.5 px-6 text-[19px] font-bold uppercase tracking-[0.06em] text-brand-ink transition-colors sm:text-[20px] ${a.cta}`}
          >
            Start reading
            <ArrowRight className="h-5 w-5 transition-transform group-hover/cta:translate-x-1" strokeWidth={2.5} />
          </Link>
          <Link
            href={chaptersHref}
            className="inline-flex min-h-[50px] items-center justify-center border-2 border-white/70 px-6 text-[19px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:border-white hover:bg-white/10 sm:text-[20px]"
          >
            All chapters
          </Link>
          <RoyalRoadButton
            slug={slug}
            variant="link"
            className="text-[19px] text-brand-mist hover:text-white"
            label="Also on Royal Road"
          />
        </div>
      </div>
    </motion.article>
  );
};

const StartCard = ({
  href,
  genre,
  title,
  className,
}: {
  href: string;
  genre: string;
  title: string;
  className: string;
}) => (
  <Link
    href={href}
    className={`cut-tr-sm group flex flex-col gap-1.5 p-6 text-brand-ink transition-colors ${className}`}
  >
    <span className="text-[15px] font-bold uppercase tracking-[0.14em] sm:text-[16px]">{genre}</span>
    <span className="font-plaguard text-[30px] leading-none sm:text-[34px]">{title}</span>
    <span className="mt-4 flex items-center justify-between text-[19px] font-bold sm:text-[20px]">
      Begin at chapter 1
      <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
    </span>
  </Link>
);

const StatItem = ({
  value,
  label,
  last = false,
}: {
  value: string;
  label: string;
  last?: boolean;
}) => (
  <div className={`flex flex-col items-center px-2 py-6 text-center sm:py-8 ${last ? "" : "border-r border-border"}`}>
    <span className="font-plaguard text-[30px] leading-none text-primary-0 sm:text-[44px] md:text-[56px]">
      {value}
    </span>
    <span className="mt-2 text-[14px] uppercase tracking-[0.12em] text-wds-text-secondary sm:text-[18px]">
      {label}
    </span>
  </div>
);
