import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

export const runtime = "nodejs"; // Specify the runtime for the API route
export const preferredRegion = "auto"; // Optional: Define the preferred region for deployment

async function readableToBuffer(reader: ReadableStreamDefaultReader) {
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const readable = req.body ? req.body.getReader() : null;
    const rawBody = readable ? await readableToBuffer(readable) : null;
  if (!sig || !endpointSecret) {
    return NextResponse.json(
      { error: "Missing webhook secret or signature" },
      { status: 400 }
    );
  }

  try {
    if (!rawBody) {
      throw new Error("Raw body is null");
    }
    const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);


    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("PaymentIntent succeeded:", event.data.object);
        break;
      case "payment_intent.payment_failed":
        console.log("PaymentIntent failed:", event.data.object);
        break;
      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
