import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email: string };
  if (!email) {
    return NextResponse.redirect("/?unsubscribe=invalid_email");
  }
  const resend = new Resend("re_eSSgwyaw_L9wFX7xBFYWMW3UuV68JLjJ2");

  try {
    const { error } = await resend.contacts.remove({
      email: "acme@example.com",
      audienceId: "c35d7a1d-2e23-4346-b060-3902a38feeb0",
    });
    if (error) {
      return NextResponse.redirect("/?unsubscribe=failed");
    }
    return NextResponse.redirect("/?unsubscribe=success");
  } catch (error) {
    return NextResponse.redirect("/?unsubscribe=failed");
  }
}
