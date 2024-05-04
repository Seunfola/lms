import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { MuxData } from "@prisma/client";

export async function PATCH( req: Request, 
    {params}:{params:{ courseId: string; chapterId: string;}}){
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401});
        }
        const course = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId,
            },
            include:{
                chapters:{
                    include:{
                        muxData: true,  
                    }
                }
            }
        });

        if (!course){
            return new NextResponse("Unauthorized", { status: 401});
        }

        // const chapter = await db.chapter.findUnique({
            // where:{
                // id: params.chapterId,
                // courseId: params.courseId,
            // }
        // });

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);
        // const muxData = await db.muxData.findUnique({
        //    where:{
            // chapterId: params.chapterId,
        //    } 
        // })

        if ( !course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter ){
            return new NextResponse("Missing required fields", { status: 400});
        }

        const publishedCourse = await db.course.update({
            where:{
                id: params.courseId,
                userId,
            },
            data:{
                isPublished: true,
            }
        });
        return NextResponse.json(publishedCourse);

    } catch (error) {
        console.log("[COURSE_PUBLISH]", error);
        return new NextResponse( "Internal Error", { status: 500 });
    }
}