import type { Metadata } from "next";

import "./globals.css";
import {Bebas_Neue} from "next/font/google"
import Head from "next/head";


export const metadata: Metadata = {
  title: "WDS",
  description: "WDS is a creative studio specializing in game development, animation, manhwa, manga, and novel creation. We build immersive worlds and craft compelling stories that captivate audiences across different mediums.",
  keywords: "game development, animation, manhwa, manga, novel creation, creative studio, WDS",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "WDS - Game Development & Creative Studio",
    description: "We craft captivating stories and immersive worlds in games, animation, manhwa, manga, and novels.",
    url: "https://weredadstudios.netlify.app/images/WDS%20LOGO%20BLACK_.png", 
    siteName: "WDS",
    
    images: [
      {
        url: "https://weredadstudios.netlify.app/images/WDS%20LOGO%20BLACK_.png", 
        width: 1200,
        height: 630,
        alt: "WDS Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },


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
      <Head>
      <link rel="icon" type="image/x-icon" href="/images/favicon.ico"></link>
      <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
          <link rel="manifest" href="/favicons/site.webmanifest" />
          <meta name="msapplication-TileColor" content="#0a0a0b" />
    </Head>
      <body
        className={` ${bebas.className} antialiased bg-base_black`}
      >
        {children}
      </body>
    </html>
  );
}
