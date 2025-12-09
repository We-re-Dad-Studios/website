"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, Flame, ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <>
      {/* HERO - FULL VIEWPORT */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://downloads.ctfassets.net/3gg0xih7foqh/3rxvtQJQc3xmwVWRZzm5fS/c773572af2f7a1a49a886aa04135c5ef/Final_Withlogo.jpg"
            alt="WDS Universe"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Flame className="w-4 h-4 text-primary-0" />
              <span className="text-sm text-white/90 font-medium tracking-wide">
                New chapters dropping daily
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95]">
              Stories that
              <span className="block text-primary-0">won&apos;t let go</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Dark fantasy. Supernatural thriller. Two flagship novels. Zero filler.
              <span className="text-white"> Start free, get hooked.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="#flagships"
                className="group flex items-center gap-3 px-8 py-4 bg-primary-0 hover:bg-primary-0/90 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,76,16,0.4)]"
              >
                Choose Your Story
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-medium rounded-full transition-all duration-300 hover:bg-white/5"
              >
                Browse All Projects
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="w-full bg-black border-y border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <StatItem
              icon={<BookOpen className="w-5 h-5" />}
              value="20+"
              label="Chapters Live"
            />
            <StatItem
              icon={<Clock className="w-5 h-5" />}
              value="Daily"
              label="New Releases"
            />
            <StatItem
              icon={<Flame className="w-5 h-5" />}
              value="2"
              label="Flagship Novels"
            />
          </div>
        </div>
      </section>

      {/* FLAGSHIP NOVELS SECTION */}
      <section id="flagships" className="w-full bg-black py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Two Worlds. Two Stories. <span className="text-primary-0">Your Choice.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Each novel stands alone. Pick the one that calls to you—or read both.
            </p>
          </motion.div>

          {/* Two Flagship Cards */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* DAWNSHIPPER */}
            <motion.div
              className="relative bg-gradient-to-br from-orange-950/30 to-black border border-orange-500/20 rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/duorxojmh/image/upload/v1765045757/IMG_1190_1_hkbii6.jpg"
                  alt="Dawnshipper"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary-0 rounded-full text-xs font-bold uppercase tracking-wider text-white">
                  Dark Fantasy
                </div>
                
                {/* Progress */}
                <div className="absolute bottom-12 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="text-sm text-cyan-200 font-medium">Actively Updating</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white font-medium">20 chapters</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-0 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Dawnshipper
                </h3>

                <div className="space-y-3 text-white/80 leading-relaxed mb-6">
                  <p>
                    <span className="text-white font-medium">Devvyn never asked for power.</span> But 
                    when an Echo—a fragment of ancient, catastrophic magic—bonds to him without 
                    permission, he becomes the most dangerous thing in the empire:
                  </p>
                  <p className="text-purple-500 font-semibold text-lg">
                    An accident waiting to happen.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Magic System", "Political Intrigue", "Found Family"].map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs text-orange-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/novels/dawnshipper/chapters/echoes-and-embers"
                    className="group flex items-center justify-center gap-2 px-6 py-3 bg-primary-0 hover:bg-primary-0/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,76,16,0.3)]"
                  >
                    Start Reading
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/projects/dawnshipper"
                    className="flex items-center justify-center px-6 py-3 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-all"
                  >
                    All Chapters
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* PROJECT OSIRIS */}
            <motion.div
              className="relative bg-gradient-to-br from-cyan-950/30 to-black border border-cyan-500/20 rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg"
                  alt="Project Osiris"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-cyan-500 rounded-full text-xs font-bold uppercase tracking-wider text-black">
                  Sci-Fi Thriller
                </div>
                
                {/* Status indicator - adjust when you have chapter count */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-sm text-cyan-200 font-medium">Actively Updating</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Project Osiris
                </h3>

                <div className="space-y-3 text-white/80 leading-relaxed mb-6">
                  <p>
                    <span className="text-white font-medium">Death has become negotiable</span>—but 
                    only for the wealthy. Osiris Inc. retrieves souls from a liminal realm called 
                    the Light. But missions are failing. Teams are disappearing.
                  </p>
                  <p className="text-cyan-400 font-semibold text-lg">
                    Vania knows what she saw in there. And it&apos;s getting stronger.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Soul Retrieval", "Corporate Horror", "Team Zero"].map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs text-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/novels/project_osiris/chapters/chapter-1"
                    className="group flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                  >
                    Start Reading
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/projects/project_osiris"
                    className="flex items-center justify-center px-6 py-3 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-all"
                  >
                    All Chapters
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="w-full bg-gradient-to-b from-black to-neutral_1000 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
              What You&apos;re Getting Into
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-purple-500 font-bold text-lg mb-2">Free to Start</div>
                <p className="text-white/60 text-sm">Every novel begins with free chapters. No signup walls, no tricks.</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-purple-500 font-bold text-lg mb-2">Daily Updates</div>
                <p className="text-white/60 text-sm">New chapters drop every day or two. The story keeps moving.</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-purple-500 font-bold text-lg mb-2">Complete Arcs</div>
                <p className="text-white/60 text-sm">No abandoned projects. Both novels have planned endings.</p>
              </div>
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
    <div className="flex items-center gap-2 text-primary-0 mb-1">
      {icon}
      <span className="text-2xl md:text-3xl font-bold text-white">{value}</span>
    </div>
    <span className="text-xs md:text-sm text-white/50 uppercase tracking-wider">
      {label}
    </span>
  </div>
);