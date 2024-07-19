import { NextApiRequest, NextApiResponse } from 'next';
import paystack from '@/lib/paystack';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { reference } = req.body;

    const verification = await paystack.get(`/transaction/verify/${reference}`);

    if (verification.data.data.status === 'success') {
      const userId = verification.data.data.metadata.userId;
      const courseId = verification.data.data.metadata.courseId;

      // Update your database accordingly
      await db.purchase.create({
        data: {
          userId,
          courseId,
        },
      });

      res.status(200).json({ message: "Payment verified successfully and purchase recorded" });
    } else {
      res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
