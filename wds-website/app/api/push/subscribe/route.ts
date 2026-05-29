import { NextRequest, NextResponse } from "next/server";
import {
  saveSubscription,
  removeSubscription,
  type PushSubscriptionJSON,
} from "@/lib/push-store";

// Register a browser push subscription.
export async function POST(req: NextRequest) {
  try {
    const sub = (await req.json()) as PushSubscriptionJSON;
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    await saveSubscription(sub);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("push subscribe failed", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

// Unsubscribe.
export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }
    await removeSubscription(endpoint);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("push unsubscribe failed", err);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
