"use client";

import { withFadeIn } from "@/utils/withFadeIn";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import { useParams, useRouter } from "next/navigation";
import { ReactNode,  useEffect,  useRef,  useState } from "react";
import { Comments } from "./Comments";
import { calculateReadingTime } from "@/lib/reading-time";
import { extractPlainText } from "@/lib/extract-doc-text";
import { useTTS } from "@/hooks/useTTS";
import { Volume2, VolumeX, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useScrollProgress } from "@/components/scroll-progress-bar";
import { useScroll } from "framer-motion";
// import { InlineNewsletterCTA } from "@/components/inlinenewslettercta";
import { ChapterEndCTA } from "@/components/chapterendcta";
import { StickyNewsletterBar } from "@/components/stickynewsletterbar";
// import { NewsletterModal } from "@/components/newslettermodal";
const options: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return <p className="mb-6 last:mb-0">{children}</p>;
    },
    [BLOCKS.HEADING_1]: (node, children) => {
      return (
        <h1 className="text-3xl font-bold text-amber-300 mt-12 mb-6">
          {children}
        </h1>
      );
    },
    [BLOCKS.HEADING_2]: (node, children) => {
      return (
        <h2 className="text-2xl font-bold text-amber-300 mt-10 mb-5">
          {children}
        </h2>
      );
    },
    [BLOCKS.HEADING_3]: (node, children) => {
      return (
        <h3 className="text-xl font-bold text-amber-300 mt-8 mb-4">
          {children}
        </h3>
      );
    },
    [BLOCKS.UL_LIST]: (node, children) => {
      return <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>;
    },
    [BLOCKS.OL_LIST]: (node, children) => {
      return <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>;
    },
    [BLOCKS.LIST_ITEM]: (node, children) => {
      return <li className="pl-2">{children}</li>;
    },
    [BLOCKS.QUOTE]: (node, children) => {
      return (
        <blockquote className="border-l-4 border-amber-500 pl-4 my-6 italic text-gray-300">
          {children}
        </blockquote>
      );
    },
    [BLOCKS.HR]: () => {
      return <hr className="my-8 border-gray-700" />;
    },
  },
  renderText: (text) => {
    return text
      .split("\n")
      .reduce((children: ReactNode[], textSegment, index) => {
        return [...children, index > 0 && <br key={index} />, textSegment];
      }, []);
  },
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

type FontSize = "sm" | "md" | "lg" | "xl";
type Theme = "dark" | "sepia" | "light";

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

// Navbar height constant - adjust if your navbar height changes
const NAVBAR_HEIGHT = 80; // matches h-[80px] in Navbar.tsx

function ChapterReader({
  chapter,
  content,
  nextChapter,
  prevChapter,
}: ChapterReaderProps) {
  const cleanedText = extractPlainText(chapter.content as Document)
    .replace(/\s+/g, " ")
    .trim();
  const readingTime = calculateReadingTime(cleanedText);
  const { speak, stop, isSpeaking } = useTTS(cleanedText);

  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [theme, setTheme] = useState<Theme>("dark");
  const [showControls, setShowControls] = useState(true);
  const { slug: Novel } = useParams();
  const router = useRouter();

  const { setProgress } = useScrollProgress();
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

  const fontSizes: Record<FontSize, string> = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const themes: Record<Theme, { bg: string; text: string; accent: string; headerBg: string }> = {
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      accent: "text-amber-400",
      headerBg: "bg-gray-900/95",
    },
    sepia: {
      bg: "bg-amber-50",
      text: "text-gray-800",
      accent: "text-amber-700",
      headerBg: "bg-amber-50/95",
    },
    light: {
      bg: "bg-white",
      text: "text-gray-900",
      accent: "text-amber-600",
      headerBg: "bg-white/95",
    },
  };

  const currentTheme = themes[theme];
  const novelDisplayName = `${(Novel as string)[0].toUpperCase()}${(Novel as string).replace("_", " ").slice(1)}`;
const contentRef = useRef<HTMLDivElement>(null);

// Framer Motion scroll tracking relative to the article
const { scrollYProgress } = useScroll({
  target: contentRef,
  offset: ["start start", "end end"],
});

useEffect(()=>{
  setProgress(scrollYProgress);
},[scrollYProgress])

  return (
   
<>
{/* <NewsletterModal
  triggerAt={45}
  delay={3000}
  novelName={novelDisplayName}
  exitIntent={true}
/> */}
<div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300 relative`}>
      
     


      {/* ============ READER CONTROLS - Fixed below progress bar ============ */}
      <header
        className={`
          fixed left-0 right-0 z-[997]
          transition-all duration-300
          ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
        `}
        style={{ top: NAVBAR_HEIGHT/2 + 4 }} 
      >
        <div className={`${currentTheme.headerBg} backdrop-blur-md border-b border-white/10 mx-4 rounded-lg shadow-lg`}>
          <div className="px-4 py-3 flex items-center justify-between">
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
                onClick={() => (isSpeaking ? stop() : speak())}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-sm
                  ${isSpeaking 
                    ? "bg-primary-0 text-white" 
                    : theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
                  }
                `}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span className="hidden sm:inline">Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Listen</span>
                  </>
                )}
              </button>

              {/* Font Size */}
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as FontSize)}
                className={`
                  ${theme === "dark" ? "bg-white/30 text-black" : "bg-black/10 text-gray-900"}
                  border-0 rounded-lg px-2 py-1.5 text-sm cursor-pointer focus:ring-2 focus:ring-primary-0
                `}
              >
                <option value="sm">A-</option>
                <option value="md">A</option>
                <option value="lg">A+</option>
                <option value="xl">A++</option>
              </select>

              {/* Theme Switcher */}
              <div className={`flex gap-1 p-1 rounded-lg ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`}>
                {(Object.keys(themes) as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`
                      w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all
                      ${t === "dark" ? "bg-gray-700" : t === "sepia" ? "bg-amber-200" : "bg-white border border-gray-300"}
                      ${theme === t ? "ring-2 ring-primary-0 scale-110" : "opacity-70 hover:opacity-100"}
                    `}
                    aria-label={`${t} theme`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ CHAPTER CONTENT ============ */}
      <main 
        className="container mx-auto px-4 pb-32 max-w-3xl"
        style={{ paddingTop: NAVBAR_HEIGHT + 20 }}
      >
        
        {/* Chapter Header */}
        <div className="mb-12 pt-8 text-center">
          <div className={`flex items-center justify-center gap-2 ${currentTheme.accent} mb-4`}>
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              {novelDisplayName}
            </span>
          </div>
          
          <h1 className={`text-3xl md:text-4xl font-bold ${currentTheme.accent} mb-2`}>
            Chapter {chapter.chapterNumber}
          </h1>
          
          <h2 className={`text-xl md:text-2xl opacity-80 mb-6`}>
            {chapter.title}
          </h2>

          <div className="flex items-center justify-center gap-4 text-sm opacity-60">
            <span>
              {new Date(chapter.releaseDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="w-1 h-1 bg-current rounded-full" />
            <span>⏱️ {readingTime} min read</span>
          </div>
          
          <div className={`mt-8 h-px ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />
        </div>

        {/* Chapter Text */}
        <article
        ref={contentRef}
          className={`
            ${fontSizes[fontSize]} 
            leading-relaxed 
            text-justify 
            prose max-w-none
            ${theme === "dark" ? "prose-invert" : ""}
            prose-headings:text-amber-400
            prose-a:text-amber-400
            prose-strong:font-semibold
          `}
        >
          {documentToReactComponents(content, options)}
        </article>
<StickyNewsletterBar 
  showAfter={30} 
  novelName={novelDisplayName} 
/>
        {/* Next Chapter CTA */}
        {/* {nextChapter && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-center text-sm opacity-60 mb-4">Continue reading</p>
            <Link
              href={`/novels/${Novel}/chapters/${nextChapter}`}
              className="
                flex items-center justify-center gap-3 
                w-full py-4 px-6
                bg-primary-0 hover:bg-primary-0/90 
                text-white font-bold text-lg
                rounded-xl transition-all hover:scale-[1.02]
                hover:shadow-[0_0_30px_rgba(249,76,16,0.3)]
              "
            >
              Next: {nextChapter.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase())}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )} */}

       
<ChapterEndCTA
  nextChapter={nextChapter}
  novelSlug={Novel as string}
  novelName={novelDisplayName}
  chapterNumber={chapter.chapterNumber}
/>
      </main>


      {/* ============ FIXED BOTTOM NAV ============ */}
      <nav
        className={`
          fixed bottom-0 left-0 right-0 z-[997]
          transition-all duration-300
          ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
      >
        <div className={`${currentTheme.headerBg} backdrop-blur-md border-t border-white/10 mx-4 mb-4 rounded-lg shadow-lg`}>
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Previous */}
            <button
              disabled={!prevChapter}
              onClick={() => router.push(`/novels/${Novel}/chapters/${prevChapter}`)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                ${prevChapter 
                  ? `${currentTheme.accent} hover:bg-white/10` 
                  : "opacity-30 cursor-not-allowed"
                }
              `}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Previous</span>
            </button>


            {/* Next */}
            <button
              disabled={!nextChapter}
              onClick={() => router.push(`/novels/${Novel}/chapters/${nextChapter}`)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                ${nextChapter 
                  ? `${currentTheme.accent} hover:bg-white/10` 
                  : "opacity-30 cursor-not-allowed"
                }
              `}
            >
              <span className="hidden sm:inline text-sm">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ============ COMMENTS ============ */}
      <div className="container mx-auto px-4 pb-32 max-w-3xl">
        <Comments title={`${Novel}: chapter-${chapter.chapterNumber}`} />
      </div>
    </div>
      </>
  );
}