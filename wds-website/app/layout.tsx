import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Bebas_Neue} from "next/font/google"
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WDS",
  description: "WDS is a creative studio specializing in game development, animation, manhwa, manga, and novel creation. We build immersive worlds and craft compelling stories that captivate audiences across different mediums.",
  keywords: "game development, animation, manhwa, manga, novel creation, creative studio, WDS",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "WDS - Game Development & Creative Studio",
    description: "We craft captivating stories and immersive worlds in games, animation, manhwa, manga, and novels.",
    url: "s", 
    siteName: "WDS",
    
    images: [
      {
        url: "/WDS LOGO BLACK_.png", 
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
    title: "WDS - Game Development & Creative Studio",
    description: "We build immersive worlds through games, animation, manhwa, manga, and novels.",
    creator: "@WDS_Studio", // Your Twitter handle
    images: ["/WDS LOGO BLACK_.png"], // Your image URL here
  }

};
const bebas= Bebas_Neue({
  subsets:["latin","latin-ext"],
  weight:["400"],
  variable:"--font-bebas"
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${bebas.className} antialiased bg-base_black`}
      >
        {children}
      </body>
    </html>
  );
}
