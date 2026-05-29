import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Agdasima, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import PageView from "@/components/PhPageView";
import { Toaster } from "@/components/ui/sonner";
import { GlitchTransition } from "@/components/glitch-transition";
import ScrollProgressBar, { ScrollProgressBarProvider } from "@/components/scroll-progress-bar";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OfflineBanner } from "@/components/OfflineBanner";
import { CommandPalette } from "@/components/CommandPalette";
import { MotionConfig } from "framer-motion";

const Newsletter = dynamic(() =>
  import("@/components/Newsletter").then((mod) => mod.Newsletter)
);

const agdasima = Agdasima({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-agdasima",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "We're Dad Studios",
  description:
    "WDS is a creative studio specializing in game development, animation, manhwa, manga, and novel creation.",
  keywords:
    "game development, animation, manhwa, manga, novel creation, creative studio, WDS, webnovel, webtoon, indie games, storytelling,fantasy novel,african game studio,nigerian game studio,nigerian storytellers,african stories",
  metadataBase: new URL("https://weredadstudios.com"),
  alternates: {
    canonical: "https://weredadstudios.com",
    types: {
      "application/rss+xml": "https://weredadstudios.com/feed.xml",
    },
  },

  // FAVICONS
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon-32x32.png",
    apple: "/images/apple-touch-icon-dark.png",
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    title: "WDS - Game Development & Creative Studio",
    description:
      "We craft captivating stories and immersive worlds in games, animation, manhwa, manga, and novels.",
    url: "https://weredadstudios.com", // your actual domain
    siteName: "We're Dad Studios",
    images: [
      {
        url: "/images/WDS LOGO BLACK_.png",
        width: 1200,
        height: 630,
        alt: "WDS Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "We're Dad Studios",
    description:
      "WDS is a creative studio specializing in game development, animation, manhwa, manga, and novel creation.",
    images: ["/images/WDS LOGO BLACK_.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${agdasima.variable} ${bebasNeue.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "We're Dad Studios",
              url: "https://weredadstudios.com",
              logo: "https://weredadstudios.com/images/WDS LOGO BLACK_.png",
              sameAs: [
                "https://www.tiktok.com/@weredadstudios",
                "https://www.instagram.com/weredadstudios",
                "https://discord.gg/Vjjw2f42",
              ],
              description:
                "A creative studio specializing in game development, animation, manhwa, manga, and novel creation.",
            }),
          }}
        />
      </head>
      <PostHogProvider>
        <body className="antialiased bg-background text-foreground font-agdasima">
          <MotionConfig reducedMotion="user">
          <ThemeProvider>
            <ServiceWorkerRegister />
            <Suspense fallback={null}>
              <PageView />
            </Suspense>
            <Navbar />
            <CommandPalette />
            <ScrollProgressBarProvider>
              <ScrollProgressBar/>
              <GlitchTransition>
                {children}
              </GlitchTransition>
            </ScrollProgressBarProvider>
            <Newsletter />
            <Toaster />
            <OfflineBanner />
            <Footer />
          </ThemeProvider>
          </MotionConfig>
        </body>
      </PostHogProvider>
    </html>
  );
}
