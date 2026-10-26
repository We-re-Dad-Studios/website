"use client";

// Site-wide newsletter signup (rendered above the footer in the root layout).
// Brand design from the rebrand canvas: "Never miss a chapter".

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { isChromeless } from "@/lib/chrome";

type NewsletterInfo = { email?: string; subscribed?: boolean };

const STORAGE_KEY = "newsletterInfo";

function readInfo(): NewsletterInfo {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeInfo(info: NewsletterInfo) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch {
    // storage unavailable (private mode) — the signup itself still worked
  }
}

// fetch only rejects on network errors; treat non-2xx as failures too.
async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res;
}

export const Newsletter = () => {
  const path = usePathname();
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState<NewsletterInfo>({});
  const [pending, setPending] = useState(false);

  // Hidden on the first-visit splash; read storage after mount so server and
  // client render the same markup. (Reads sessionStorage directly: the
  // useSessionStorage hook returns a new getItem each render, which would
  // re-run this effect forever.)
  useEffect(() => {
    let hasVisited = false;
    try {
      hasVisited = Boolean(JSON.parse(sessionStorage.getItem("state") || "{}").hasVisited);
    } catch {
      hasVisited = false;
    }
    setShow(hasVisited || path !== "/");
    setInfo(readInfo());
  }, [path]);

  if (!show || isChromeless(path)) return null;

  const subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const firstName = String(data.get("firstName") ?? "").trim();
    setPending(true);
    toast.promise(postJson("/api/newsletter", { email, firstName }), {
      loading: "Subscribing…",
      success: () => {
        const next = { email, subscribed: true };
        writeInfo(next);
        setInfo(next);
        form.reset();
        return "You're on the list. Check your inbox!";
      },
      error: "Couldn't subscribe — please try again.",
      finally: () => setPending(false),
    });
  };

  const unsubscribe = () => {
    setPending(true);
    toast.promise(postJson("/api/newsletter/unsubscribe", { email: info.email ?? "" }), {
      loading: "Unsubscribing…",
      success: () => {
        const next = { email: info.email, subscribed: false };
        writeInfo(next);
        setInfo(next);
        return "You've been unsubscribed.";
      },
      error: "Couldn't unsubscribe — please try again.",
      finally: () => setPending(false),
    });
  };

  return (
    <section aria-labelledby="newsletter-heading" className="w-full border-t border-border bg-background px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-x-16 gap-y-8">
        <div className="min-w-0 flex-[1_1_420px]">
          <h2 id="newsletter-heading" className="m-0 mb-3 font-plaguard text-[32px] font-normal leading-[1.02] text-primary-0 sm:text-[46px]">
            Never miss a chapter
          </h2>
          <p className="m-0 max-w-[520px] text-[19px] text-wds-text-secondary sm:text-[21px]">
            New chapters, behind-the-scenes art and studio news. No spam.
          </p>
        </div>

        {info.subscribed ? (
          <div className="flex min-w-0 flex-[1_1_460px] flex-wrap items-center gap-x-6 gap-y-3" role="status">
            <p className="m-0 flex items-center gap-3 text-[20px] font-bold text-foreground sm:text-[22px]">
              <span className="h-3 w-3 bg-brand-green" aria-hidden="true" />
              You&apos;re on the list{info.email ? ` as ${info.email}` : ""}.
            </p>
            <button
              type="button"
              onClick={unsubscribe}
              disabled={pending}
              className="min-h-[44px] text-[17px] font-bold uppercase tracking-[0.08em] text-primary-0 underline underline-offset-4 disabled:opacity-60"
            >
              Unsubscribe
            </button>
          </div>
        ) : (
          <form onSubmit={subscribe} className="flex min-w-0 flex-[1_1_460px] flex-wrap items-end gap-3">
            <div className="flex min-w-0 flex-[1_1_160px] flex-col gap-1.5">
              <label htmlFor="newsletter-first-name" className="text-[16px] font-bold uppercase tracking-[0.1em] text-primary-0">
                First name
              </label>
              <input
                id="newsletter-first-name"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                className="h-[54px] border-2 border-primary-0 bg-background px-4 text-[20px] text-foreground placeholder:text-wds-text-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              />
            </div>
            <div className="flex min-w-0 flex-[2_1_240px] flex-col gap-1.5">
              <label htmlFor="newsletter-email" className="text-[16px] font-bold uppercase tracking-[0.1em] text-primary-0">
                Email
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="h-[54px] border-2 border-primary-0 bg-background px-4 text-[20px] text-foreground placeholder:text-wds-text-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="cut-corners-sm h-[54px] flex-[1_0_auto] bg-brand-indigo px-7 text-[20px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-indigo-deep disabled:opacity-60 sm:flex-none"
            >
              {pending ? "Sending…" : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
