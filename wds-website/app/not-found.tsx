import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | We're Dad Studios",
  description: "The page you were looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bebas tracking-wider mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        This page doesn&apos;t exist — but our stories do.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg main-btn text-white transition-all hover:scale-105"
        >
          Go Home
        </Link>
        <Link
          href="/projects"
          className="px-6 py-3 rounded-lg border border-border hover:bg-accent transition-all"
        >
          Explore Projects
        </Link>
      </div>
    </section>
  );
}
