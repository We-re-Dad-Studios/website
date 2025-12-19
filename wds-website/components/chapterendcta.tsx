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

interface ChapterEndCTAProps {
  nextChapter?: string | null;
  novelSlug: string;
  novelName: string;
  chapterNumber: number;
}

const otherNovels = {
  dawnshipper: {
    title: "Project Osiris",
    tagline: "Death is negotiable—for a price.",
    genre: "Sci-Fi Thriller",
    image: "https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg",
    link: "/start/project_osiris",
    accentColor: "text-cyan-400",
    icon: Zap,
  },
  project_osiris: {
    title: "Dawnshipper",
    tagline: "He bonded with the Echo of Chaos.",
    genre: "Dark Epic Fantasy",
    image: "https://res.cloudinary.com/duorxojmh/image/upload/v1765045757/IMG_1190_1_hkbii6.jpg",
    link: "/start/dawnshipper",
    accentColor: "text-purple-400",
    icon: BookOpen,
  },
};

export function ChapterEndCTA({
  nextChapter,
  novelSlug,
  novelName,
  chapterNumber,
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
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <Sparkles className="w-5 h-5 text-primary-0" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
            className="group block w-full p-6 bg-gradient-to-r from-primary-0/20 to-orange-600/20 border border-primary-0/30 rounded-2xl hover:border-primary-0/60 transition-all hover:shadow-[0_0_30px_rgba(249,76,16,0.2)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-500 font-medium mb-1">
                  Continue Reading
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  Chapter {chapterNumber + 1}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChevronRight className="w-6 h-6 text-white" />
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
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-7 h-7 text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">You&apos;re subscribed! 🎉</h4>
              <p className="text-white/60 text-sm">
                Check your inbox for a welcome message.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-0/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-0" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Get Chapter Updates</h4>
                  <p className="text-xs text-white/50">Never miss a new release</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-0 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-0 text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary-0 hover:bg-primary-0/90 text-white font-semibold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe Free"}
                </button>
              </form>

              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}

              <p className="text-center text-white/30 text-xs mt-3">
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
              className="group block h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
            >
              {/* Image */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={otherNovel.image}
                  alt={otherNovel.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <otherNovel.icon className={`w-4 h-4 ${otherNovel.accentColor}`} />
                  <span className={`text-xs font-medium ${otherNovel.accentColor}`}>
                    {otherNovel.genre}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-primary-0 transition-colors mb-1">
                  {otherNovel.title}
                </h4>
                <p className="text-sm text-white/60 mb-3">
                  {otherNovel.tagline}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary-0 font-medium">
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
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          ← Back to all {novelName} chapters
        </Link>
      </motion.div>
    </div>
  );
}