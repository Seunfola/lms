import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { Chapter } from "@prisma/client";



export async function PATCH( req: Request, {params}:{params:{ courseId: string; chapterId: string;}}){
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401});
        }
        const course = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId
            }
        });

        if (!course){
            return new NextResponse("Unauthorized", { status: 401});
        }

        const unpublishedCourse = await db.course.update({
            where:{
                id: params.courseId,
                userId,
            },
            data:{
                isPublished: false,
            },
        });

// const publishedChaptersInCourse = await db.chapter.findMany({
    // where:{
        // courseId: params.courseId,
        // isPublished: true,
    // }
// });
// 
// if (!publishedChaptersInCourse.length){
    // await db.course.update({
        // where: {
            // id: params.courseId
        // },
        // data:{
            // isPublished: false,
        // }
    // });
// }
        return NextResponse.json(unpublishedCourse);

    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]", error);
        return new NextResponse( "Internal Error", { status: 500 });
    }
};