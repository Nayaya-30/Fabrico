import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function safeCompareHex(expectedHex: string, providedHex: string): boolean {
  const expected = Buffer.from(expectedHex, "hex");
  const provided = Buffer.from(providedHex, "hex");

  if (expected.length === 0 || provided.length === 0 || expected.length !== provided.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, provided);
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY is not configured");
      return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
    }

    const payload = await req.text();
    const signature = req.headers.get("x-paystack-signature") ?? "";

    const digest = crypto.createHmac("sha512", secret).update(payload).digest("hex");
    if (!safeCompareHex(digest, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload) as { event?: string; data?: unknown };

    switch (event.event) {
      case "charge.success":
        console.log("Payment successful:", event.data);
        break;
      case "charge.failed":
        console.log("Payment failed:", event.data);
        break;
      default:
        console.log("Unhandled event:", event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
