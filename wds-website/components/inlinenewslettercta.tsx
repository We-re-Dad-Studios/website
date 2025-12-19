"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, Check, X } from "lucide-react";

interface InlineNewsletterCTAProps {
  variant?: "minimal" | "card" | "banner";
  novelName?: string;
  theme?: "dark" | "sepia" | "light";
}

export function InlineNewsletterCTA({ 
  variant = "card", 
  novelName,
  theme = "dark" 
}: InlineNewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [error, setError] = useState("");

  const themeStyles = {
    dark: {
      bg: "bg-gradient-to-r from-purple-900/40 to-primary-0/20",
      border: "border-purple-500/30",
      text: "text-white",
      muted: "text-white/70",
      input: "bg-white/10 border-white/20 text-white placeholder-white/50",
      button: "bg-primary-0 hover:bg-primary-0/90 text-white",
    },
    sepia: {
      bg: "bg-gradient-to-r from-amber-100 to-orange-50",
      border: "border-amber-300",
      text: "text-gray-900",
      muted: "text-gray-600",
      input: "bg-white border-amber-200 text-gray-900 placeholder-gray-400",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    light: {
      bg: "bg-gradient-to-r from-gray-100 to-purple-50",
      border: "border-gray-200",
      text: "text-gray-900",
      muted: "text-gray-600",
      input: "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
      button: "bg-primary-0 hover:bg-primary-0/90 text-white",
    },
  };

  const styles = themeStyles[theme];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          firstName, 
          lastName: "Reader" // Default for inline form
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
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

  if (isDismissed) return null;

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`my-8 p-6 rounded-xl ${styles.bg} border ${styles.border} text-center`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-400" />
          </div>
        </div>
        <p className={`font-semibold ${styles.text}`}>You&apos;re in! 🎉</p>
        <p className={`text-sm ${styles.muted} mt-1`}>
          Check your inbox for a welcome message.
        </p>
      </motion.div>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`my-6 p-4 rounded-lg ${styles.bg} border ${styles.border}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Get chapter updates..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm ${styles.input} border focus:outline-none focus:ring-2 focus:ring-primary-0`}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${styles.button} transition-all disabled:opacity-50`}
          >
            {isSubmitting ? "..." : "Subscribe"}
          </button>
        </form>
      </motion.div>
    );
  }

  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`my-10 p-6 rounded-2xl ${styles.bg} border ${styles.border} relative overflow-hidden`}
      >
        {/* Dismiss button */}
        <button
          onClick={() => setIsDismissed(true)}
          className={`absolute top-3 right-3 p-1 rounded-full ${styles.muted} hover:${styles.text} transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary-0" />
              <span className={`text-sm font-medium ${styles.muted}`}>
                Never miss a chapter
              </span>
            </div>
            <h3 className={`text-xl font-bold ${styles.text}`}>
              {novelName ? `Get ${novelName} updates` : "Join the newsletter"}
            </h3>
            <p className={`text-sm ${styles.muted} mt-1`}>
              New chapters, exclusive content, and behind-the-scenes delivered weekly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`px-4 py-3 rounded-xl text-sm ${styles.input} border focus:outline-none focus:ring-2 focus:ring-primary-0 w-full sm:w-32`}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`px-4 py-3 rounded-xl text-sm ${styles.input} border focus:outline-none focus:ring-2 focus:ring-primary-0 w-full sm:w-48`}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl font-semibold ${styles.button} transition-all disabled:opacity-50 whitespace-nowrap`}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe Free"}
            </button>
          </form>
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
        )}
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`my-10 p-8 rounded-2xl ${styles.bg} border ${styles.border} text-center relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-0/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-0/20 flex items-center justify-center">
          <Mail className="w-7 h-7 text-primary-0" />
        </div>

        <h3 className={`text-2xl font-bold ${styles.text} mb-2`}>
          Enjoying the story?
        </h3>
        <p className={`${styles.muted} mb-6 max-w-md mx-auto`}>
          Get new chapters delivered straight to your inbox. Plus exclusive bonus content and early access to new projects.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
          <input
            type="text"
            placeholder="Your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl ${styles.input} border focus:outline-none focus:ring-2 focus:ring-primary-0`}
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl ${styles.input} border focus:outline-none focus:ring-2 focus:ring-primary-0`}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg ${styles.button} transition-all disabled:opacity-50 hover:scale-[1.02]`}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe Free →"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-3">{error}</p>
        )}

        <p className={`text-xs ${styles.muted} mt-4`}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </motion.div>
  );
}