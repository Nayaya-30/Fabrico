
// app/api/webhooks/flutterwave/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const secretHash = req.headers.get("verif-hash");
    const expected = process.env.FLUTTERWAVE_SECRET_HASH || "";
    const provided = secretHash || "";
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
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
