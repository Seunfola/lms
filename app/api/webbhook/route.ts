import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { sessionId } = await req.json();

    if (!sessionId) {
      return new NextResponse('Missing sessionId', { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return new NextResponse('Invalid sessionId', { status: 400 });
    }

    // Extract necessary metadata
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      return new NextResponse('Missing metadata', { status: 400 });
    }

    // Ensure the payment is completed
    if (session.payment_status === 'paid') {
      // Update the database
      await db.purchase.create({
        data: {
          courseId: courseId,
          userId: userId,
        },
      });

      return new NextResponse('Payment confirmed and purchase recorded', { status: 200 });
    } else {
      return new NextResponse('Payment not completed', { status: 400 });
    }
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
