"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, BookOpen } from "lucide-react";

interface NewsletterModalProps {
  /** Percentage of page scrolled before showing (0-100) */
  triggerAt?: number;
  /** Delay in ms after trigger point before showing */
  delay?: number;
  /** Novel name for personalized messaging */
  novelName?: string;
  /** Show on exit intent (mouse leaving viewport) */
  exitIntent?: boolean;
}

export function NewsletterModal({
  triggerAt = 50,
  delay = 2000,
  novelName,
  exitIntent = true,
}: NewsletterModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Check if already subscribed or dismissed
  useEffect(() => {
    const dismissed = sessionStorage.getItem("newsletter-modal-dismissed");
    const subscribed = localStorage.getItem("newsletter-subscribed");
    if (dismissed || subscribed) {
      setHasTriggered(true);
    }
  }, []);

  // Scroll trigger
  useEffect(() => {
    if (hasTriggered) return;

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= triggerAt && !hasTriggered) {
        setHasTriggered(true);
        setTimeout(() => setIsVisible(true), delay);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasTriggered, triggerAt, delay]);

  // Exit intent trigger
  useEffect(() => {
    if (!exitIntent || hasTriggered) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setHasTriggered(true);
        setIsVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitIntent, hasTriggered]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("newsletter-modal-dismissed", "true");
  };

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
        setTimeout(() => setIsVisible(false), 3000);
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
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="sticky inset-1 md:inset-auto top-[10%] md:top-[15%] md:left-[30%] md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full z-[10000] flex items-center justify-center"
          >
            <div className="relative w-full bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/50 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-0/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              </div>

              {isSuccess ? (
                <div className="relative p-8 md:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <Check className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Welcome aboard! 🎉
                  </h3>
                  <p className="text-white/70">
                    Check your inbox for a welcome message with exclusive content.
                  </p>
                </div>
              ) : (
                <div className="relative p-8 md:p-12">
                  {/* Icon */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-0/20 flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-primary-0" />
                    </div>
                  </div>

                  {/* Copy */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      {novelName 
                        ? `Don't miss the next ${novelName} chapter!`
                        : "Never miss a new chapter!"
                      }
                    </h3>
                    <p className="text-white/70">
                      Join 1,000+ readers getting weekly updates, exclusive content, and early access to new stories.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-0 focus:border-transparent transition-all"
                    />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-0 focus:border-transparent transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-primary-0 hover:bg-primary-0/90 text-white font-bold text-lg transition-all disabled:opacity-50 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,76,16,0.3)] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        "Subscribing..."
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Subscribe Free
                        </>
                      )}
                    </button>
                  </form>

                  {error && (
                    <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
                  )}

                  <p className="text-center text-white/40 text-xs mt-6">
                    No spam, ever. Unsubscribe with one click.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}