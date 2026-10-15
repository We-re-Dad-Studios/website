import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AboutUs from "@/components/About-us";
import { BrandStripes } from "@/components/BrandStripes";

export const metadata: Metadata = {
  title: "About Us | We're Dad Studios",
  description:
    "Meet the team behind WDS — a creative collective building games, novels, manga and animated worlds through transmedia storytelling.",
  openGraph: {
    title: "About Us | We're Dad Studios",
    description:
      "Meet the team behind WDS — a creative collective building games, novels, manga and animated worlds through transmedia storytelling.",
    url: "https://weredadstudios.com/about-us",
  },
  alternates: { canonical: "https://weredadstudios.com/about-us" },
};

// Who / Mission / Vision copy comes from the WDS Brand Guidelines.
const PILLARS = [
  {
    label: "Who we are",
    body: "We're Dad Studios is a creative collective centred on transmedia storytelling across gaming, manga and graphic novels. It grew out of university movie nights, where action anime sparked a desire to craft the same emotional journeys for others.",
  },
  {
    label: "Mission",
    body: "We make the stories that make creators. We inspire the next generation through immersive, high-stakes narratives — community at the heart, human-crafted storytelling over automated content, always.",
  },
  {
    label: "Vision",
    body: "A studio rooted in a fan-centric philosophy that prioritises creative integrity and long-term brand sustainability.",
  },
];

const STATS = [
  { value: "2", label: "Flagship novels" },
  { value: "20+", label: "Chapters live" },
  { value: "7", label: "Team members" },
];

export default function Page() {
  return (
    <div className="w-full bg-background text-foreground">
      {/* HERO — Mystical Indigo */}
      <section className="relative overflow-hidden bg-brand-indigo text-white">
        <BrandStripes className="left-0 top-0 h-[260px] w-[110px] sm:h-[400px] sm:w-[180px]" />
        <BrandStripes className="bottom-0 right-0 h-[260px] w-[110px] rotate-180 sm:h-[400px] sm:w-[180px]" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-10 px-5 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20">
          <div className="min-w-0 flex-[2_1_520px]">
            <Image
              src="/images/wds-mark-white.svg"
              alt="WDS"
              width={200}
              height={82}
              priority
              className="h-auto w-[140px] sm:w-[200px]"
            />
            <h1 className="mb-6 mt-10 font-plaguard text-[48px] font-normal leading-[0.95] sm:text-[72px] lg:text-[96px]">
              We make the stories
              <span className="block text-brand-pink">that make creators</span>
            </h1>
            <p className="m-0 max-w-[600px] text-[21px] leading-[1.4] text-brand-mist sm:text-[25px]">
              A creative collective building novels, games, manga and animation as one
              connected universe — human-crafted, fan-first, and built to last.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="#team"
                className="cut-corners group inline-flex min-h-14 items-center justify-center gap-3 bg-brand-pink px-8 text-[20px] font-bold uppercase tracking-[0.06em] text-brand-ink transition-colors hover:bg-[#F87FE2] sm:text-[22px]"
              >
                Meet the team
                <ArrowRight className="h-5 w-5 rotate-90" strokeWidth={2.5} aria-hidden="true" />
              </a>
              <Link
                href="/projects"
                className="inline-flex min-h-14 items-center justify-center border-2 border-white px-7 text-[20px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white hover:text-brand-indigo sm:text-[22px]"
              >
                Explore our worlds
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHO / MISSION / VISION */}
      <section className="bg-secondary px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3 md:gap-8">
          {PILLARS.map((p) => (
            <div key={p.label}>
              <div className="border-b border-t-2 border-primary-0 pb-4 pt-3">
                <h2 className="m-0 font-plaguard text-[30px] font-normal leading-none text-primary-0 sm:text-[36px]">
                  {p.label}
                </h2>
              </div>
              <p className="m-0 mt-5 text-[20px] leading-[1.5] text-foreground sm:text-[21px]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section aria-label="Studio at a glance" className="border-b-2 border-primary-0 bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-3 px-4 sm:px-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center px-2 py-7 text-center sm:py-9 ${i < STATS.length - 1 ? "border-r border-border" : ""}`}
            >
              <span className="font-plaguard text-[34px] leading-none text-primary-0 sm:text-[52px]">{s.value}</span>
              <span className="mt-2 text-[14px] uppercase tracking-[0.12em] text-wds-text-secondary sm:text-[18px]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM — client component */}
      <AboutUs />

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-indigo px-4 py-16 text-white sm:px-6 sm:py-24">
        <BrandStripes className="right-0 top-0 h-[300px] w-[130px] -scale-x-100 sm:h-[400px] sm:w-[180px]" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-10">
          <div className="min-w-0 flex-[1_1_440px]">
            <h2 className="mb-5 font-plaguard text-[44px] font-normal leading-[0.98] sm:text-[64px] lg:text-[80px]">
              Feel the
              <span className="block text-brand-green">connection</span>
            </h2>
            <p className="m-0 max-w-[480px] text-[21px] text-brand-mist sm:text-[24px]">
              Join the community shaping these worlds with us — theories, sneak peeks and
              release-day chaos.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="https://discord.gg/Vjjw2f42"
              target="_blank"
              rel="noopener noreferrer"
              className="cut-corners inline-flex min-h-14 items-center justify-center gap-3 bg-brand-green px-8 text-[20px] font-bold uppercase tracking-[0.06em] text-brand-ink transition-colors hover:bg-[#5CF7A3] sm:text-[22px]"
            >
              Join the Discord
            </a>
            <Link
              href="/projects"
              className="inline-flex min-h-14 items-center justify-center border-2 border-white px-7 text-[20px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white hover:text-brand-indigo sm:text-[22px]"
            >
              Explore our worlds
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
