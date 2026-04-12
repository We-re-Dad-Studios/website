import { Metadata } from "next";
import { OfflineClient } from "./OfflineClient";

export const metadata: Metadata = {
  title: "Offline | We're Dad Studios",
  description: "You're offline. Here's what you can still read.",
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-base_black text-white flex items-start justify-center px-6 pt-32 pb-20">
      <div className="w-full max-w-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-3">
          You&apos;re offline
        </p>
        <h1 className="text-4xl font-bold mb-4">Still reading, even offline.</h1>
        <p className="text-white/60 mb-10 leading-relaxed">
          You can open any chapter you&apos;ve saved for offline reading, or
          jump back in whenever your connection returns.
        </p>
        <OfflineClient />
      </div>
    </main>
  );
}
