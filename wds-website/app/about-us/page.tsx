import { Metadata } from "next";
import AboutUs from "@/components/About-us";

export const metadata: Metadata = {
  title: "About Us | We're Dad Studios",
  description:
    "Meet the team behind WDS — a creative studio building games, novels, and animated worlds rooted in African storytelling.",
  openGraph: {
    title: "About Us | We're Dad Studios",
    description:
      "Meet the team behind WDS — a creative studio building games, novels, and animated worlds rooted in African storytelling.",
    url: "https://weredadstudios.com/about-us",
  },
  alternates: { canonical: "https://weredadstudios.com/about-us" },
};

export default function Page() {
    return (
        <AboutUs/>
    );
}