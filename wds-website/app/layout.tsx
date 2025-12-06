import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";
import KoFiWidget from "@/components/KofiWidget";

import { EchoTransition } from "@/components/page-transition";
import { GlitchTransition } from "@/components/glitch-transition";

export const metadata: Metadata = {
  title: "We're Dad Studios",
  description:
    "WDS is a creative studio specializing in game development, animation, manhwa, manga, and novel creation.",
  keywords:
    "game development, animation, manhwa, manga, novel creation, creative studio, WDS, webnovel, webtoon, indie games, storytelling,fantasy novel,african game studio,nigerian game studio,nigerian storytellers,african stories",
  viewport: "width=device-width, initial-scale=1",

  
  alternates: {
    canonical: "https://weredadstudios.com",
  },

  // FAVICONS
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon-32x32.png",
    apple: "/images/apple-touch-icon.png",
  },

  manifest: "/favicons/site.webmanifest",

  openGraph: {
    title: "WDS - Game Development & Creative Studio",
    description:
      "We craft captivating stories and immersive worlds in games, animation, manhwa, manga, and novels.",
    url: "https://weredadstudios.com", // your actual domain
    siteName: "We're Dad Studios",
    images: [
      {
        url: "/images/WDS_LOGO_BLACK_.png", // local image
        width: 1200,
        height: 630,
        alt: "WDS Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const PageView = dynamic(() => import("@/components/PhPageView"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <PostHogProvider>
        <body className="antialiased bg-base_black font-agdasima setfont text-[#FAFAFA]">
          <PageView />
          <Navbar />

                 {/* <EchoTransition>{children}</EchoTransition>
                  */}
                  <GlitchTransition>
                    {children}
                  </GlitchTransition>
          <KoFiWidget />
          <Newsletter />
          <Toaster />
          <Footer />
        </body>
      </PostHogProvider>
    </html>
  );
}
