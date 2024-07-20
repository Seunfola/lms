import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      console.error('User ID not found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      console.error('URL not provided in the request body');
      return new NextResponse('Bad Request', { status: 400 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      console.error('Course not found or user is not the owner');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error: any) {
    console.error('COURSE_ID_ATTACHMENTS', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
