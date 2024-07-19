import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import paystack from '@/lib/paystack';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = req.body;
    const hash = req.headers['x-paystack-signature'] as string;

    // Verify the event came from Paystack
    const secret = process.env.PAYSTACK_SECRET_KEY as string;
    const expectedHash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex');

    if (hash !== expectedHash) {
      return res.status(401).send('Unauthorized');
    }

    const event = payload.event;
    const session = payload.data;

    // Handle the event
    if (event === 'charge.success') {
      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;

      if (!userId || !courseId) {
        return res.status(400).send('Missing metadata');
      }

      // Ensure the payment is completed
      if (session.status === 'success') {
        // Update the database
        await db.purchase.create({
          data: {
            courseId: courseId,
            userId: userId,
          },
        });

        return res.status(200).send('Payment confirmed and purchase recorded');
      } else {
        return res.status(400).send('Payment not completed');
      }
    }

    res.status(200).json({ message: 'Event handled' });
  } catch (error) {
    handleApiError(error, res, "Error handling webhook");
  }
}

function handleApiError(error: unknown, res: NextApiResponse, defaultMessage: string) {
  if (error instanceof Error) {
    console.error(defaultMessage, error.message);
    res.status(500).json({ error: `Error: ${error.message}` });
  } else {
    console.error(defaultMessage, "Unknown error");
    res.status(500).json({ error: "Internal Server Error" });
  }
}
