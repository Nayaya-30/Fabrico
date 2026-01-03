
// app/api/webhooks/flutterwave/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const secretHash = req.headers.get("verif-hash");

    if (!secretHash || secretHash !== process.env.FLUTTERWAVE_SECRET_HASH) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = await req.json();

    // Handle different event types
    if (event.event === "charge.completed" && event.data.status === "successful") {
      console.log("Flutterwave payment successful:", event.data);
      // Update payment status in Convex
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}