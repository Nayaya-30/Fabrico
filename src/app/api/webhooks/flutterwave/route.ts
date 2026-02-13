import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function safeCompare(expected: string, provided: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(provided, "utf8");
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  try {
    const expectedHash = process.env.FLUTTERWAVE_SECRET_HASH;
    if (!expectedHash) {
      console.error("FLUTTERWAVE_SECRET_HASH is not configured");
      return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
    }

    const providedHash = req.headers.get("verif-hash") ?? "";
    if (!safeCompare(expectedHash, providedHash)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = (await req.json()) as {
      event?: string;
      data?: { status?: string } & Record<string, unknown>;
    };

    if (event.event === "charge.completed" && event.data?.status === "successful") {
      console.log("Flutterwave payment successful:", event.data);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
