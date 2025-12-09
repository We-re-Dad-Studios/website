// app/start/project-osiris/page.tsx
// HYPER-FOCUSED LANDING PAGE FOR AD TRAFFIC

import { Metadata } from "next";
import { StartOsirisClient } from "./_components/client";

export const metadata: Metadata = {
  title: "Read Project Osiris Free | Chapter 1",
  description:
    "Death is negotiable—for a price. Start reading the supernatural sci-fi thriller for free.",
  openGraph: {
    title: "Read Project Osiris Free | Chapter 1",
    description: "Death is negotiable—for a price. She knows what's hunting them in the Light.",
    url: "https://weredadstudios.com/start/project-osiris",
    images: [
      {
        url: "https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function StartOsirisPage() {
  return <StartOsirisClient />;
}