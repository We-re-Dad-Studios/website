// app/start/dawnshipper/page.tsx
// HYPER-FOCUSED LANDING PAGE FOR AD TRAFFIC
// One job: Get them to Chapter 1

import { Metadata } from "next";
import { StartDawnshipperClient } from "./_components/client";  

export const metadata: Metadata = {
  title: "Read Dawnshipper Free | Chapter 1",
  description:
    "He bonded with the Echo of Chaos. Now everyone wants him dead. Start reading the dark fantasy epic for free.",
  openGraph: {
    title: "Read Dawnshipper Free | Chapter 1",
    description:
      "He bonded with the Echo of Chaos. Now everyone wants him dead.",
    url: "https://weredadstudios.com/start/dawnshipper",
    images: [
      {
        url: "https://res.cloudinary.com/dpxuxtdbh/image/upload/v1741439432/ds-main_lsc6ec.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function StartDawnshipperPage() {
  return <StartDawnshipperClient />;
}