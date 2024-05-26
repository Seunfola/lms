import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTutor } from "@/lib/teacher";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId || !isTutor(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await db.course.create({ 
            data:{
                userId,
                title,
                position: 0
            },
            
        });
        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
