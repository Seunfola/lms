import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

<<<<<<< HEAD

const {Video} = new Mux({
  tokenId: process.env.MUX_TOKEN_ID, 
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

export async function DELETE(req: Request, 
    {params}:{params:{courseId: string; chapterId: string}}){
    try{
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        const ownCourse = await db.course.findUnique({
                where:{
                    id: params.courseId,
                    userId,
                }
            });

        if(!ownCourse){
            return new NextResponse("Unauthorized", {status: 401});
        }

        const chapter = await db.chapter.findUnique({
    where: {
        id: params.chapterId,
        courseId: params.courseId,
    },
=======
const video = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!
>>>>>>> 902ad522952235df458c147cc299c63ceb29a6f0
});

export async function DELETE(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = auth();

<<<<<<< HEAD
if (chapter.videoUrl) {
    const existingMuxData = await db.muxData.findFirst({
        where: {
            chapterId: params.chapterId,
        },
    });

    if (existingMuxData) {
        try {
            await Video.assets.del(existingMuxData.assetId);
            await db.muxData.delete({
                where: {
                    id: existingMuxData.id,
                },
            });
        } catch (error) {
            console.error("Error deleting mux data:", error);
            return new NextResponse("Internal Server Error", { status: 404 });
        }
    }
}
        const deletedChapter = await db.chapter.delete({
            where:{
                id: params.chapterId,
            }
        });

  const publishedChaptersInCourse = await db.chapter.findMany({
        where: {
            courseId: params.courseId,
            isPublished: true,
        },
    });

    if(!publishedChaptersInCourse.length){
await db.course.update({
    where:{
        id: params.courseId,
    },
    data:{
        isPublished: false,
    }
})
    }
 return NextResponse.json(deletedChapter)
    }catch(error){
        console.log("[CHAPTER_ID_DELETE]", error)
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function PATCH (req:Request, {params}:{params:{courseId: string; chapterId: string}}){
    try {
        
const {userId} = auth();
const {isPublished, ...values} = await req.json();

if(!userId){
    return new NextResponse("Unauthorized", {status: 401});
}
const ownCourse = await db.course.findUnique({
    where:{
=======
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
>>>>>>> 902ad522952235df458c147cc299c63ceb29a6f0
        id: params.courseId,
        userId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      }
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId
        }
      });

      if (existingMuxData) {
        try {
          await video.Assets.del(existingMuxData.assetId); // Changed from Video.Assets.del
          await db.muxData.delete({
            where: {
              id: existingMuxData.id
            }
          });
        } catch (error) {
          console.error("Error deleting mux data:", error);
          return new NextResponse("Internal Server Error", { status: 404 });
        }
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId
      }
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true
      }
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId
        },
        data: {
          isPublished: false
        }
      });
    }
    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
<<<<<<< HEAD
return NextResponse.json(chapter);

    } catch (error) {
        console.log("[COURSE_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", {status:500});
=======

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
>>>>>>> 902ad522952235df458c147cc299c63ceb29a6f0
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      },
      data: {
        ...values
      }
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId
        }
      });

      if (existingMuxData) {
        await video.Assets.del(existingMuxData.assetId); // Changed from Video.Assets.del
        await db.muxData.delete({
          where: {
            id: existingMuxData.id
          }
        });
      }
      const asset = await video.Assets.create({ // Changed from Video.Assets.create
        input: values.videoUrl, // Changed from Input
        playback_policy: "public",
        test: false
      });
      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id
        }
      });
    }
    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSE_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}