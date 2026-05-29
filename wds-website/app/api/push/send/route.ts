import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { listSubscriptions, removeSubscription } from "@/lib/push-store";

// Broadcast a push notification to every subscriber.
//
// Protect with a shared secret so only you (or a Contentful publish webhook)
// can trigger it. Call with:
//   POST /api/push/send
//   Authorization: Bearer <PUSH_SEND_SECRET>
//   { "title": "New chapter!", "body": "Dawnshipper Ch. 21 is live", "url": "/novels/dawnshipper/chapters/..." }
export async function POST(req: NextRequest) {
  const secret = process.env.PUSH_SEND_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { error: "VAPID keys not configured" },
      { status: 500 }
    );
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hello@weredadstudios.com",
    publicKey,
    privateKey
  );

  const { title, body, url, icon } = await req.json();
  const payload = JSON.stringify({
    title: title || "We're Dad Studios",
    body: body || "A new chapter is live.",
    url: url || "/",
    icon,
    tag: "wds-chapter",
  });

  const subs = await listSubscriptions();
  let sent = 0;
  let pruned = 0;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload);
        sent += 1;
      } catch (err: unknown) {
        // 404/410 mean the subscription is dead — clean it up.
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          await removeSubscription(sub.endpoint);
          pruned += 1;
        } else {
          console.error("push send error", status, err);
        }
      }
    })
  );

  return NextResponse.json({ ok: true, sent, pruned, total: subs.length });
}
