// app/api/auth/webhook/route.ts
// Clerk webhook to sync user data
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  // Handle different webhook events
  switch (eventType) {
    case "user.created":
      console.log("User created:", evt.data.id);
      // User will be created in Convex during onboarding
      break;

    case "user.updated":
      console.log("User updated:", evt.data.id);
      // Optionally sync updates to Convex
      break;

    case "user.deleted":
      console.log("User deleted:", evt.data.id);
      // Optionally handle user deletion in Convex
      break;

    default:
      console.log("Unhandled webhook event:", eventType);
  }

  return NextResponse.json({ received: true });
}
