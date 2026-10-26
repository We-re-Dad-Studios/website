"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Check } from "lucide-react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

type State = "loading" | "unsupported" | "default" | "subscribed" | "denied";

export function PushOptIn() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (
      !VAPID_PUBLIC_KEY ||
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setState(sub ? "subscribed" : "default"))
      .catch(() => setState("default"));
  }, []);

  const subscribe = async () => {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "default");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setState("subscribed");
    } catch (err) {
      console.error("subscribe failed", err);
      setState("default");
    } finally {
      setBusy(false);
    }
  };

  const unsubscribe = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("default");
    } catch (err) {
      console.error("unsubscribe failed", err);
    } finally {
      setBusy(false);
    }
  };

  // Hide entirely when push can't work — no dead UI.
  if (state === "loading" || state === "unsupported") return null;

  return (
    <div className="flex flex-col gap-4 border border-border border-t-4 border-t-primary-0 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-indigo text-white">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[20px] font-bold leading-tight text-foreground">New chapter alerts</div>
          <p className="m-0 text-[17px] text-wds-text-secondary">
            {state === "subscribed"
              ? "You'll get a notification when a new chapter drops."
              : state === "denied"
              ? "Notifications are blocked in your browser settings."
              : "Get notified the moment a new chapter goes live."}
          </p>
        </div>
      </div>

      {state === "subscribed" ? (
        <button
          onClick={unsubscribe}
          disabled={busy}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 border-2 border-primary-0 px-4 text-[16px] font-bold uppercase tracking-[0.08em] text-primary-0 transition-colors hover:bg-foreground/5 disabled:opacity-50"
        >
          <BellOff className="h-4 w-4" /> Turn off
        </button>
      ) : state === "denied" ? (
        <span className="inline-flex items-center gap-1.5 text-[16px] font-bold uppercase tracking-[0.08em] text-wds-text-secondary">
          <BellOff className="h-4 w-4" /> Blocked
        </span>
      ) : (
        <button
          onClick={subscribe}
          disabled={busy}
          className="cut-corners-sm inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 bg-brand-indigo px-5 text-[17px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-indigo-deep disabled:opacity-50"
        >
          {busy ? "Enabling…" : <><Check className="h-4 w-4" /> Enable alerts</>}
        </button>
      )}
    </div>
  );
}
