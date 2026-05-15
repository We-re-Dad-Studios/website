# We're Dad Studios — Portfolio Case Study

## Overview

A production Next.js 15 content platform for **We're Dad Studios**, a serialized fiction studio. The site serves as the primary distribution hub for two flagship novels (*Dawnshipper* and *Project Osiris*), a blog, and a project showcase — built entirely by one developer as a full-stack creative publishing platform.

**Live:** https://weredadstudios.com  
**Stack:** Next.js 15 · TypeScript · Contentful CMS · Tailwind CSS · Framer Motion · Resend · PostHog

---

## Key Stats

| Metric | Count |
|--------|-------|
| Total source files (app/, components/, hooks/, lib/, utils/) | 181 |
| Pages / routes (`page.tsx` files) | 10 |
| API route files | 2 |
| Custom hooks | 5 |
| Component files | 34 |
| Library / utility modules | 6 |
| Higher-order components | 1 |

---

## Architecture

### Framework & Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + custom design tokens |
| Animation | Framer Motion 11 |
| CMS | Contentful (Content Delivery API) |
| Email | Resend API + React Email |
| Analytics | PostHog (self-proxied via Next.js rewrites) |
| Comments | Disqus |
| Deployment | Netlify |

### Project Structure

The project follows a **route-first architecture** with co-located components per feature area and a shared `components/` layer for cross-cutting UI.

```
wds-website/
├── app/
│   ├── page.tsx                          # Splash + Hero entry point
│   ├── layout.tsx                        # Root layout (nav, analytics, modals)
│   ├── api/
│   │   └── newsletter/                   # Email subscription endpoints
│   ├── blog/
│   │   ├── page.tsx                      # Blog listing (server, Contentful)
│   │   └── [id]/                         # Individual blog post + components
│   ├── novels/
│   │   └── [slug]/chapters/[chapterSlug] # Chapter reader (the core feature)
│   └── projects/
│       ├── page.tsx                      # Projects hub
│       ├── dawnshipper/                  # Novel 1 landing
│       └── project_osiris/               # Novel 2 landing
├── components/                           # Shared UI (34 files)
├── hooks/                                # Custom hooks (5 files)
├── lib/
│   └── contentful.ts                     # Server-side CMS client + helpers
└── utils/
    └── withFadeIn.tsx                    # Fade-in HOC for page components
```

### Data Flow Pattern

Server components fetch from Contentful using private API keys and pass typed data down as props to client components. Client components handle all interactivity (filtering, reader settings, animations) without additional network requests.

```
Contentful CMS
     │
     ▼
lib/contentful.ts (server-side, private keys)
     │
     ▼
app/**/page.tsx (async server components)
     │ props
     ▼
components/*.tsx (client components — interactivity only)
```

---

## My Role

**Solo full-stack developer.** Responsible for the entire product: architecture decisions, CMS modelling, UI/UX design, animation engineering, email infrastructure, analytics setup, and deployment configuration. The most technically significant parts of the project are:

1. The **chapter reader system** (`FadedContent.tsx`) — a 889-line immersive reading experience with real-time theme switching, typography controls, TTS, scroll tracking, and focus mode, all persisted to localStorage.
2. The **splash + session flow** (`page.tsx` + `SplashImage.tsx`) — first-visit detection using session storage with a sequenced logo animation that gates the CTA button until the image has loaded.
3. The **glitch page transition** (`glitch-transition.tsx`) — a cinematic full-screen effect with scan lines, RGB split, noise, and corner brackets, user-togglable, stored in localStorage.
4. The **Contentful data architecture** — dual client strategy (server-side private keys in `lib/contentful.ts`, client-side public key via `useContentfulClient`) with typed interfaces and parallel fetching.

---

## Interesting Code Snippets

### 1. Chapter Reader — Theme & Typography System

**File:** `app/novels/[slug]/chapters/[chapterSlug]/_components/FadedContent.tsx`

Seven reader preferences persisted to localStorage with real-time preview. The theme map drives Tailwind class switching without CSS-in-JS overhead.

```typescript
interface ReaderSettings {
  fontSize: "sm" | "md" | "lg" | "xl";
  fontFamily: "serif" | "sans" | "mono";
  theme: "dark" | "sepia" | "light" | "midnight";
  lineHeight: "normal" | "relaxed" | "loose";
  textAlign: "left" | "justify";
  showDropCap: boolean;
  focusMode: boolean;
}

const themeMap = {
  dark:     { bg: "bg-gray-900",    text: "text-gray-100",   accent: "text-amber-400" },
  midnight: { bg: "bg-[#0d1117]",   text: "text-[#c9d1d9]",  accent: "text-amber-400" },
  sepia:    { bg: "bg-[#f4ecd8]",   text: "text-[#5c4b37]",  accent: "text-amber-700" },
  light:    { bg: "bg-[#fafafa]",   text: "text-gray-800",   accent: "text-amber-600" },
};

const fontSizeMap = { sm: "text-base", md: "text-lg", lg: "text-xl", xl: "text-2xl" };
const lineHeightMap = { normal: "leading-relaxed", relaxed: "leading-loose", loose: "leading-[2.25]" };
```

---

### 2. Splash Image — Load-Gated Animation Sequence

**File:** `components/SplashImage.tsx`

Entrance animation only fires after the image has loaded (`onLoad` callback), preventing animation on an invisible element. Cleanup prevents the pulse timer firing after unmount.

```typescript
export const SplashImage = ({ onImageLoaded }: { onImageLoaded?: () => void }) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [hasImageLoaded, setHasImageLoaded] = useState(false);

  useEffect(() => {
    if (!hasImageLoaded || !imageRef.current) return;

    animate(imageRef.current, {
      y: [30, 10, -120],
      opacity: [0, 0, 1],
      scale: [0.8, 0.8, 1],
    }, { duration: 0.7, ease: "easeOut", times: [0, 0.5, 1] });

    const pulseTimer = setTimeout(() => {
      if (imageRef.current) {
        animate(imageRef.current, { scale: [1, 1.05, 0.95] }, {
          duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut",
        });
      }
    }, 750);

    return () => clearTimeout(pulseTimer);
  }, [hasImageLoaded]);

  return (
    <Image
      alt="logo"
      style={{ opacity: 0 }}
      ref={imageRef}
      onLoad={() => { setHasImageLoaded(true); onImageLoaded?.(); }}
      src="/images/WDS LOGO WHITE.png"
      width={2000}
      height={2000}
      className="splash-image absolute drop-shadow-md max-w-[95vw] w-[600px] object-cover"
    />
  );
};
```

---

### 3. Contentful Rich Text — Drop Cap & Scene Break Rendering

**File:** `app/novels/[slug]/chapters/[chapterSlug]/_components/FadedContent.tsx`

Custom Contentful rich-text renderer with first-paragraph drop cap, scene break dividers (`✦`), and paragraph indentation — matching professional typesetting conventions.

```typescript
const createOptions = (isFirstParagraph: boolean, showDropCap: boolean) => ({
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      if (isFirstParagraph && showDropCap) {
        return (
          <p className="mb-6 first-letter:text-5xl first-letter:font-serif
                        first-letter:font-bold first-letter:float-left
                        first-letter:mr-3 first-letter:text-amber-400">
            {children}
          </p>
        );
      }
      return <p className="mb-6 indent-8">{children}</p>;
    },
    [BLOCKS.HR]: () => (
      <div className="my-12 flex items-center justify-center gap-4">
        <span className="h-px flex-1 bg-current opacity-20" />
        <span className="text-2xl opacity-40">✦</span>
        <span className="h-px flex-1 bg-current opacity-20" />
      </div>
    ),
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-amber-500/60 pl-6 pr-4 my-8 italic">
        {children}
      </blockquote>
    ),
  },
});
```

---

### 4. Contentful Server Client — Shared Singleton + Parallel Fetching

**File:** `lib/contentful.ts`

Single server-side Contentful client (private keys, never exposed to the browser). Chapter navigation fetches `next` and `prev` in parallel rather than sequentially.

```typescript
// lib/contentful.ts
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CDAPI!,
});

export async function getBlogPost(id: string) {
  return client.getEntry(id);
}

export async function getChapterByNumber(chapterNumber: number, projectSlug: string) {
  const response = await client.getEntries({
    content_type: "chapter",
    "fields.chapterNumber": chapterNumber,
    "fields.projectSlug": projectSlug,
    limit: 1,
  });
  return response.items[0]?.fields ?? null;
}

// app/novels/[slug]/chapters/[chapterSlug]/page.tsx
const chapterContent = await getChapterBySlug(chapterSlug);
const [nextChapter, prevChapter] = await Promise.all([
  getChapterByNumber(chapterContent?.chapterNumber + 1, slug),
  getChapterByNumber(chapterContent?.chapterNumber - 1, slug),
]);
```

---

### 5. useTTS — Web Speech API Custom Hook

**File:** `hooks/useTTS.ts`

Wraps the browser Web Speech API for audiobook-style chapter reading. Integrated directly into the chapter reader toolbar with an amber "listening" indicator.

```typescript
export function useTTS(text: string) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { isSpeaking, speak, stop };
}
```

---

### 6. Auto-hiding Reader Controls — Scroll + Mouse Idle Timer

**File:** `app/novels/[slug]/chapters/[chapterSlug]/_components/FadedContent.tsx`

The header toolbar fades out after 2.5s of inactivity and reappears on any scroll, mousemove, or touch event — keeping the reading surface uncluttered.

```typescript
useEffect(() => {
  let scrollTimer: ReturnType<typeof setTimeout>;

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => setShowControls(false), 2500);
  };

  window.addEventListener("scroll", showControlsTemporarily);
  window.addEventListener("mousemove", showControlsTemporarily);
  window.addEventListener("touchstart", showControlsTemporarily);

  return () => {
    window.removeEventListener("scroll", showControlsTemporarily);
    window.removeEventListener("mousemove", showControlsTemporarily);
    window.removeEventListener("touchstart", showControlsTemporarily);
    clearTimeout(scrollTimer);
  };
}, []);
```

---

## Major Feature Areas

### 1. Chapter Reader
The core product feature. A full immersive reading environment built from scratch: 4 themes (dark, midnight, sepia, light), 4 font sizes, 3 line heights, serif/sans/mono font switching, drop caps, focus mode, scroll progress bar, auto-hiding controls, and browser TTS. All settings persist to localStorage.

**Key files:**
- `app/novels/[slug]/chapters/[chapterSlug]/page.tsx`
- `app/novels/[slug]/chapters/[chapterSlug]/_components/FadedContent.tsx`
- `hooks/useTTS.ts`
- `lib/extract-doc-text.ts`
- `lib/reading-time.ts`

### 2. Content Management (Contentful)
Dual-strategy CMS integration: server-side private client in `lib/contentful.ts` for pages/metadata, client-side public hook (`useContentfulClient`) for interactive filtering. Content model: Novel → Chapter (ordered, rich text) → Tags. Blog posts, projects, and novels are all managed as Contentful content types.

**Key files:**
- `lib/contentful.ts`
- `hooks/useContentfulClient.tsx`
- `app/blog/page.tsx`
- `app/projects/dawnshipper/page.tsx`
- `app/projects/project_osiris/page.tsx`

### 3. Animated Splash & Page Transitions
First-visit detection via session storage triggers a sequenced logo entrance animation (image loads → slides up → pulses). Between pages, a user-toggleable cinematic glitch transition plays: scan lines, RGB channel split, digital noise, and bracket corners at ~500ms. The preference is stored in localStorage.

**Key files:**
- `app/page.tsx`
- `components/SplashImage.tsx`
- `components/glitch-transition.tsx`
- `components/page-transition.tsx`

### 4. Newsletter & Email Infrastructure
A modal newsletter signup (shown after splash, on all non-home pages) posts to `/api/newsletter` which creates a Resend audience contact and sends a branded React Email welcome template. Subscription state is tracked in localStorage to show/hide the form.

**Key files:**
- `app/api/newsletter/route.ts`
- `app/api/newsletter/unsubscribe/route.ts`
- `components/Newsletter.tsx`
- `components/SendEmail.tsx`
- `components/EmailTemplate.tsx`

### 5. Project Showcase
Each flagship novel has a dedicated landing page (Dawnshipper, Project Osiris) fetching chapter lists and tagged related blog posts from Contentful in parallel. A shared projects hub lists all content with client-side tag filtering and search via `useMemo`.

**Key files:**
- `app/projects/page.tsx`
- `app/projects/dawnshipper/page.tsx`
- `app/projects/project_osiris/page.tsx`
- `components/dawnshipper-restructured.tsx`
- `components/osiris-restructured.tsx`

---

## Delivery Phases

| Phase | Description |
|-------|-------------|
| **Discovery** | Defined the content model in Contentful (Novel → Chapter → Tags), mapped the URL structure for the chapter reader (`/novels/[slug]/chapters/[chapterSlug]`), and established the dual-client CMS strategy (private server keys vs. public client key). |
| **System Design** | Architected the route-first folder structure with co-located components, established the server → client data-passing pattern, designed the design token system in Tailwind (purple brand palette, custom fonts), and specced the reader settings interface. |
| **Implementation** | Built all five feature areas: chapter reader with full typography controls and TTS, Contentful data layer, animated splash/transition system, newsletter API with Resend, and the project showcase pages with parallel data fetching. |
| **Quality** | Upgraded Next.js from 14.2.35 to 15.5.14 (patching 6 CVEs), fixed stale closures in client-side data fetching, replaced duplicate inline Contentful client instantiations with a shared utility, and resolved load-ordering bugs in the splash animation sequence. |

---

## Engineering Outcomes

| Outcome | Detail |
|---------|--------|
| **Zero-waterfall data fetching** | `Promise.all` for independent Contentful queries on chapter pages; server components eliminate client-side loading waterfalls entirely on listing pages. |
| **Secure CMS access** | Private Contentful credentials never reach the browser — all server-side queries use `CONTENTFUL_SPACE_ID` (non-public env vars) through `lib/contentful.ts`. |
| **No-hydration-mismatch session logic** | `useSessionStorage` wraps all `sessionStorage` access behind an `isClient` guard, preventing SSR/CSR hydration mismatches. |
| **Immersive reading UX** | 7-axis reader customisation (theme, font size, font family, line height, text align, drop cap, focus mode) with localStorage persistence rivals dedicated e-reader apps. |
| **Security posture** | Next.js 15.5.14 (patched); CSP, HSTS, X-Frame-Options, and X-Content-Type-Options headers configured in `next.config.mjs`; PostHog proxied through Next.js rewrites to bypass ad blockers. |
| **Maintainable content pipeline** | All copy, chapters, blog posts, and project metadata live in Contentful — zero redeploys needed for content updates. |

---

## Tech Stack Summary

```
Frontend:   Next.js 15 (App Router) · React 18 · TypeScript 5
Styling:    Tailwind CSS 3 · Framer Motion 11
CMS:        Contentful (Content Delivery API)
Email:      Resend API · React Email
Analytics:  PostHog (proxied)
Comments:   Disqus
Hosting:    Netlify
```
