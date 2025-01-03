import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "POST") {
    try {
        const {amount} = await req.body

      if (!amount || typeof amount !== "number") {
        return res.status(400).json({ message: "Amount is required and must be a number." });
      }

        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "usd",
          automatic_payment_methods: {enabled: true},
        });
        return res.json({ clientSecret: paymentIntent.client_secret });
   
    } catch (err) {
      console.error(err);
    return res.status(500).json({ message: "Internal server error" });
    }
} else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}