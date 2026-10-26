import WelcomeEmail from "@/components/EmailTemplate";
import { Resend } from "resend";
export  async function POST(req:Request) {
 
  const { email, firstName, lastName = "" } = await req.json() as {
    email: string;
    firstName: string;
    lastName?: string;
  };
  // console.log({email, firstName, lastName});
  if (!email) {
    return new Response(JSON.stringify({ error: "Invalid email" }), {
      status: 400,
    });
  }

  // Last name is optional — the signup form only asks for a first name.
  if (!firstName) {
    return new Response(
      JSON.stringify({ error: "First name is required" }),
      { status: 400 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);

  try {
    // Await so a failed audience add surfaces as an error instead of being lost.
    const contact = await resend.contacts.create({
      email,
      firstName,
      ...(lastName ? { lastName } : {}),
      unsubscribed: false,
      audienceId: "c35d7a1d-2e23-4346-b060-3902a38feeb0",
    });
    if (contact.error) {
      return new Response(
        JSON.stringify({ error: "Failed to add contact", message: contact.error.message }),
        { status: 502 }
      );
    }
    const { data, error } = await resend.emails.send({
      from: "Newsletter <newsletter@weredadstudios.com>",
      to: email,
      subject: "Welcome to the Newsletter!",
      react: WelcomeEmail({ subscriberName: firstName }),
    });
    if (error) {
        // console.log({error});
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          message: error.message,
        }),
        { status: 404 }
      );
    }
    if (data) {
      return new Response(
        JSON.stringify({ message: "Email sent successfully" }),
        { status: 200 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        message: (error as { message: string }).message,
      }),
      { status: 500 }
    );
  }
}


