// lib/push-store.ts
// Persists Web Push subscriptions in Netlify Blobs (no DB required).
// Each subscription is one blob keyed by a hash of its endpoint.

import { getStore } from "@netlify/blobs";
import { createHash } from "crypto";

export interface PushSubscriptionJSON {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

const STORE_NAME = "push-subscriptions";

const keyFor = (endpoint: string) =>
  createHash("sha256").update(endpoint).digest("hex");

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export async function saveSubscription(sub: PushSubscriptionJSON) {
  await store().setJSON(keyFor(sub.endpoint), sub);
}

export async function removeSubscription(endpoint: string) {
  await store().delete(keyFor(endpoint));
}

export async function listSubscriptions(): Promise<PushSubscriptionJSON[]> {
  const s = store();
  const { blobs } = await s.list();
  const subs = await Promise.all(
    blobs.map((b) => s.get(b.key, { type: "json" }) as Promise<PushSubscriptionJSON | null>)
  );
  return subs.filter((x): x is PushSubscriptionJSON => Boolean(x));
}
