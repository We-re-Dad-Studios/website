import { Resend } from "resend";

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email: string };
  if (!email) {
    return new Response(JSON.stringify({ error: "Invalid email" }), {
      status: 400});
  }
  const resend = new Resend("re_eSSgwyaw_L9wFX7xBFYWMW3UuV68JLjJ2");

  try {
    const { error } = await resend.contacts.remove({
      email: "acme@example.com",
      audienceId: "c35d7a1d-2e23-4346-b060-3902a38feeb0",
    });
    if (error) {
       return new Response(JSON.stringify({ error: "error unsubscribing" }), {
      status: 400});
    }
     return new Response(JSON.stringify({message:"unsubscribed successfully!"}), {
      status: 200});
  } catch  {
   return new Response(JSON.stringify({ error: "error unsubscribing" }), {
      status: 400});
  }
}
