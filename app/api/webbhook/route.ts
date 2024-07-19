import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Paystack from '@paystack/paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json('Missing sessionId', { status: 400 });
    }

    // Retrieve the session from paystack
    const session = await paystack.transaction.verify(sessionId);

    if (!session) {
      return NextResponse.json('Invalid sessionId', { status: 400 });
    }

    // Extract necessary metadata
    const userId = session.data.metadata?.userId;
    const courseId = session.data.metadata?.courseId;

    if (!userId || !courseId) {
      return NextResponse.json('Missing metadata', { status: 400 });
    }

    // Ensure the payment is completed
    if (session.data.status === 'success') {
      // Update the database
      await db.purchase.create({
        data: {
          courseId: courseId,
          userId: userId,
        },
      });

      return NextResponse.json('Payment confirmed and purchase recorded', { status: 200 });
    } else {
      return NextResponse.json('Payment not completed', { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
