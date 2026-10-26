"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Mail,
  Sparkles,
  Check,
  BookOpen,
  Zap
} from "lucide-react";

/** Surface tokens supplied by the reader's own theme system (dark/midnight/sepia/light).
 *  Defaults preserve the original dark look when rendered outside the reader. */
interface ReaderThemeTokens {
  text: string;
  mutedText: string;
  border: string;
  cardBg: string;
}

const DEFAULT_THEME: ReaderThemeTokens = {
  text: "text-white",
  mutedText: "text-white/60",
  border: "border-white/10",
  cardBg: "bg-white/5",
};

interface ChapterEndCTAProps {
  nextChapter?: string | null;
  novelSlug: string;
  novelName: string;
  chapterNumber: number;
  theme?: ReaderThemeTokens;
}

const otherNovels = {
  dawnshipper: {
    title: "Project Osiris",
    tagline: "Death is negotiable—for a price.",
    genre: "Sci-Fi Thriller",
    image: "https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg",
    link: "/start/project_osiris",
    accentColor: "text-[var(--reader-accent)]",
    icon: Zap,
  },
  project_osiris: {
    title: "Dawnshipper",
    tagline: "He bonded with the Echo of Chaos.",
    genre: "Dark Epic Fantasy",
    image: "https://res.cloudinary.com/duorxojmh/image/upload/v1765045757/IMG_1190_1_hkbii6.jpg",
    link: "/start/dawnshipper",
    accentColor: "text-[var(--reader-accent)]",
    icon: BookOpen,
  },
};

export function ChapterEndCTA({
  nextChapter,
  novelSlug,
  novelName,
  chapterNumber,
  theme = DEFAULT_THEME,
}: ChapterEndCTAProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const otherNovel = otherNovels[novelSlug as keyof typeof otherNovels];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName: "Reader" }),
      });

      if (res.ok) {
        setIsSuccess(true);
        localStorage.setItem("newsletter-subscribed", "true");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 space-y-8">
      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className={`flex-1 h-px border-t ${theme.border}`} />
        <Sparkles className="w-5 h-5 text-[var(--reader-accent)]" />
        <div className={`flex-1 h-px border-t ${theme.border}`} />
      </div>

      {/* Next Chapter CTA - Most prominent */}
      {nextChapter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href={`/novels/${novelSlug}/chapters/${nextChapter}`}
            className="cut-tr-sm group block w-full bg-brand-indigo p-6 transition-colors hover:bg-brand-indigo-deep"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-[14px] font-bold uppercase tracking-[0.12em] text-brand-mist">
                  Continue Reading
                </p>
                <h3 className="font-plaguard text-[26px] font-normal leading-tight text-white md:text-[32px]">
                  Chapter {chapterNumber + 1}
                </h3>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-brand-pink transition-transform group-hover:translate-x-1">
                <ChevronRight className="h-6 w-6 text-brand-ink" />
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Newsletter + Other Project Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`${theme.cardBg} border ${theme.border} p-6 backdrop-blur-sm`}
        >
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-brand-green">
                <Check className="h-7 w-7 text-brand-ink" />
              </div>
              <h4 className={`text-xl font-bold ${theme.text} mb-2`}>You&apos;re subscribed! 🎉</h4>
              <p className={`${theme.mutedText} text-sm`}>
                Check your inbox for a welcome message.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center bg-brand-indigo">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-bold ${theme.text}`}>Get Chapter Updates</h4>
                  <p className={`text-xs ${theme.mutedText}`}>Never miss a new release</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-4 py-3 ${theme.cardBg} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm`}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 ${theme.cardBg} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm`}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cut-corners-sm min-h-[48px] w-full bg-brand-indigo font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-indigo-deep disabled:opacity-50"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe Free"}
                </button>
              </form>

              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}

              <p className={`text-center ${theme.mutedText} text-xs mt-3`}>
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}
        </motion.div>

        {/* Other Novel CTA */}
        {otherNovel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href={otherNovel.link}
              className={`group block h-full ${theme.cardBg} border ${theme.border} overflow-hidden hover:border-[var(--reader-accent)] transition-all`}
            >
              {/* Image (always over a dark gradient → light text) */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={otherNovel.image}
                  alt={otherNovel.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <otherNovel.icon className={`w-4 h-4 ${otherNovel.accentColor}`} />
                  <span className={`text-xs font-medium ${otherNovel.accentColor}`}>
                    {otherNovel.genre}
                  </span>
                </div>
                <h4 className={`text-lg font-bold ${theme.text} group-hover:text-[var(--reader-accent)] transition-colors mb-1`}>
                  {otherNovel.title}
                </h4>
                <p className={`text-sm ${theme.mutedText} mb-3`}>
                  {otherNovel.tagline}
                </p>
                <div className="flex items-center gap-2 text-sm text-[var(--reader-accent)] font-medium">
                  Start reading
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Back to all chapters */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <Link
          href={`/projects/${novelSlug}`}
          className={`inline-flex items-center gap-2 ${theme.mutedText} hover:text-[var(--reader-accent)] transition-colors text-sm`}
        >
          ← Back to all {novelName} chapters
        </Link>
      </motion.div>
    </div>
  );
}
