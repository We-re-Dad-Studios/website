"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, Flame, ArrowRight } from "lucide-react";
import { FlagshipProgress } from "@/components/reader/FlagshipProgress";
import { ContinueReading } from "@/components/reader/ContinueReading";
import { LatestReleases } from "@/components/LatestReleases";
import { RoyalRoadButton } from "@/components/RoyalRoadButton";

export const HeroSection = () => {
  return (
    <>
      {/* HERO - FULL VIEWPORT */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/Final_Withlogo.webp"
            alt="WDS Universe"
            fill
            className="object-cover"
            priority
          />
          {/* Single gradient — enough contrast for text without burying the image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-5 sm:mb-6">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-0" />
              <span className="text-xs sm:text-sm text-white/90 font-medium tracking-wide">
                New chapters dropping daily
              </span>
            </div>

            {/* Main Headline — smaller on mobile */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 leading-[0.95]">
              Stories that
              <span className="block text-primary-0">won&apos;t let go</span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              Dark fantasy. Supernatural thriller. Two flagship novels. Zero filler.
              <span className="text-white"> Start free, get hooked.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="#flagships"
                className="group flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 bg-primary-0 hover:bg-primary-0/90 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,76,16,0.4)]"
              >
                Choose Your Story
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="px-6 py-3.5 sm:px-8 sm:py-4 border-2 border-white/30 hover:border-white/60 text-white font-medium rounded-full transition-all duration-300 hover:bg-white/5"
              >
                Browse All Projects
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator — hidden on short screens */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* CONTINUE READING — only renders for returning readers with progress */}
      <ContinueReading />

      {/* STATS BAR */}
      <section className="w-full bg-background border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-8">
            <StatItem
              icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
              value="20+"
              label="Chapters Live"
            />
            <StatItem
              icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
              value="Daily"
              label="New Releases"
            />
            <StatItem
              icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5" />}
              value="2"
              label="Flagship Novels"
            />
          </div>
        </div>
      </section>

      {/* LATEST RELEASES — freshest chapters, the reason readers return */}
      <LatestReleases />

      {/* FLAGSHIP NOVELS SECTION */}
      <section id="flagships" className="w-full bg-background py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Two Worlds. Two Stories. <span className="text-primary-0">Your Choice.</span>
            </h2>
            <p className="text-wds-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Each novel stands alone. Pick the one that calls to you — or read both.
            </p>
          </motion.div>

          {/* Two Flagship Cards */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">

            {/* DAWNSHIPPER — always dark-themed: cinematic card */}
            <motion.div
              className="relative bg-gradient-to-br from-orange-950/30 to-neutral-950 border border-orange-500/20 rounded-2xl overflow-hidden group text-white"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Image — shorter on mobile */}
              <div className="relative aspect-[16/8] sm:aspect-[16/10] overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/duorxojmh/image/upload/v1765045757/IMG_1190_1_hkbii6.jpg"
                  alt="Dawnshipper"
                  fill
                  loading="lazy"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-primary-0 rounded-full text-xs font-bold uppercase tracking-wider text-white">
                  Dark Fantasy
                </div>

                {/* Status + Reader Progress */}
                <div className="absolute bottom-10 sm:bottom-12 left-3 right-3 sm:left-4 sm:right-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="text-xs sm:text-sm text-cyan-200 font-medium">Actively Updating</span>
                  </div>
                </div>
                <FlagshipProgress novelSlug="dawnshipper" accentColor="primary-0" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 lg:p-8">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                  Dawnshipper
                </h3>

                <div className="space-y-2 sm:space-y-3 text-white/80 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                  <p>
                    <span className="text-white font-medium">Devvyn never asked for power.</span> But
                    when an Echo — a fragment of ancient, catastrophic magic — bonds to him without
                    permission, he becomes the most dangerous thing in the empire:
                  </p>
                  <p className="text-purple-300 font-semibold text-base sm:text-lg">
                    An accident waiting to happen.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                  {["Magic System", "Political Intrigue", "Found Family"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs text-orange-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <Link
                    href="/novels/dawnshipper/chapters/echoes-and-embers"
                    className="group flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-primary-0 hover:bg-primary-0/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,76,16,0.3)]"
                  >
                    Start Reading
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/projects/dawnshipper"
                    className="flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-all"
                  >
                    All Chapters
                  </Link>
                </div>
                <RoyalRoadButton
                  slug="dawnshipper"
                  variant="link"
                  className="mt-3"
                  label="Also on Royal Road"
                />
              </div>
            </motion.div>

            {/* PROJECT OSIRIS */}
            {/* PROJECT OSIRIS — always dark-themed: cinematic card */}
            <motion.div
              className="relative bg-gradient-to-br from-cyan-950/30 to-neutral-950 border border-cyan-500/20 rounded-2xl overflow-hidden group text-white"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Image — shorter on mobile */}
              <div className="relative aspect-[16/8] sm:aspect-[16/10] overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg"
                  alt="Project Osiris"
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-cyan-500 rounded-full text-xs font-bold uppercase tracking-wider text-black">
                  Sci-Fi Thriller
                </div>

                {/* Status + Reader Progress */}
                <div className="absolute bottom-10 sm:bottom-12 left-3 right-3 sm:left-4 sm:right-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-xs sm:text-sm text-cyan-200 font-medium">Actively Updating</span>
                  </div>
                </div>
                <FlagshipProgress novelSlug="project_osiris" accentColor="cyan-500" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 lg:p-8">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                  Project Osiris
                </h3>

                <div className="space-y-2 sm:space-y-3 text-white/80 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                  <p>
                    <span className="text-white font-medium">Death has become negotiable</span> — but
                    only for the wealthy. Osiris Inc. retrieves souls from a liminal realm called
                    the Light. But missions are failing. Teams are disappearing.
                  </p>
                  <p className="text-cyan-300 font-semibold text-base sm:text-lg">
                    Vania knows what she saw in there. And it&apos;s getting stronger.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                  {["Soul Retrieval", "Corporate Horror", "Team Zero"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs text-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <Link
                    href="/novels/project_osiris/chapters/chapter-1"
                    className="group flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                  >
                    Start Reading
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/projects/project_osiris"
                    className="flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-all"
                  >
                    All Chapters
                  </Link>
                </div>
                <RoyalRoadButton
                  slug="project_osiris"
                  variant="link"
                  className="mt-3"
                  label="Also on Royal Road"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CLOSING CTA — drop readers straight into Chapter 1 */}
      <section className="w-full bg-gradient-to-b from-background to-wds-surface py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Start Reading — <span className="text-primary-0">it&apos;s free</span>
            </h2>
            <p className="text-wds-text-secondary text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10">
              No signup. No paywall on the opening arc. Just pick a world and fall in.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link
                href="/novels/dawnshipper/chapters/echoes-and-embers"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/40 to-neutral-950 p-5 sm:p-6 text-left text-white transition-all hover:border-orange-500/60 hover:shadow-[0_0_30px_rgba(249,76,16,0.25)]"
              >
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-primary-0">
                    Dark Fantasy
                  </span>
                  <span className="block text-xl sm:text-2xl font-bold">Dawnshipper</span>
                  <span className="text-sm text-white/60">Begin at Chapter 1</span>
                </span>
                <ArrowRight className="h-6 w-6 shrink-0 text-primary-0 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/novels/project_osiris/chapters/chapter-1"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 to-neutral-950 p-5 sm:p-6 text-left text-white transition-all hover:border-cyan-500/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]"
              >
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Sci-Fi Thriller
                  </span>
                  <span className="block text-xl sm:text-2xl font-bold">Project Osiris</span>
                  <span className="text-sm text-white/60">Begin at Chapter 1</span>
                </span>
                <ArrowRight className="h-6 w-6 shrink-0 text-cyan-400 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const StatItem = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="flex items-center gap-1.5 sm:gap-2 text-primary-0 mb-1">
      {icon}
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{value}</span>
    </div>
    <span className="text-[10px] sm:text-xs md:text-sm text-wds-text-secondary uppercase tracking-wider">
      {label}
    </span>
  </div>
);
