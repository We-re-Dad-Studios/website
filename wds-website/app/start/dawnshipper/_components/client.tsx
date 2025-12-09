"use client";

// app/start/dawnshipper/_components/client.tsx
// CONVERSION-FOCUSED LANDING PAGE
// Design: Cinematic, immersive, minimal friction

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";

export function StartDawnshipperClient() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* BACKGROUND - Full bleed cover image */}
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/duorxojmh/image/upload/v1765045757/IMG_1190_1_hkbii6.jpg  "
          alt="Dawnshipper"
          fill
          className="object-cover object-top opacity-50"
          priority
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-12 px-6">
        <div className="max-w-2xl mx-auto w-full">
          
          {/* Genre Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-0/20 border border-primary-0/40 rounded-full text-purple-500 text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Dark Epic Fantasy
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mt-4 mb-4 leading-[0.95]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Dawnshipper
          </motion.h1>

          {/* The Hook - This is the key */}
          <motion.div
            className="space-y-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              He bonded with the <span className="text-purple-500 font-semibold">something he shouldn&apos;t have</span>.
            </p>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Now everyone wants him dead.
            </p>
          </motion.div>

          {/* Trust indicators - small, subtle */}
          <motion.div
            className="flex flex-wrap items-center gap-4 mb-8 text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              20+ chapters
            </span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Updates daily
            </span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>Free to Read</span>
          </motion.div>

          {/* PRIMARY CTA - The only thing that matters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              href="/novels/dawnshipper/chapters/echoes-and-embers"
              className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-5 bg-primary-0 hover:bg-primary-0/90 text-white text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(249,76,16,0.4)]"
            >
              Read Chapter 1 Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Secondary link - very subtle */}
          <motion.p
            className="mt-6 text-center sm:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link
              href="/projects/dawnshipper"
              className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
            >
              View all chapters & details
            </Link>
          </motion.p>
        </div>
      </div>

      {/* Subtle branding - bottom corner */}
      <motion.div
        className="absolute bottom-4 right-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link href="/" className="opacity-40 hover:opacity-70 transition-opacity">
          <Image
            src="/images/WDS LOGO WHITE.png"
            alt="WDS"
            width={60}
            height={60}
            className="w-12 h-12"
          />
        </Link>
      </motion.div>
    </main>
  );
}