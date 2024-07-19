import { NextApiRequest, NextApiResponse } from 'next';
import paystack from '@/lib/paystack';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, amount, userId, courseId } = req.body;

    // Create a new Paystack customer if not exists
    let customer = await db.paystackCustomer.findUnique({ where: { userId } });

    if (!customer) {
      const response = await paystack.post('/customer', {
        email,
        metadata: { userId }
      });

      customer = await db.paystackCustomer.create({
        data: {
          userId,
          paystackCustomerId: response.data.data.customer_code,
        },
      });
    }

    // Initialize the payment
    const payment = await paystack.post('/transaction/initialize', {
      amount: amount * 100, // Paystack accepts amount in kobo
      email,
      metadata: { userId, courseId }
    });

    res.status(200).json({ authorization_url: payment.data.data.authorization_url });
  } catch (error) {
    console.error("Error initializing payment:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}