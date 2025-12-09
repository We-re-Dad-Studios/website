"use client";

// app/projects/project_osiris/_components/main.tsx
// RESTRUCTURED PROJECT PAGE
// Fixes: Mobile ordering, hook visibility, clearer CTA hierarchy

import Image from "next/image";
import Link from "next/link";
import { Entry } from "contentful";

import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Zap } from "lucide-react";
import { ChapterListComponent } from "@/app/projects/components/chapter-list-component";

type Chapter = {
  id: string;
  slug: string;
  title: string;
  chapterNumber: number | string;
  isFree: boolean;
  releaseDate: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function OsirisContent({
  relatedPosts,
  chapters,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedPosts: Entry<any>[];
  chapters: Chapter[];
}) {
  return (
    <div className="w-full">
      {/* ============ HERO SECTION - ALWAYS FIRST ============ */}
      <section className="relative w-full min-h-[70vh] flex items-end pb-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg"
            alt="Project Osiris"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          {/* Subtle cyan tint for sci-fi feel */}
          <div className="absolute inset-0 bg-cyan-950/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Genre Badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-cyan-400 text-sm font-medium mb-4">
              <Zap className="w-3.5 h-3.5" />
              Sci-Fi Thriller
            </span>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Project Osiris
            </h1>

            {/* Hook - THE MOST IMPORTANT PART */}
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mb-6">
            Death is now <span className="text-cyan-400 font-semibold">negotiable</span>- resurrection has become commercialized.
Professional Walkers brave the light to snatch souls back from the death gods themselves.
But humanity soon learns, the price of defying death isuch more steep than they can pay.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {chapters.length > 0 ? `${chapters.length} chapters` : "Coming soon"}
              </span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Updates regularly
              </span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span>Free to start</span>
            </div>

            {/* Primary CTA */}
            {chapters.length > 0 ? (
              <Link
                href={`/novels/project_osiris/chapters/${chapters[0]?.slug || 'chapter-1'}`}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black text-lg font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                Start Reading Chapter 1
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white/70 text-lg font-bold rounded-xl">
                Chapters Coming Soon
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT COLUMN - Story Details (shows first on mobile now) */}
          <div className="flex-1 max-w-3xl order-1">

            {/* Description */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold text-white mb-4">The Story</h2>
              <div className="text-lg leading-relaxed text-neutral_300 space-y-4">
                <p>
           In the near future, death has become negotiable—but only for the wealthy. Thanks to Osiris Inc., the world&apos;s first soul-retrieval company, anyone can be brought back—as long as their Time of Death hasn&apos;t exceeded 48 hours.
Walkers, elite operatives trained to extract souls within a dangerous liminal realm called the Light, maintain this impossible industry. But missions are failing. Teams are disappearing.
When seventeen-year-old Sami Illia becomes the sole survivor of a catastrophic retrieval mission, He is reassigned to Team Zero—an outcast squad no one expects to succeed. But Sami knows what he saw in the Light… and it is getting stronger.
                </p>
                <p>
                  Walkers, elite operatives trained to extract souls within a dangerous
                  liminal realm called the Light, maintain this impossible industry.
                  But missions are failing. Teams are disappearing.
                </p>
                <p>
                  When seventeen-year-old Vania Illia becomes the sole survivor of a
                  catastrophic retrieval mission, she is reassigned to Team Zero—an
                  outcast squad no one expects to succeed. But Vania knows what she saw
                  in the Light… and it is getting stronger.
                </p>
              </div>
            </motion.div>

            {/* Genres */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mb-10"
            >
              <h3 className="text-lg font-semibold text-white mb-3">Genres & Tags</h3>
              <div className="flex gap-2 flex-wrap">
                {["Science Fantasy", "Supernatural Thriller", "Dystopian", "Corporate Horror", "Team Dynamics"].map(
                  (g) => (
                    <span
                      key={g}
                      className="px-3 py-1.5 text-sm bg-cyan-500/10 text-cyan-200 rounded-full border border-cyan-500/20"
                    >
                      {g}
                    </span>
                  )
                )}
              </div>
            </motion.div>

            {/* Why Readers Will Love It */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Why You&apos;ll Love Project Osiris
              </h3>
              <ul className="space-y-3 text-neutral_300">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✦</span>
                  A haunting liminal realm where the rules of reality don&apos;t apply
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✦</span>
                  Corporate dystopia meets supernatural horror
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✦</span>
                  A misfit team forced to confront impossible odds
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✦</span>
                  Mystery that deepens with every mission
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✦</span>
                  A protagonist who knows too much—and can&apos;t prove any of it
                </li>
              </ul>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR - Chapters (shows second on mobile) */}
          <aside className="w-full lg:w-[380px] order-2 flex flex-col gap-8">

            {/* Chapters Box */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Chapters
                </h3>
                <span className="text-sm text-white/50">
                  {chapters.length > 0 ? `${chapters.length} available` : "Coming soon"}
                </span>
              </div>

              <ChapterListComponent
                chapters={chapters}
                projectSlug="project_osiris"
              />
            </motion.div>

            {/* Social */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm"
            >
              <p className="font-semibold text-white mb-4">Follow for Updates</p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://www.tiktok.com/@weredadstudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <FaTiktok className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://www.instagram.com/weredadstudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <FaInstagram className="w-6 h-6 text-white" />
                </a>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* ============ RELATED POSTS ============ */}
        {relatedPosts.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Related Posts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 6).map((post) => (
                <RelatedCard
                  key={post.sys.id}
                  title={post.fields.title as unknown as string}
                  description={post.fields.description as unknown as string}
                  to={`/blog/${post.sys.id}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ============ MOBILE STICKY CTA ============ */}
      {chapters.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50">
          <Link
            href={`/novels/project_osiris/chapters/${chapters[0]?.slug || 'chapter-1'}`}
            className="flex items-center justify-center gap-2 w-full py-4 bg-cyan-500 text-black font-bold rounded-xl"
          >
            Start Reading Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}

// ---- Related Card ----
function RelatedCard({
  title,
  description,
  to,
}: {
  title: string;
  description: string;
  to: string;
}) {
  return (
    <Link
      href={to}
      className="group border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition"
    >
      <div className="aspect-video relative bg-neutral_900">
        <Image
          src="/images/WDS LOGO WHITE.png"
          alt={title}
          fill
          className="object-contain p-6 opacity-50 group-hover:opacity-70 transition"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-neutral_400 mt-2 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}

export const Main = OsirisContent;