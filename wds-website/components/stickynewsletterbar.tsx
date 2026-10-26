"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Check } from "lucide-react";

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
  mutedText: "text-white/50",
  border: "border-white/10",
  cardBg: "bg-brand-ink",
};

interface StickyNewsletterBarProps {
  /** Show after scrolling this percentage (0-100) */
  showAfter?: number;
  novelName?: string;
  theme?: ReaderThemeTokens;
}

export function StickyNewsletterBar({
  showAfter = 30,
  novelName,
  theme = DEFAULT_THEME,
}: StickyNewsletterBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if already subscribed
  useEffect(() => {
    const subscribed = localStorage.getItem("newsletter-subscribed");
    const dismissed = sessionStorage.getItem("sticky-bar-dismissed");
    if (subscribed || dismissed) {
      setIsDismissed(true);
    }
  }, []);

  // Scroll trigger
  useEffect(() => {
    if (isDismissed) return;

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercent >= showAfter);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed, showAfter]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("sticky-bar-dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName: "Reader", lastName: "WDS" }),
      });

      if (res.ok) {
        setIsSuccess(true);
        localStorage.setItem("newsletter-subscribed", "true");
        setTimeout(() => setIsDismissed(true), 2000);
      }
    } catch {
      // Silently fail
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[998] p-4 pointer-events-none"
        >
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <div className={`relative ${theme.cardBg} border ${theme.border} border-t-4 border-t-brand-pink shadow-2xl shadow-black/50 overflow-hidden`}>
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className={`absolute top-3 right-3 p-1.5 rounded-full bg-foreground/10 hover:bg-foreground/20 ${theme.mutedText} hover:text-[var(--reader-accent)] transition-all z-10`}
              >
                <X className="w-4 h-4" />
              </button>

              {isSuccess ? (
                <div className="flex items-center justify-center gap-3 p-4">
                  <div className="flex h-8 w-8 items-center justify-center bg-brand-green">
                    <Check className="h-4 w-4 text-brand-ink" />
                  </div>
                  <span className={`${theme.text} font-medium`}>Subscribed! Check your inbox.</span>
                </div>
              ) : isExpanded ? (
                <form onSubmit={handleSubmit} className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      className={`flex-1 px-4 py-3 bg-foreground/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-brand-pink`}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cut-corners-sm whitespace-nowrap bg-brand-indigo px-6 py-3 font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-indigo-deep disabled:opacity-50"
                    >
                      {isSubmitting ? "..." : "Subscribe"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className={`px-4 py-3 bg-foreground/10 ${theme.mutedText} hover:text-[var(--reader-accent)] transition-all sm:hidden`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-brand-indigo">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <p className={`${theme.text} font-medium`}>
                        {novelName ? `Get ${novelName} updates` : "Get chapter updates"}
                      </p>
                      <p className={`${theme.mutedText} text-sm`}>
                        New chapters delivered to your inbox
                      </p>
                    </div>
                    <p className={`sm:hidden ${theme.text} font-medium`}>
                      Get new chapter updates
                    </p>
                  </div>
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="cut-corners-sm flex-shrink-0 whitespace-nowrap bg-brand-indigo px-5 py-2.5 font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-indigo-deep"
                  >
                    Subscribe Free
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}