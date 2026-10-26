"use client";

import { withFadeIn } from "@/utils/withFadeIn";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Comments } from "./Comments";
import { calculateReadingTime } from "@/lib/reading-time";
import { extractPlainText } from "@/lib/extract-doc-text";
// TTS disabled — import preserved for future re-enablement
// import { useAudioPlayer } from "@/hooks/useElevenLabsTTS";
import {
  ChevronLeft,
  Settings2,
  X,
  Minus,
  Plus,
  AlignLeft,
  AlignJustify,
  Bookmark as BookmarkIcon,
  Trash2,
  Download,
  Check,
} from "lucide-react";
import { useScrollProgress } from "@/components/scroll-progress-bar";
import { usePostHog } from "posthog-js/react";
import { useScroll, motion, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { ChapterEndCTA } from "@/components/chapterendcta";
import { RoyalRoadGate } from "@/components/reader/RoyalRoadGate";
import { StickyNewsletterBar } from "@/components/stickynewsletterbar";
import { readerStorage, type Bookmark, type HighlightColor } from "@/lib/reader-storage";
import { useBookmarks, useOfflineChapters } from "@/hooks/useReaderStorage";
import { applyHighlights, describeSelection } from "@/lib/highlight-dom";
import { toast } from "sonner";

// TTS disabled — preserved for future re-enablement
// function formatTime(seconds: number): string {
//   if (!seconds || !isFinite(seconds)) return "0:00";
//   const m = Math.floor(seconds / 60);
//   const s = Math.floor(seconds % 60);
//   return `${m}:${s.toString().padStart(2, "0")}`;
// }

// ============ TYPOGRAPHY OPTIONS ============
const createOptions = (showDropCap: boolean): Options => {
  // Each call to documentToReactComponents reuses this closure, so we reset
  // the counter per render. The rendered <p> carries data-para-idx so the
  // bookmark/highlight system can address paragraphs stably.
  let paragraphIdx = -1;
  return {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      paragraphIdx += 1;
      const idx = paragraphIdx;
      if (idx === 0 && showDropCap) {
        return (
          <p data-para-idx={idx} className="wds-para mb-6 last:mb-0 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-[var(--reader-accent)]">
            {children}
          </p>
        );
      }
      return <p data-para-idx={idx} className="wds-para mb-6 last:mb-0 indent-8 first:indent-0">{children}</p>;
    },
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="text-3xl font-bold mt-16 mb-8 text-center font-display">
        {children}
      </h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-2xl font-bold mt-14 mb-6 font-display">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-xl font-semibold mt-10 mb-4 font-display">
        {children}
      </h3>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc pl-8 mb-6 space-y-3">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal pl-8 mb-6 space-y-3">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li className="pl-2">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-[var(--reader-accent)] pl-6 pr-4 my-8 italic opacity-90 font-serif text-[1.05em]">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => (
      <div className="my-12 flex items-center justify-center gap-4">
        <span className="h-px flex-1 bg-current opacity-20" />
        <span className="text-2xl opacity-40">✦</span>
        <span className="h-px flex-1 bg-current opacity-20" />
      </div>
    ),
  },
  renderText: (text) => {
    return text
      .split("\n")
      .reduce((children: ReactNode[], textSegment, index) => {
        return [...children, index > 0 && <br key={index} />, textSegment];
      }, []);
  },
  };
};

export const Content = withFadeIn(
  ({
    content,
    chapter,
    previousChapter,
    nextChapter,
    royalRoad,
  }: {
    content: Document;
    chapter: Chapter;
    previousChapter?: string;
    nextChapter?: string;
    royalRoad?: RoyalRoadHandoff;
  }) => (
    <ChapterReader
      chapter={chapter}
      content={content}
      prevChapter={previousChapter}
      nextChapter={nextChapter}
      royalRoad={royalRoad}
    />
  )
);

/** Set when this chapter is in the Royal Road half: `content` is only a teaser. */
export interface RoyalRoadHandoff {
  url: string;
  /** Highest chapterNumber that is fully readable on-site */
  onSiteLimit: number;
}

// ============ TYPES ============
type FontSize = "sm" | "md" | "lg" | "xl";
type FontFamily = "serif" | "sans" | "mono";
type Theme = "dark" | "sepia" | "light" | "midnight";
type LineHeight = "normal" | "relaxed" | "loose";
type TextAlign = "left" | "justify";
type ContentWidth = "narrow" | "medium" | "wide";

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  releaseDate: string;
  content?: Document;
  isFree?: boolean;
  slug: string;
  /** URL to a pre-generated audio narration (Contentful asset) */
  audioUrl?: string;
}

interface ChapterReaderProps {
  chapter: Chapter;
  content: Document;
  nextChapter?: string | null;
  prevChapter?: string | null;
  royalRoad?: RoyalRoadHandoff;
}

interface ReaderSettings {
  fontSize: FontSize;
  fontFamily: FontFamily;
  theme: Theme;
  lineHeight: LineHeight;
  textAlign: TextAlign;
  showDropCap: boolean;
  focusMode: boolean;
  contentWidth: ContentWidth;
}

const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: "md",
  fontFamily: "serif",
  theme: "dark",
  lineHeight: "relaxed",
  textAlign: "left",
  showDropCap: true,
  focusMode: false,
  contentWidth: "medium",
};

const NAVBAR_HEIGHT = 80;

// ============ THEME CONFIGURATIONS ============
// Reader themes, tuned to the WDS brand: Ink/indigo for the dark pair, white
// and warm paper for the light pair. `accentHex` drives the drop cap and
// quote rule (via --reader-accent); `chrome` is the floating toolbar.
const themes: Record<Theme, {
  bg: string;
  text: string;
  accent: string;
  accentHex: string;
  headerBg: string;
  mutedText: string;
  border: string;
  cardBg: string;
  chrome: string;
  isDark: boolean;
}> = {
  dark: {
    bg: "bg-[#0F0D33]",
    text: "text-[#EDEDFB]",
    accent: "text-[#A5A2FF]",
    accentHex: "#A5A2FF",
    headerBg: "bg-[#0F0D33]/95",
    mutedText: "text-[#A9A7DE]",
    border: "border-[#2E2B66]",
    cardBg: "bg-[#16134A]",
    chrome: "rgba(22, 19, 74, 0.96)",
    isDark: true,
  },
  midnight: {
    bg: "bg-[#08071A]",
    text: "text-[#D6D5F2]",
    accent: "text-[#A5A2FF]",
    accentHex: "#A5A2FF",
    headerBg: "bg-[#08071A]/95",
    mutedText: "text-[#8E8BC9]",
    border: "border-[#24214F]",
    cardBg: "bg-[#110F33]",
    chrome: "rgba(17, 15, 51, 0.96)",
    isDark: true,
  },
  sepia: {
    bg: "bg-[#f4ecd8]",
    text: "text-[#3d3226]",
    accent: "text-[#3732CC]",
    accentHex: "#3732CC",
    headerBg: "bg-[#f4ecd8]/95",
    mutedText: "text-[#6e5c45]",
    border: "border-[#d4c4a8]",
    cardBg: "bg-[#ebe3d0]",
    chrome: "rgba(244, 236, 216, 0.96)",
    isDark: false,
  },
  light: {
    bg: "bg-white",
    text: "text-[#0F0D33]",
    accent: "text-[#3732CC]",
    accentHex: "#3732CC",
    headerBg: "bg-white/95",
    mutedText: "text-[#4A4790]",
    border: "border-[#D9D8F5]",
    cardBg: "bg-[#F5F5FE]",
    chrome: "rgba(255, 255, 255, 0.96)",
    isDark: false,
  },
};

const fontSizes: Record<FontSize, string> = {
  sm: "text-base",     // 16px
  md: "text-lg",       // 18px
  lg: "text-xl",       // 20px
  xl: "text-[22px]",   // 22px
};

const fontFamilies: Record<FontFamily, string> = {
  serif: "font-serif",     // Will use Lora/Merriweather
  sans: "font-sans",       // System sans
  mono: "font-mono",       // Monospace for accessibility
};

const lineHeights: Record<LineHeight, string> = {
  normal: "leading-relaxed",   // 1.625
  relaxed: "leading-loose",    // 2
  loose: "leading-[2.25]",     // 2.25
};

const contentWidths: Record<ContentWidth, string> = {
  narrow: "600px",
  medium: "720px",
  wide:   "860px",
};

// ============ SETTINGS PANEL COMPONENT ============
function SettingsPanel({
  settings,
  setSettings,
  isOpen,
  onClose,
  currentTheme,
}: {
  settings: ReaderSettings;
  setSettings: React.Dispatch<React.SetStateAction<ReaderSettings>>;
  isOpen: boolean;
  onClose: () => void;
  currentTheme: typeof themes.dark;
}) {
  const [mounted, setMounted] = useState(false);

  // Handle mounting for SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ zIndex: 9999 }}
            className={`
              fixed bottom-4 left-4 right-4
              md:bottom-auto md:top-[10%] md:left-1/3 md:-translate-x-1/3 md:-translate-y-1/2
              md:w-[420px] md:max-w-[90vw]
              ${currentTheme.cardBg} ${currentTheme.text}
              shadow-2xl border ${currentTheme.border}
              max-h-[80vh] overflow-y-auto
            `}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${currentTheme.border}`}>
              <h3 className="font-semibold text-lg">Reading Settings</h3>
              <button
                onClick={onClose}
                className={`p-2 hover:bg-black/10 transition-colors ${currentTheme.mutedText}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Font Size */}
              <div>
                <label className={`text-sm font-medium ${currentTheme.mutedText} mb-3 block`}>
                  Font Size
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const sizes: FontSize[] = ["sm", "md", "lg", "xl"];
                      const idx = sizes.indexOf(settings.fontSize);
                      if (idx > 0) setSettings(s => ({ ...s, fontSize: sizes[idx - 1] }));
                    }}
                    className={`p-2 ${currentTheme.cardBg} border ${currentTheme.border} hover:border-brand-pink transition-colors`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className={fontSizes[settings.fontSize]}>Aa</span>
                  </div>
                  <button
                    onClick={() => {
                      const sizes: FontSize[] = ["sm", "md", "lg", "xl"];
                      const idx = sizes.indexOf(settings.fontSize);
                      if (idx < sizes.length - 1) setSettings(s => ({ ...s, fontSize: sizes[idx + 1] }));
                    }}
                    className={`p-2 ${currentTheme.cardBg} border ${currentTheme.border} hover:border-brand-pink transition-colors`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className={`text-sm font-medium ${currentTheme.mutedText} mb-3 block`}>
                  Font
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: "serif", label: "Serif", preview: "Aa" },
                    { key: "sans", label: "Sans", preview: "Aa" },
                    { key: "mono", label: "Mono", preview: "Aa" },
                  ] as const).map(({ key, label, preview }) => (
                    <button
                      key={key}
                      onClick={() => setSettings(s => ({ ...s, fontFamily: key }))}
                      className={`
                        p-3 border transition-all
                        ${settings.fontFamily === key 
                          ? `border-brand-pink ${currentTheme.cardBg}` 
                          : `${currentTheme.border} hover:border-brand-pink/60`
                        }
                      `}
                    >
                      <div className={`text-lg mb-1 ${fontFamilies[key]}`}>{preview}</div>
                      <div className={`text-xs ${currentTheme.mutedText}`}>{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className={`text-sm font-medium ${currentTheme.mutedText} mb-3 block`}>
                  Theme
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([
                    { key: "light", color: "bg-white", label: "Light" },
                    { key: "sepia", color: "bg-[#f4ecd8]", label: "Sepia" },
                    { key: "dark", color: "bg-[#0F0D33]", label: "Dark" },
                    { key: "midnight", color: "bg-[#08071A]", label: "Night" },
                  ] as const).map(({ key, color, label }) => (
                    <button
                      key={key}
                      onClick={() => setSettings(s => ({ ...s, theme: key }))}
                      className={`
                        flex flex-col items-center gap-2 p-2 border transition-all
                        ${settings.theme === key 
                          ? "border-brand-pink" 
                          : `${currentTheme.border} hover:border-brand-pink/60`
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded-full ${color} border border-[#D9D8F5]`} />
                      <span className={`text-xs ${currentTheme.mutedText}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label className={`text-sm font-medium ${currentTheme.mutedText} mb-3 block`}>
                  Line Spacing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: "normal", label: "Compact" },
                    { key: "relaxed", label: "Normal" },
                    { key: "loose", label: "Spacious" },
                  ] as const).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setSettings(s => ({ ...s, lineHeight: key }))}
                      className={`
                        py-2 px-3 border text-sm transition-all
                        ${settings.lineHeight === key 
                          ? `border-brand-pink ${currentTheme.cardBg}` 
                          : `${currentTheme.border} hover:border-brand-pink/60`
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Width */}
              <div>
                <label className={`text-sm font-medium ${currentTheme.mutedText} mb-3 block`}>
                  Width
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: "narrow", label: "Narrow" },
                    { key: "medium", label: "Medium" },
                    { key: "wide",   label: "Wide" },
                  ] as const).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setSettings(s => ({ ...s, contentWidth: key }))}
                      className={`
                        py-2 px-3 border text-sm transition-all
                        ${settings.contentWidth === key
                          ? `border-brand-pink ${currentTheme.cardBg}`
                          : `${currentTheme.border} hover:border-brand-pink/60`
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className={`text-sm font-medium ${currentTheme.mutedText} mb-3 block`}>
                  Text Alignment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSettings(s => ({ ...s, textAlign: "left" }))}
                    className={`
                      flex items-center justify-center gap-2 py-2 px-3 border transition-all
                      ${settings.textAlign === "left" 
                        ? `border-brand-pink ${currentTheme.cardBg}` 
                        : `${currentTheme.border} hover:border-brand-pink/60`
                      }
                    `}
                  >
                    <AlignLeft className="w-4 h-4" />
                    <span className="text-sm">Left</span>
                  </button>
                  <button
                    onClick={() => setSettings(s => ({ ...s, textAlign: "justify" }))}
                    className={`
                      flex items-center justify-center gap-2 py-2 px-3 border transition-all
                      ${settings.textAlign === "justify" 
                        ? `border-brand-pink ${currentTheme.cardBg}` 
                        : `${currentTheme.border} hover:border-brand-pink/60`
                      }
                    `}
                  >
                    <AlignJustify className="w-4 h-4" />
                    <span className="text-sm">Justified</span>
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {/* Drop Cap Toggle */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${currentTheme.mutedText}`}>Drop Cap</span>
                  <button
                    onClick={() => setSettings(s => ({ ...s, showDropCap: !s.showDropCap }))}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${settings.showDropCap ? "bg-brand-indigo" : currentTheme.border + " bg-transparent border"}
                    `}
                  >
                    <div
                      className={`
                        absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
                        ${settings.showDropCap ? "translate-x-6" : "translate-x-1"}
                      `}
                    />
                  </button>
                </div>

                {/* Focus Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-sm ${currentTheme.mutedText}`}>Focus Mode</span>
                    <p className={`text-xs ${currentTheme.mutedText} opacity-70`}>Dims everything except current paragraph</p>
                  </div>
                  <button
                    onClick={() => setSettings(s => ({ ...s, focusMode: !s.focusMode }))}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative flex-shrink-0
                      ${settings.focusMode ? "bg-brand-indigo" : currentTheme.border + " bg-transparent border"}
                    `}
                  >
                    <div
                      className={`
                        absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
                        ${settings.focusMode ? "translate-x-6" : "translate-x-1"}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ============ BOOKMARKS DRAWER ============
function BookmarksDrawer({
  isOpen,
  onClose,
  bookmarks,
  currentTheme,
  onJump,
  onRemove,
}: {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  currentTheme: typeof themes.dark;
  onJump: (paragraphIndex: number) => void;
  onRemove: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            style={{ zIndex: 9999 }}
            className={`
              fixed right-0 top-0 bottom-0 w-full max-w-md
              ${currentTheme.cardBg} ${currentTheme.text}
              shadow-2xl border-l ${currentTheme.border}
              flex flex-col
            `}
          >
            <div className={`flex items-center justify-between p-4 border-b ${currentTheme.border}`}>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BookmarkIcon className="w-5 h-5" />
                Bookmarks & Highlights
              </h3>
              <button
                onClick={onClose}
                className={`p-2 hover:bg-black/10 ${currentTheme.mutedText}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {bookmarks.length === 0 ? (
                <div className={`text-center py-16 ${currentTheme.mutedText}`}>
                  <BookmarkIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No bookmarks yet.</p>
                  <p className="text-xs mt-2 opacity-70">Select any text in the chapter to highlight it in your chosen color.</p>
                </div>
              ) : (
                [...bookmarks]
                  .sort((a, b) => a.paragraphIndex - b.paragraphIndex)
                  .map((b) => (
                    <div
                      key={b.id}
                      className={`group p-3 border ${currentTheme.border} hover:border-brand-pink transition-colors`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 wds-highlight-swatch-${b.color}`} />
                        <button
                          onClick={() => onJump(b.paragraphIndex)}
                          className="flex-1 text-left text-sm leading-relaxed hover:opacity-80"
                        >
                          <span className={`block text-[11px] uppercase tracking-wider ${currentTheme.mutedText} mb-1`}>
                            {b.type === "highlight" ? "Highlight" : "Bookmark"} · ¶{b.paragraphIndex + 1}
                          </span>
                          <span className="italic">&ldquo;{b.text.slice(0, 180)}{b.text.length > 180 ? "…" : ""}&rdquo;</span>
                        </button>
                        <button
                          onClick={() => onRemove(b.id)}
                          className={`opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-black/10 ${currentTheme.mutedText} transition-opacity`}
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ============ MAIN CHAPTER READER ============
function ChapterReader({
  chapter,
  content,
  nextChapter,
  royalRoad,
}: ChapterReaderProps) {
  const { slug: Novel } = useParams();
  const cleanedText = extractPlainText(chapter.content as Document)
    .replace(/\s+/g, " ")
    .trim();
  const readingTime = calculateReadingTime(cleanedText);
  // TTS disabled — hook preserved for future re-enablement
  // const {
  //   status: ttsStatus,
  //   toggle: ttsToggle,
  //   stop: ttsStop,
  //   seek: ttsSeek,
  //   progress: ttsProgress,
  //   currentTime: ttsCurrentTime,
  //   duration: ttsDuration,
  //   hasAudio,
  // } = useAudioPlayer(chapter.audioUrl);

  // Render with fixed defaults first so server and client markup match, then
  // apply the reader's saved settings (or their OS light/dark preference)
  // right after mount. Reading localStorage during the first render caused a
  // hydration mismatch that left the server's default theme on screen.
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_READER_SETTINGS);
  const settingsLoaded = useRef(false);

  useEffect(() => {
    let next: ReaderSettings | null = null;
    try {
      const saved = localStorage.getItem("readerSettings");
      if (saved) next = { ...DEFAULT_READER_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore corrupt or unavailable storage
    }
    if (!next) {
      const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
      next = { ...DEFAULT_READER_SETTINGS, theme: prefersLight ? "light" : "dark" };
    }
    settingsLoaded.current = true;
    setSettings(next);
  }, []);

  // Save settings to localStorage — only once the saved ones have been read,
  // so the defaults never overwrite a reader's choices.
  useEffect(() => {
    if (!settingsLoaded.current) return;
    try {
      localStorage.setItem("readerSettings", JSON.stringify(settings));
    } catch {
      // storage unavailable
    }
  }, [settings]);

  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const router = useRouter();

  // ---------- Bookmarks / highlights ----------
  const { bookmarks, add: addBookmark, remove: removeBookmark } = useBookmarks(chapter.id);
  const [selectionBar, setSelectionBar] = useState<{
    x: number;
    y: number;
    paragraphIndex: number;
    startOffset: number;
    endOffset: number;
    text: string;
  } | null>(null);

  // ---------- Offline ----------
  const { mark: markOffline, unmark: unmarkOffline, isCached } = useOfflineChapters();
  const [isOfflineCached, setIsOfflineCached] = useState(false);
  useEffect(() => {
    setIsOfflineCached(isCached(chapter.id));
  }, [chapter.id, isCached]);

  const { setProgress } = useScrollProgress();
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-hide controls
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const showControlsTemporarily = () => {
      setShowControls(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setShowControls(false), 2500);
    };

    window.addEventListener("scroll", showControlsTemporarily, { passive: true });
    window.addEventListener("mousemove", showControlsTemporarily, { passive: true });
    window.addEventListener("touchstart", showControlsTemporarily, { passive: true });

    return () => {
      window.removeEventListener("scroll", showControlsTemporarily);
      window.removeEventListener("mousemove", showControlsTemporarily);
      window.removeEventListener("touchstart", showControlsTemporarily);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    setProgress(scrollYProgress);
  }, [scrollYProgress, setProgress]);

  // ---------- Reading progress persistence ----------
  // Debounced write to localStorage, and detect the "just finished" transition
  // so we can record a chapter-read + streak + celebratory toast.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPercent = useRef(0);

  // Analytics: emit one event per progress milestone so we can build a
  // per-chapter drop-off funnel in PostHog (started → 25 → 50 → 75 → finished).
  const posthog = usePostHog();
  const firedMilestones = useRef<Set<number>>(new Set());
  useEffect(() => {
    firedMilestones.current = new Set();
  }, [chapter.id]);
  const chapterEventProps = useCallback(
    () => ({
      novelSlug: Novel as string,
      chapterSlug: chapter.slug,
      chapterNumber: chapter.chapterNumber,
      chapterTitle: chapter.title,
    }),
    [chapter.slug, chapter.chapterNumber, chapter.title, Novel]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    latestPercent.current = v;

    // Milestone events fire immediately (not debounced) and only once each.
    for (const milestone of [0, 25, 50, 75] as const) {
      if (v * 100 >= milestone && !firedMilestones.current.has(milestone)) {
        firedMilestones.current.add(milestone);
        posthog?.capture("chapter_progress", {
          ...chapterEventProps(),
          milestone,
        });
      }
    }

    // A Royal Road teaser isn't the chapter — never record it as read.
    if (royalRoad) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const result = readerStorage.saveProgress(chapter.id, {
        percent: latestPercent.current,
        novelSlug: Novel as string,
        chapterSlug: chapter.slug,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
      });
      if (result.justFinished) {
        posthog?.capture("chapter_finished", chapterEventProps());
        const stats = readerStorage.recordChapterRead(chapter.id);
        const streakLine =
          stats.streak.current > 1
            ? ` · ${stats.streak.current}-day streak 🔥`
            : "";
        toast.success(`Chapter complete${streakLine}`, {
          description: `${stats.totalChaptersRead} chapter${stats.totalChaptersRead === 1 ? "" : "s"} read total`,
        });
      }
    }, 500);
  });

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  // ---------- Resume reading prompt ----------
  // On mount, if we have meaningful saved progress for this chapter, offer
  // to jump the user back to where they left off. One-shot, dismissable.
  const resumeOfferedRef = useRef(false);
  useEffect(() => {
    if (resumeOfferedRef.current) return;
    resumeOfferedRef.current = true;
    if (royalRoad) return;
    const saved = readerStorage.getProgress(chapter.id);
    if (!saved || saved.finished) return;
    if (saved.percent < 0.05 || saved.percent > 0.95) return;

    const id = toast("Resume where you left off?", {
      description: `You were ${Math.round(saved.percent * 100)}% through this chapter.`,
      duration: 8000,
      action: {
        label: "Resume",
        onClick: () => {
          const el = contentRef.current;
          if (!el) return;
          const top = el.offsetTop;
          const height = el.offsetHeight - window.innerHeight;
          window.scrollTo({
            top: top + Math.max(0, height * saved.percent),
            behavior: "smooth",
          });
          toast.dismiss(id);
        },
      },
    });
  }, [chapter.id, royalRoad]);

  // Funnel: how many readers reach a Royal Road hand-off (clicks are tracked in the gate).
  useEffect(() => {
    if (royalRoad) posthog?.capture("royal_road_gate_view", chapterEventProps());
  }, [royalRoad, posthog, chapterEventProps]);

  // ---------- Highlight selection handling ----------
  useEffect(() => {
    const article = contentRef.current;
    if (!article) return;

    const handleMouseUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setSelectionBar(null);
        return;
      }
      // Defer so the selection geometry is finalized.
      setTimeout(() => {
        const current = window.getSelection();
        if (!current || current.isCollapsed) {
          setSelectionBar(null);
          return;
        }
        const info = describeSelection(article, current);
        if (!info) {
          setSelectionBar(null);
          return;
        }
        setSelectionBar({
          x: info.rect.left + info.rect.width / 2,
          y: info.rect.top - 8,
          paragraphIndex: info.paragraphIndex,
          startOffset: info.startOffset,
          endOffset: info.endOffset,
          text: info.text,
        });
      }, 10);
    };

    const dismiss = (e: Event) => {
      const target = e.target as Node | null;
      if (target && (target as HTMLElement).closest?.("[data-wds-selection-bar]")) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) setSelectionBar(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);
    document.addEventListener("selectionchange", dismiss);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
      document.removeEventListener("selectionchange", dismiss);
    };
  }, []);

  // ---------- Highlight application ----------
  // Re-run whenever bookmarks, content, or typography settings change — any
  // of these can replace the DOM subtree we wrap highlights into.
  useLayoutEffect(() => {
    const article = contentRef.current;
    if (!article) return;
    applyHighlights(article, bookmarks);
  }, [bookmarks, content, settings.fontSize, settings.fontFamily, settings.lineHeight, settings.showDropCap, settings.textAlign]);

  const handleCreateHighlight = useCallback(
    (color: HighlightColor) => {
      if (!selectionBar) return;
      const b: Bookmark = {
        id: `h_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type: "highlight",
        paragraphIndex: selectionBar.paragraphIndex,
        startOffset: selectionBar.startOffset,
        endOffset: selectionBar.endOffset,
        text: selectionBar.text,
        color,
        createdAt: Date.now(),
      };
      addBookmark(b);
      window.getSelection()?.removeAllRanges();
      setSelectionBar(null);
      toast.success("Highlight saved");
    },
    [selectionBar, addBookmark]
  );

  const jumpToParagraph = useCallback((paragraphIndex: number) => {
    const el = contentRef.current?.querySelector<HTMLElement>(
      `[data-para-idx="${paragraphIndex}"]`
    );
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("wds-jump-flash");
    setTimeout(() => el.classList.remove("wds-jump-flash"), 1200);
  }, []);

  // ---------- Offline cache handler ----------
  const handleSaveOffline = useCallback(async () => {
    try {
      // Cache the current chapter page + the project page so offline
      // navigation from /offline → chapter works without internet.
      await Promise.allSettled([
        fetch(window.location.href, { cache: "reload" }),
        fetch(`/projects/${Novel}`, { cache: "reload" }),
      ]);
      markOffline(chapter.id);
      setIsOfflineCached(true);
      toast.success("Saved for offline reading");
    } catch {
      toast.error("Couldn't save offline");
    }
  }, [chapter.id, Novel, markOffline]);

  const handleRemoveOffline = useCallback(() => {
    unmarkOffline(chapter.id);
    setIsOfflineCached(false);
    toast("Removed from offline");
  }, [chapter.id, unmarkOffline]);

  const currentTheme = themes[settings.theme];
  const novelDisplayName = `${(Novel as string)[0].toUpperCase()}${(Novel as string).replace("_", " ").slice(1)}`;

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* ============ READER CONTROLS - Portaled to body ============ */}
      {mounted && createPortal(
        <header
          className={`
            fixed left-0 right-0
            transition-all duration-300
            ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
          `}
          style={{ top: NAVBAR_HEIGHT + 4, zIndex: 997 }}
        >
          <div 
            className={`backdrop-blur-md border mx-4 shadow-lg ${currentTheme.border}`}
            style={{ backgroundColor: currentTheme.chrome }}
          >
            <div className={`px-4 py-3 flex items-center justify-between ${currentTheme.text}`}>
              {/* Back Button */}
              <button
                onClick={() => router.push(`/projects/${Novel}`)}
                className={`flex items-center gap-2 ${currentTheme.accent} hover:opacity-80 transition-opacity`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Back to {novelDisplayName}</span>
                <span className="sm:hidden text-sm">Back</span>
              </button>

              {/* Right Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Bookmarks Button */}
                <button
                  onClick={() => setShowBookmarks(true)}
                  className={`
                    relative flex items-center gap-1.5 px-2.5 py-1.5 transition-all text-sm
                    ${currentTheme.isDark
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-black/10 hover:bg-black/20"
                    }
                  `}
                  aria-label="Bookmarks"
                >
                  <BookmarkIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Bookmarks</span>
                  {bookmarks.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-pink text-brand-ink text-[10px] font-bold flex items-center justify-center">
                      {bookmarks.length}
                    </span>
                  )}
                </button>

                {/* Offline Download Button */}
                <button
                  onClick={isOfflineCached ? handleRemoveOffline : handleSaveOffline}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1.5 transition-all text-sm
                    ${isOfflineCached
                      ? "bg-emerald-500 text-white"
                      : currentTheme.isDark
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-black/10 hover:bg-black/20"
                    }
                  `}
                  aria-label={isOfflineCached ? "Remove offline copy" : "Save for offline"}
                >
                  {isOfflineCached ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isOfflineCached ? "Saved" : "Offline"}</span>
                </button>

                {/* Settings Button */}
                <button
                  onClick={() => setShowSettings(true)}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1.5 transition-all text-sm
                    ${currentTheme.isDark
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-black/10 hover:bg-black/20"
                    }
                  `}
                >
                  <Settings2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </button>

                {/* Quick Theme Toggle */}
                <div className={`hidden md:flex gap-1 p-1 ${currentTheme.isDark ? "bg-white/10" : "bg-black/10"}`}>
                  {(Object.keys(themes) as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSettings(s => ({ ...s, theme: t }))}
                      className={`
                        w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all
                        ${t === "dark" ? "bg-[#0F0D33] border border-[#2E2B66]" : t === "midnight" ? "bg-[#08071A] border border-[#24214F]" : t === "sepia" ? "bg-[#f4ecd8]" : "bg-white border border-[#D9D8F5]"}
                        ${settings.theme === t ? "ring-2 ring-brand-pink scale-110" : "opacity-70 hover:opacity-100"}
                      `}
                      aria-label={`${t} theme`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </header>,
        document.body
      )}

      {/* ============ FLOATING SETTINGS BUTTON - Always visible ============ */}
      {mounted && createPortal(
        <button
          onClick={() => setShowSettings(true)}
          className="cut-corners-sm fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center bg-brand-pink text-brand-ink shadow-lg transition-colors duration-300 hover:bg-[#F87FE2]"
          style={{ zIndex: 996 }}
          aria-label="Open reading settings"
        >
          <Settings2 className="w-5 h-5" />
        </button>,
        document.body
      )}

      <div
        className={`
          min-h-screen overflow-x-hidden ${currentTheme.bg} ${currentTheme.text}
          transition-colors duration-500 relative
        `}
      >

        {/* ============ CHAPTER CONTENT ============ */}
        <main
          className="container mx-auto px-4 pb-32"
          style={{ paddingTop: NAVBAR_HEIGHT + 20, maxWidth: `min(${contentWidths[settings.contentWidth]}, 100%)`, ["--reader-accent" as string]: currentTheme.accentHex }}
        >
          {/* Chapter Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 pt-8 text-center"
          >
            {/* Novel tag + chapter label (brand: Pink = Dawnshipper, Green = Osiris) */}
            <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
              <span
                className={`px-2.5 py-0.5 text-[14px] font-bold uppercase tracking-[0.12em] text-brand-ink ${
                  Novel === "project_osiris" ? "bg-brand-green" : "bg-brand-pink"
                }`}
              >
                {novelDisplayName}
              </span>
              <span className={`text-[14px] font-bold uppercase tracking-[0.14em] ${currentTheme.mutedText}`}>
                Chapter {chapter.chapterNumber}
              </span>
            </div>

            <h1 className={`mb-6 font-plaguard text-[40px] font-normal leading-[0.98] md:text-[56px] ${currentTheme.accent}`}>
              {chapter.title}
            </h1>

            <div className={`flex items-center justify-center gap-4 text-[15px] ${currentTheme.mutedText}`}>
              <span>
                {new Date(chapter.releaseDate).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "Africa/Lagos",
                })}
              </span>
              <span className="w-1.5 h-1.5 bg-current opacity-50" />
              <span>{royalRoad ? "Continues on Royal Road" : `${readingTime} min read`}</span>
            </div>

            {/* Divider: the brand slash */}
            <div className="mt-10 flex items-center justify-center gap-3" aria-hidden="true">
              <span className={`h-px w-16 ${currentTheme.border} border-t`} />
              <span className="h-3 w-3 -skew-x-[30deg] bg-[var(--reader-accent)]" />
              <span className={`h-px w-16 ${currentTheme.border} border-t`} />
            </div>
          </motion.div>

          {/* Chapter Text */}
          <motion.article
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`
              ${fontSizes[settings.fontSize]}
              ${fontFamilies[settings.fontFamily]}
              ${lineHeights[settings.lineHeight]}
              ${settings.textAlign === "justify" ? "text-justify" : "text-left"}
              ${settings.focusMode ? "focus-mode" : ""}
              ${royalRoad ? "[-webkit-mask-image:linear-gradient(to_bottom,black_45%,transparent)] [mask-image:linear-gradient(to_bottom,black_45%,transparent)]" : ""}
              tracking-[0.01em]
              [word-spacing:0.05em]
              prose max-w-none
              ${currentTheme.isDark ? "prose-invert" : ""}
              prose-headings:${currentTheme.accent}
              prose-a:${currentTheme.accent}
              prose-strong:font-semibold
            `}
            style={{
              fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            {documentToReactComponents(content, createOptions(settings.showDropCap))}
          </motion.article>

          {royalRoad ? (
            <RoyalRoadGate
              url={royalRoad.url}
              novelSlug={Novel as string}
              novelName={novelDisplayName}
              chapterNumber={chapter.chapterNumber}
              onSiteLimit={royalRoad.onSiteLimit}
            />
          ) : (
            <StickyNewsletterBar showAfter={30} novelName={novelDisplayName} theme={currentTheme} />
          )}

          {/* Next Chapter CTA */}
          {/* {nextChapter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`mt-20 pt-10 border-t ${currentTheme.border}`}
            >
              <p className={`text-center text-sm ${currentTheme.mutedText} mb-4`}>
                Continue reading
              </p>
              <Link
                href={`/novels/${Novel}/chapters/${nextChapter}`}
                className={`
                  flex items-center justify-center gap-3
                  w-full py-4 px-6
                  bg-gradient-to-r from-amber-500 to-orange-500
                  hover:from-amber-400 hover:to-orange-400
                  text-white font-bold text-lg
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(249,115,22,0.3)]
                `}
              >
                Next: {nextChapter.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )} */}

          {!royalRoad && (
            <ChapterEndCTA
              nextChapter={nextChapter}
              novelSlug={Novel as string}
              novelName={novelDisplayName}
              chapterNumber={chapter.chapterNumber}
              theme={currentTheme}
            />
          )}
        </main>

        {/* ============ COMMENTS ============ */}
        <div className="container mx-auto px-4 pb-32" style={{ maxWidth: `min(${contentWidths[settings.contentWidth]}, 100%)` }}>
          <Comments title={`${Novel}: chapter-${chapter.chapterNumber}`} />
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        settings={settings}
        setSettings={setSettings}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentTheme={currentTheme}
      />

      {/* Selection Action Bar */}
      {mounted && selectionBar && createPortal(
        <div
          data-wds-selection-bar
          className="fixed z-[9997] -translate-x-1/2 -translate-y-full bg-brand-ink text-white shadow-2xl border border-[#2E2B66] px-2 py-1.5 flex items-center gap-1"
          style={{ left: selectionBar.x, top: selectionBar.y }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {(["amber", "green", "blue", "pink"] as HighlightColor[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCreateHighlight(c)}
              className={`w-6 h-6 rounded-full border-2 border-white/20 hover:scale-110 transition-transform wds-highlight-swatch-${c}`}
              aria-label={`Highlight in ${c}`}
            />
          ))}
          <div className="w-px h-5 bg-white/20 mx-1" />
          <button
            onClick={() => {
              navigator.clipboard.writeText(selectionBar.text);
              toast.success("Copied");
              window.getSelection()?.removeAllRanges();
              setSelectionBar(null);
            }}
            className="px-2 py-1 text-xs rounded hover:bg-white/10"
          >
            Copy
          </button>
        </div>,
        document.body
      )}

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        bookmarks={bookmarks}
        currentTheme={currentTheme}
        onJump={(idx) => {
          jumpToParagraph(idx);
          setShowBookmarks(false);
        }}
        onRemove={removeBookmark}
      />

      {/* Focus Mode Styles */}
      <style jsx global>{`
        /* Import reader-friendly fonts */
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;0,7..72,600;0,7..72,700;1,7..72,400;1,7..72,500&display=swap');
        
        .font-serif {
          font-family: 'Lora', 'Literata', Georgia, 'Times New Roman', serif;
        }
        
        .font-display {
          font-family: 'Literata', 'Lora', Georgia, serif;
        }

        /* Focus mode - dims paragraphs until hovered */
        .focus-mode p {
          opacity: 0.4;
          transition: opacity 0.3s ease;
        }
        
        .focus-mode p:hover,
        .focus-mode p:focus {
          opacity: 1;
        }

        /* Smooth paragraph transitions */
        article p {
          transition: color 0.3s ease;
        }

        /* Better hyphenation for justified text */
        article.text-justify {
          hyphens: auto;
          -webkit-hyphens: auto;
          -ms-hyphens: auto;
        }

        /* Prevent orphans and widows */
        article p {
          orphans: 3;
          widows: 3;
        }

        /* Highlight colors */
        .wds-highlight {
          border-radius: 2px;
          padding: 1px 2px;
          margin: 0 -2px;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        }
        .wds-highlight-amber { background-color: rgba(251, 191, 36, 0.35); }
        .wds-highlight-green { background-color: rgba(52, 211, 153, 0.35); }
        .wds-highlight-blue  { background-color: rgba(96, 165, 250, 0.35); }
        .wds-highlight-pink  { background-color: rgba(244, 114, 182, 0.35); }

        .wds-highlight-swatch-amber { background-color: #fbbf24; }
        .wds-highlight-swatch-green { background-color: #34d399; }
        .wds-highlight-swatch-blue  { background-color: #60a5fa; }
        .wds-highlight-swatch-pink  { background-color: #f472b6; }

        /* Paragraph jump flash */
        .wds-jump-flash {
          animation: wds-flash 1.2s ease-out;
        }
        @keyframes wds-flash {
          0%, 100% { background-color: transparent; }
          20%      { background-color: rgba(55, 50, 204, 0.18); }
        }
      `}</style>
    </>
  );
}
