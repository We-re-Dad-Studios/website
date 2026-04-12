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
import { useElevenLabsTTS } from "@/hooks/useElevenLabsTTS";
import {
  Volume2,
  Loader2,
  Pause,
  ChevronLeft,
  BookOpen,
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
import { useScroll, motion, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { ChapterEndCTA } from "@/components/chapterendcta";
import { StickyNewsletterBar } from "@/components/stickynewsletterbar";
import { readerStorage, type Bookmark, type HighlightColor } from "@/lib/reader-storage";
import { useBookmarks, useOfflineChapters } from "@/hooks/useReaderStorage";
import { applyHighlights, describeSelection } from "@/lib/highlight-dom";
import { toast } from "sonner";

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
          <p data-para-idx={idx} className="wds-para mb-6 last:mb-0 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-amber-400">
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
      <blockquote className="border-l-4 border-amber-500/60 pl-6 pr-4 my-8 italic opacity-90 font-serif text-[1.05em]">
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
  }: {
    content: Document;
    chapter: Chapter;
    previousChapter?: string;
    nextChapter?: string;
  }) => (
    <ChapterReader
      chapter={chapter}
      content={content}
      prevChapter={previousChapter}
      nextChapter={nextChapter}
    />
  )
);

// ============ TYPES ============
type FontSize = "sm" | "md" | "lg" | "xl";
type FontFamily = "serif" | "sans" | "mono";
type Theme = "dark" | "sepia" | "light" | "midnight";
type LineHeight = "normal" | "relaxed" | "loose";
type TextAlign = "left" | "justify";

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  releaseDate: string;
  content?: Document;
  isFree?: boolean;
  slug: string;
}

interface ChapterReaderProps {
  chapter: Chapter;
  content: Document;
  nextChapter?: string | null;
  prevChapter?: string | null;
}

interface ReaderSettings {
  fontSize: FontSize;
  fontFamily: FontFamily;
  theme: Theme;
  lineHeight: LineHeight;
  textAlign: TextAlign;
  showDropCap: boolean;
  focusMode: boolean;
}

const NAVBAR_HEIGHT = 80;

// ============ THEME CONFIGURATIONS ============
const themes: Record<Theme, {
  bg: string;
  text: string;
  accent: string;
  headerBg: string;
  mutedText: string;
  border: string;
  cardBg: string;
}> = {
  dark: {
    bg: "bg-gray-900",
    text: "text-gray-100",
    accent: "text-amber-400",
    headerBg: "bg-gray-900/95",
    mutedText: "text-gray-400",
    border: "border-gray-700",
    cardBg: "bg-gray-800/50",
  },
  midnight: {
    bg: "bg-[#0d1117]",
    text: "text-[#c9d1d9]",
    accent: "text-amber-400",
    headerBg: "bg-[#0d1117]/95",
    mutedText: "text-[#8b949e]",
    border: "border-[#30363d]",
    cardBg: "bg-[#161b22]",
  },
  sepia: {
    bg: "bg-[#f4ecd8]",
    text: "text-[#5c4b37]",
    accent: "text-amber-700",
    headerBg: "bg-[#f4ecd8]/95",
    mutedText: "text-[#8b7355]",
    border: "border-[#d4c4a8]",
    cardBg: "bg-[#ebe3d0]",
  },
  light: {
    bg: "bg-[#fafafa]",
    text: "text-gray-800",
    accent: "text-amber-600",
    headerBg: "bg-white/95",
    mutedText: "text-gray-500",
    border: "border-gray-200",
    cardBg: "bg-white",
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
              rounded-2xl shadow-2xl border ${currentTheme.border}
              max-h-[80vh] overflow-y-auto
            `}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${currentTheme.border}`}>
              <h3 className="font-semibold text-lg">Reading Settings</h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg hover:bg-black/10 transition-colors ${currentTheme.mutedText}`}
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
                    className={`p-2 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border} hover:border-amber-400 transition-colors`}
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
                    className={`p-2 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border} hover:border-amber-400 transition-colors`}
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
                        p-3 rounded-lg border transition-all
                        ${settings.fontFamily === key 
                          ? `border-amber-400 ${currentTheme.cardBg}` 
                          : `${currentTheme.border} hover:border-amber-400/50`
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
                    { key: "dark", color: "bg-gray-800", label: "Dark" },
                    { key: "midnight", color: "bg-[#0d1117]", label: "Night" },
                  ] as const).map(({ key, color, label }) => (
                    <button
                      key={key}
                      onClick={() => setSettings(s => ({ ...s, theme: key }))}
                      className={`
                        flex flex-col items-center gap-2 p-2 rounded-lg border transition-all
                        ${settings.theme === key 
                          ? "border-amber-400" 
                          : `${currentTheme.border} hover:border-amber-400/50`
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded-full ${color} border border-gray-300`} />
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
                        py-2 px-3 rounded-lg border text-sm transition-all
                        ${settings.lineHeight === key 
                          ? `border-amber-400 ${currentTheme.cardBg}` 
                          : `${currentTheme.border} hover:border-amber-400/50`
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
                      flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-all
                      ${settings.textAlign === "left" 
                        ? `border-amber-400 ${currentTheme.cardBg}` 
                        : `${currentTheme.border} hover:border-amber-400/50`
                      }
                    `}
                  >
                    <AlignLeft className="w-4 h-4" />
                    <span className="text-sm">Left</span>
                  </button>
                  <button
                    onClick={() => setSettings(s => ({ ...s, textAlign: "justify" }))}
                    className={`
                      flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-all
                      ${settings.textAlign === "justify" 
                        ? `border-amber-400 ${currentTheme.cardBg}` 
                        : `${currentTheme.border} hover:border-amber-400/50`
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
                      ${settings.showDropCap ? "bg-amber-500" : currentTheme.border + " bg-transparent border"}
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
                      ${settings.focusMode ? "bg-amber-500" : currentTheme.border + " bg-transparent border"}
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
                className={`p-2 rounded-lg hover:bg-black/10 ${currentTheme.mutedText}`}
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
                      className={`group p-3 rounded-lg border ${currentTheme.border} hover:border-amber-400 transition-colors`}
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
}: ChapterReaderProps) {
  const { slug: Novel } = useParams();
  const cleanedText = extractPlainText(chapter.content as Document)
    .replace(/\s+/g, " ")
    .trim();
  const readingTime = calculateReadingTime(cleanedText);
  const { status: ttsStatus, toggle: ttsToggle } = useElevenLabsTTS(
    chapter.id,
    cleanedText
  );

  // Load settings from localStorage, with system-preference theme fallback
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readerSettings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    // No saved settings — match OS preference for initial theme.
    const prefersLight =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: light)").matches;
    return {
      fontSize: "md" as FontSize,
      fontFamily: "serif" as FontFamily,
      theme: (prefersLight ? "light" : "dark") as Theme,
      lineHeight: "relaxed" as LineHeight,
      textAlign: "left" as TextAlign,
      showDropCap: true,
      focusMode: false,
    };
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("readerSettings", JSON.stringify(settings));
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

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    latestPercent.current = v;
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
  }, [chapter.id]);

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
          style={{ top: NAVBAR_HEIGHT*2 / 2 + 4, zIndex: 997 }}
        >
          <div 
            className={`backdrop-blur-md border mx-4 rounded-xl shadow-lg ${currentTheme.border}`}
            style={{ backgroundColor: settings.theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : settings.theme === 'midnight' ? 'rgba(13, 17, 23, 0.95)' : settings.theme === 'sepia' ? 'rgba(244, 236, 216, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}
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
                {/* Audio Button */}
                <button
                  onClick={ttsToggle}
                  disabled={ttsStatus === "loading"}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-sm
                    ${ttsStatus === "playing" || ttsStatus === "loading"
                      ? "bg-amber-500 text-white"
                      : settings.theme === "dark" || settings.theme === "midnight"
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-black/10 hover:bg-black/20"
                    }
                    ${ttsStatus === "loading" ? "opacity-70 cursor-wait" : ""}
                  `}
                >
                  {ttsStatus === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Loading…</span>
                    </>
                  ) : ttsStatus === "playing" ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span className="hidden sm:inline">Pause</span>
                    </>
                  ) : ttsStatus === "paused" ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Resume</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Listen</span>
                    </>
                  )}
                </button>

                {/* Bookmarks Button */}
                <button
                  onClick={() => setShowBookmarks(true)}
                  className={`
                    relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-sm
                    ${settings.theme === "dark" || settings.theme === "midnight"
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-black/10 hover:bg-black/20"
                    }
                  `}
                  aria-label="Bookmarks"
                >
                  <BookmarkIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Bookmarks</span>
                  {bookmarks.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {bookmarks.length}
                    </span>
                  )}
                </button>

                {/* Offline Download Button */}
                <button
                  onClick={isOfflineCached ? handleRemoveOffline : handleSaveOffline}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-sm
                    ${isOfflineCached
                      ? "bg-emerald-500 text-white"
                      : settings.theme === "dark" || settings.theme === "midnight"
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
                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-sm
                    ${settings.theme === "dark" || settings.theme === "midnight"
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-black/10 hover:bg-black/20"
                    }
                  `}
                >
                  <Settings2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </button>

                {/* Quick Theme Toggle */}
                <div className={`hidden md:flex gap-1 p-1 rounded-lg ${settings.theme === "dark" || settings.theme === "midnight" ? "bg-white/10" : "bg-black/10"}`}>
                  {(Object.keys(themes) as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSettings(s => ({ ...s, theme: t }))}
                      className={`
                        w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all
                        ${t === "dark" ? "bg-gray-700" : t === "midnight" ? "bg-[#0d1117]" : t === "sepia" ? "bg-[#f4ecd8]" : "bg-white border border-gray-300"}
                        ${settings.theme === t ? "ring-2 ring-amber-400 scale-110" : "opacity-70 hover:opacity-100"}
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
          className={`
            fixed bottom-6 right-6 
            w-12 h-12 rounded-full 
            flex items-center justify-center
            shadow-lg transition-all duration-300
            hover:scale-110 active:scale-95
            ${settings.theme === "dark" || settings.theme === "midnight"
              ? "bg-amber-500 text-white hover:bg-amber-400"
              : "bg-amber-500 text-white hover:bg-amber-400"
            }
          `}
          style={{ zIndex: 996 }}
          aria-label="Open reading settings"
        >
          <Settings2 className="w-5 h-5" />
        </button>,
        document.body
      )}

      <div
        className={`
          min-h-screen ${currentTheme.bg} ${currentTheme.text} 
          transition-colors duration-500 relative
        `}
      >

        {/* ============ CHAPTER CONTENT ============ */}
        <main
          className="container mx-auto px-4 pb-32"
          style={{ paddingTop: NAVBAR_HEIGHT + 20, maxWidth: "680px" }}
        >
          {/* Chapter Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 pt-8 text-center"
          >
            <div className={`flex items-center justify-center gap-2 ${currentTheme.accent} mb-6`}>
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-[0.2em]">
                {novelDisplayName}
              </span>
            </div>

            <h1 className={`text-4xl md:text-5xl font-bold ${currentTheme.accent} mb-3 font-display`}>
              Chapter {chapter.chapterNumber}
            </h1>

            <h2 className={`text-xl md:text-2xl opacity-80 mb-8 font-display italic`}>
              {chapter.title}
            </h2>

            <div className={`flex items-center justify-center gap-4 text-sm ${currentTheme.mutedText}`}>
              <span>
                {new Date(chapter.releaseDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="w-1.5 h-1.5 bg-current rounded-full opacity-50" />
              <span>{readingTime} min read</span>
            </div>

            {/* Decorative Divider */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <span className={`h-px w-16 ${currentTheme.border} border-t`} />
              <span className={`text-xl ${currentTheme.mutedText}`}>❦</span>
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
              tracking-[0.01em]
              [word-spacing:0.05em]
              prose max-w-none
              ${settings.theme === "dark" || settings.theme === "midnight" ? "prose-invert" : ""}
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

          <StickyNewsletterBar showAfter={30} novelName={novelDisplayName} />

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
                  rounded-xl transition-all duration-300
                  hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(249,115,22,0.3)]
                `}
              >
                Next: {nextChapter.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )} */}

          <ChapterEndCTA
            nextChapter={nextChapter}
            novelSlug={Novel as string}
            novelName={novelDisplayName}
            chapterNumber={chapter.chapterNumber}
          />
        </main>

        {/* ============ COMMENTS ============ */}
        <div className="container mx-auto px-4 pb-32 max-w-3xl">
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
          className="fixed z-[9997] -translate-x-1/2 -translate-y-full bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 px-2 py-1.5 flex items-center gap-1"
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
          20%      { background-color: rgba(251, 191, 36, 0.25); }
        }
      `}</style>
    </>
  );
}
