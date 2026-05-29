import { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
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
    <div className="dark min-h-screen bg-[#0a0a0b] text-white overflow-hidden">
      {/* Hero — server-rendered, CSS animations only (no JS required) */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="relative z-10 text-center max-w-6xl">
          <h1
            className="text-6xl md:text-8xl font-bold mb-6"
            style={{ animation: "hero-fade-up 0.6s 0.4s ease both" }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              WE&apos;RE DAD
            </span>
            <br />
            <span className="text-white">STUDIOS</span>
          </h1>

          <div
            className="flex justify-center gap-4 mb-8"
            style={{ animation: "hero-fade-up 0.6s 0.6s ease both" }}
          >
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <div className="h-2 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
          </div>

          <p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            style={{ animation: "hero-fade-up 0.6s 0.8s ease both" }}
          >
            Crafting immersive worlds through games, novels, manga, and animation.
            <br />
            <span className="text-purple-400">Where imagination meets innovation.</span>
          </p>

          <div
            className="mt-12"
            style={{ animation: "hero-fade-up 0.6s 1s ease both" }}
          >
            <a
              href="#team"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105"
            >
              Meet The Team
            </a>
          </div>
        </div>

        {/* Scroll Indicator — CSS animation, no JS */}
        <div
          className="absolute bottom-8 left-1/2"
          style={{ animation: "scroll-indicator-bounce 2s ease-in-out infinite" }}
        >
          <div className="w-6 h-10 border-2 border-purple-500 rounded-full flex items-start justify-center p-2">
            <div
              className="w-1.5 h-1.5 bg-purple-500 rounded-full"
              style={{ animation: "scroll-dot-slide 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </section>

      {/* Our Story — server-rendered static content */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Story
              </span>
            </h2>
            <div className="space-y-5 text-lg text-gray-300 leading-relaxed text-left">
              <p>
                We&apos;re Dad Studios is an independent creative studio telling
                ambitious, character-driven stories rooted in African myth and
                imagination — across novels, games, manga, and animation.
              </p>
              <p>
                We started with a simple belief: the worlds we grew up wishing
                existed deserve to be built. Today that means two flagship
                serialized novels updated almost daily, with games and animation
                growing out of the same universe.
              </p>
              <p className="text-purple-300">
                No filler. No abandoned projects. Just worlds worth getting lost
                in.
              </p>
            </div>
          </div>

          {/* Honest stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { value: "2", label: "Flagship Novels" },
              { value: "20+", label: "Chapters Live" },
              { value: "7", label: "Team Members", icon: true },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-5 sm:p-8 text-center hover:border-purple-500/50 transition-all"
              >
                {stat.icon && (
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-purple-500" />
                )}
                <div className="text-3xl sm:text-4xl font-bold mb-1 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive team section — client component */}
      <AboutUs />

      {/* CTA — server-rendered static content */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Level Up
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community and be part of the adventure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://discord.gg/Vjjw2f42"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105"
            >
              Join the Discord
            </a>
            <Link
              href="/projects"
              className="inline-block px-8 py-4 border-2 border-white/30 hover:border-white/60 rounded-full font-medium text-lg transition-all duration-300 hover:bg-white/5"
            >
              Explore Our Worlds
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
