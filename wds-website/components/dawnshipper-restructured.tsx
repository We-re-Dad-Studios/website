"use client";

// app/projects/dawnshipper/_components/main.tsx
// RESTRUCTURED PROJECT PAGE
// Fixes: Mobile ordering, hook visibility, clearer CTA hierarchy

import Image from "next/image";
import Link from "next/link";
import { withFadeIn } from "@/utils/withFadeIn";
import { Entry } from "contentful";

import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Flame } from "lucide-react";
import { Chapter } from "@/app/projects/dawnshipper/page";
import { ChapterListComponent } from "@/app/projects/components/chapter-list-component";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function MainContent({
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
            src="https://res.cloudinary.com/duorxojmh/image/upload/v1765045757/IMG_1190_1_hkbii6.jpg"
            alt="Dawnshipper"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Genre Badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-0/20 border border-primary-0/40 rounded-full text-primary-0 text-sm font-medium mb-4">
              <Flame className="w-3.5 h-3.5" />
              Dark Epic Fantasy
            </span>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Dawnshipper
            </h1>

            {/* Hook - THE MOST IMPORTANT PART */}
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mb-6">
              He bonded with  <span className="text-primary-0 font-semibold">something he shouldn&apos;t have</span>—an 
              impossible connection that breaks the rules of magic. Now hunted by those who&apos;d 
              weaponize him and feared by those who&apos;d destroy him.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {chapters.length} chapters
              </span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Updates daily
              </span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span>Free to start</span>
            </div>

            {/* Primary CTA */}
            <Link
              href={`/novels/dawnshipper/chapters/${chapters[0]?.slug || 'echoes-and-embers'}`}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary-0 hover:bg-primary-0/90 text-white text-lg font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,76,16,0.4)]"
            >
              Start Reading Chapter 1
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
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
                  In the world of Thaloria, power is everything. Humans wield
                  elemental magic by forming connections with Echoes—semi-sentient
                  conduits of energy. The alliance between the powers teeters on
                  collapse, as political tensions edge toward civil war.
                </p>
                <p>
                  Devvyn, a stubborn lowborn troublemaker, forms an impossible bond,granting him powers that breaks the rules 
                  of the world. As new threats move across the continent, Devvyn must 
                  uncover the truth behind his family&apos;s legacy... or become the spark 
                  that ignites Thaloria&apos;ss downfall.
                </p>
              </div>
            </motion.div>

            {/* Chapter 1 Preview */}
            {chapters[0]?.previewText && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mb-10 bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  Chapter 1 Preview
                </h3>
                <p className="text-neutral_300 leading-relaxed italic">
                  &quot;{chapters[0].previewText}&quot;
                </p>
                <Link
                  href={`/novels/dawnshipper/chapters/${chapters[0].slug}`}
                  className="inline-flex items-center gap-2 mt-4 text-primary-0 hover:text-primary-0/80 font-medium transition-colors"
                >
                  Continue reading
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}

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
                {["Dark Epic Fantasy", "Magic System", "Academy", "Political Intrigue", "Found Family"].map(
                  (g) => (
                    <span
                      key={g}
                      className="px-3 py-1.5 text-sm bg-white/10 text-white/80 rounded-full border border-white/10"
                    >
                      {g}
                    </span>
                  )
                )}
              </div>
            </motion.div>

            {/* Why Readers Love It */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Why Readers Love Dawnshipper
              </h3>
              <ul className="space-y-3 text-neutral_300">
                <li className="flex items-start gap-3">
                  <span className="text-primary-0 mt-1">✦</span>
                  A grounded yet powerful magic system shaped by elemental Echoes
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-0 mt-1">✦</span>
                  An academy arc filled with ambition, rivalry, and brutal trials
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-0 mt-1">✦</span>
                  A continent on the edge of civil war
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-0 mt-1">✦</span>
                  Antagonists with real motives—not filler villains
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-0 mt-1">✦</span>
                  A story that rewards careful reading and theory-crafting
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
                  <BookOpen className="w-5 h-5 text-primary-0" />
                  Chapters
                </h3>
                <span className="text-sm text-white/50">
                  {chapters.length} available
                </span>
              </div>

              <ChapterListComponent
                chapters={chapters}
                projectSlug="dawnshipper"
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50">
        <Link
          href={`/novels/dawnshipper/chapters/${chapters[0]?.slug || 'echoes-and-embers'}`}
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary-0 text-white font-bold rounded-xl"
        >
          Start Reading Free
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
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
        <h3 className="text-lg font-semibold text-white group-hover:text-primary-0 transition line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-neutral_400 mt-2 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}

export const Main = withFadeIn(MainContent);