import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    return res.status(400).send("Missing webhook secret or signature");
  }

  try {
    const rawBody = await getRawBody(req);
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

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    res.status(400).send("Webhook Error");
  }
}
