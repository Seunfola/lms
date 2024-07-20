import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course || course.userId !== userId) {
      return new NextResponse("Not found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        try {
          await mux.video.assets.delete(chapter.muxData.assetId);
          await db.muxData.delete({
            where: {
              id: chapter.muxData.id,
            },
          });
        } catch (error) {
          console.error("Error deleting Mux data:", error);
          return new NextResponse("Internal Server Error", { status: 500 });
        }
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);

  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course || course.userId !== userId) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.courseId,
        },
      });

      if (existingMuxData) {
        try {
          await mux.video.assets.delete(existingMuxData.assetId);
          await db.muxData.delete({
            where: {
              id: existingMuxData.id,
            },
          });
        } catch (error) {
          console.error("Error deleting Mux data:", error);
          return new NextResponse("Internal Server Error", { status: 500 });
        }
      }

      try {
        const asset = await mux.video.assets.create({
          input: [{ url: values.videoUrl }],
          playback_policy: ['public'],
        });

        await db.muxData.create({
          data: {
            chapterId: params.courseId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id,
          },
        });
      } catch (error) {
        console.error("Error creating Mux asset:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    }

    const updatedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatedCourse);

  } catch (error) {
    console.log("[COURSES_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
