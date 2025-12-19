"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Check } from "lucide-react";

interface StickyNewsletterBarProps {
  /** Show after scrolling this percentage (0-100) */
  showAfter?: number;
  novelName?: string;
}

export function StickyNewsletterBar({ 
  showAfter = 30,
  novelName 
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
            <div className="relative bg-gradient-to-r from-gray-900 via-gray-900 to-purple-900/50 rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {isSuccess ? (
                <div className="flex items-center justify-center gap-3 p-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white font-medium">Subscribed! Check your inbox.</span>
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
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-0"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl bg-primary-0 hover:bg-primary-0/90 text-white font-semibold transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {isSubmitting ? "..." : "Subscribe"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="px-4 py-3 rounded-xl bg-white/10 text-white/70 hover:text-white transition-all sm:hidden"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-0/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary-0" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-white font-medium">
                        {novelName ? `Get ${novelName} updates` : "Get chapter updates"}
                      </p>
                      <p className="text-white/50 text-sm">
                        New chapters delivered to your inbox
                      </p>
                    </div>
                    <p className="sm:hidden text-white font-medium">
                      Get new chapter updates
                    </p>
                  </div>
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="px-5 py-2.5 rounded-xl bg-primary-0 hover:bg-primary-0/90 text-white font-semibold transition-all whitespace-nowrap flex-shrink-0"
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