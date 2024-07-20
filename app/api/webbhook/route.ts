import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import paystack from '@/lib/paystack';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json('Missing sessionId', { status: 400 });
    }

    const response = await paystack.get(`/transaction/verify/${sessionId}`);

    const session = response.data;

    if (!session) {
      return NextResponse.json('Invalid sessionId', { status: 400 });
    }

    const userId = session.data.metadata?.userId;
    const courseId = session.data.metadata?.courseId;

    if (!userId || !courseId) {
      return NextResponse.json('Missing metadata', { status: 400 });
    }

    if (session.data.status === 'success') {
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
