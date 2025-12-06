"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Zap, ZapOff } from "lucide-react";

export const GlitchTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [animating, setAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionsEnabled, setTransitionsEnabled] = useState(true);
  const [glitchSlices, setGlitchSlices] = useState<Array<{
    id: number;
    height: number;
    offset: number;
    delay: number;
    top: number;
  }>>([]);

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('glitch-transitions-enabled');
    if (saved !== null) {
      setTransitionsEnabled(saved === 'true');
    }
  }, []);

  useEffect(() => {
    if (!transitionsEnabled) {
      // Instant page change without animation
      setDisplayChildren(children);
      return;
    }

    // Start transition immediately
    setAnimating(true);
    
    // Generate random glitch slices instantly
    const slices = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      height: Math.random() * 8 + 2,
      offset: (Math.random() - 0.5) * 30,
      delay: Math.random() * 0.2,
      top: (i / 15) * 100,
    }));
    setGlitchSlices(slices);

    // Update content mid-transition
    const contentSwap = setTimeout(() => {
      setDisplayChildren(children);
    }, 250);

    // End transition
    const endTransition = setTimeout(() => setAnimating(false), 500);
    
    return () => {
      clearTimeout(contentSwap);
      clearTimeout(endTransition);
    };
  }, [pathname, children, transitionsEnabled]);

  const toggleTransitions = () => {
    const newValue = !transitionsEnabled;
    setTransitionsEnabled(newValue);
    localStorage.setItem('glitch-transitions-enabled', String(newValue));
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleTransitions}
        className="fixed bottom-6 right-6 z-[100000] group"
        aria-label="Toggle page transitions"
      >
        <div className={`
          relative px-4 py-3 rounded-lg font-medium
          transition-all duration-300
          ${transitionsEnabled 
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/50' 
            : 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700'
          }
        `}>
          <div className="flex items-center gap-2">
            {transitionsEnabled ? (
              <>
                <Zap size={18} className="animate-pulse" />
                <span className="text-sm">FX ON</span>
              </>
            ) : (
              <>
                <ZapOff size={18} />
                <span className="text-sm">FX OFF</span>
              </>
            )}
          </div>
          {transitionsEnabled && (
            <div className="absolute inset-0 rounded-lg bg-purple-400/20 animate-pulse" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {animating && transitionsEnabled && (
          <>
            {/* Scan lines overlay */}
            <motion.div
              key="scanlines"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 z-[99990] pointer-events-none"
            >
              <div className="scan-lines w-full h-full" />
            </motion.div>

            {/* Glitch slices */}
            <motion.div
              key="glitch-slices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99991] pointer-events-none"
            >
              {glitchSlices.map((slice) => (
                <motion.div
                  key={slice.id}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{
                    x: [0, -20, 15, -10, 5, 0],
                    opacity: [0, 1, 1, 1, 1, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: slice.delay,
                    ease: "easeInOut",
                  }}
                  className="absolute left-0 right-0 bg-purple-500/40 border-t border-b border-purple-400/60"
                  style={{
                    top: `${slice.top}%`,
                    height: `${slice.height}%`,
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
                  }}
                />
              ))}
            </motion.div>

            {/* RGB Split overlay - purple tint */}
            <motion.div
              key="rgb-split"
              className="fixed inset-0 z-[99992] pointer-events-none mix-blend-screen"
            >
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: [0, 3, -2, 0] }}
                transition={{ duration: 0.5, times: [0, 0.33, 0.66, 1] }}
                className="absolute inset-0 bg-purple-500/25"
              />
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: [0, -3, 2, 0] }}
                transition={{ duration: 0.5, times: [0, 0.33, 0.66, 1] }}
                className="absolute inset-0 bg-pink-400/20"
              />
            </motion.div>

            {/* Digital static noise */}
            <motion.div
              key="noise"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.3, 0.2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
              className="fixed inset-0 z-[99993] pointer-events-none"
            >
              <div className="digital-noise w-full h-full" />
            </motion.div>

            {/* Glitch bars */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`bar-${i}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: [0, 1, 0.8, 1.2, 0.9, 1, 0],
                  opacity: [0, 1, 1, 1, 1, 1, 0],
                  x: [0, 0, 20, -15, 10, 0, 0],
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: "easeInOut",
                }}
                className="fixed left-0 right-0 h-1 bg-purple-400 z-[99994]"
                style={{
                  top: `${20 + i * 30}%`,
                  boxShadow: '0 0 15px rgba(168, 85, 247, 0.9)',
                }}
              />
            ))}

            {/* Corner brackets - neon purple */}
            <motion.div
              key="brackets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99995] pointer-events-none"
            >
              <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-purple-500 animate-pulse" 
                   style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.6)' }} />
              <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-purple-500 animate-pulse"
                   style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.6)' }} />
              <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-purple-500 animate-pulse"
                   style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.6)' }} />
              <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-purple-500 animate-pulse"
                   style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.6)' }} />
            </motion.div>

            {/* Loading text - neon purple */}
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.5, times: [0, 0.2, 0.8, 1] }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99996]"
            >
              <div 
                className="text-purple-400 text-2xl font-mono tracking-widest animate-pulse"
                style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.8)' }}
              >
                [ LOADING ]
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page content with instant fade */}
      <motion.div
        key={pathname}
        initial={{ opacity: transitionsEnabled ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: transitionsEnabled ? 0.3 : 0, delay: transitionsEnabled ? 0.25 : 0 }}
        className={animating && transitionsEnabled ? "glitch-text" : ""}
      >
        {displayChildren}
      </motion.div>

      <style jsx global>{`
        .scan-lines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          animation: scanlineMove 0.6s linear infinite;
        }

        @keyframes scanlineMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(2px); }
        }

        .digital-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: noiseFlicker 0.08s infinite;
        }

        @keyframes noiseFlicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .glitch-text {
          animation: textGlitch 0.5s ease-in-out;
        }

        @keyframes textGlitch {
          0%, 100% { 
            transform: translate(0);
            text-shadow: none;
          }
          25% {
            transform: translate(-3px, 2px);
            text-shadow: 3px -2px 0 rgba(168, 85, 247, 0.5), -3px 2px 0 rgba(236, 72, 153, 0.5);
          }
          50% {
            transform: translate(2px, -1px);
            text-shadow: -2px 1px 0 rgba(168, 85, 247, 0.5), 2px -1px 0 rgba(236, 72, 153, 0.5);
          }
          75% {
            transform: translate(-1px, 2px);
            text-shadow: 1px -2px 0 rgba(168, 85, 247, 0.5), -1px 2px 0 rgba(236, 72, 153, 0.5);
          }
        }
      `}</style>
    </>
  );
};