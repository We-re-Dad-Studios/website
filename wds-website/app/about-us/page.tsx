import { Metadata } from "next";
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

      {/* Quick Stats — server-rendered static content */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center hover:border-purple-500/50 transition-all">
                <Users className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  7
                </div>
                <div className="text-gray-400">Team Members</div>
              </div>
            </div>
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
        </div>
      </section>
    </div>
  );
}
