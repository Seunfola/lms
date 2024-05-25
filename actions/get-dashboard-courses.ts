import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";


type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null;
}

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    courseInProgress: CourseWithProgressWithCategory[];
}

export const getDashboardCourses = async(userId: string): Promise<DashboardCourses> =>{
    try {
    
        const purchasedCourses = await db.purchase.findMany({
            where:{
                userId: userId,
            },
            select:{
                course:{
                    include:{
                        category: true,
                        chapters:{
                            where:{
                                isPublished: true,
                            }
                        }
                    }
                }
            }
        });


        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];


        for ( let course of courses ){
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter((courses) => courses.progress === 100);

                const courseInProgress = courses.filter((courses) => 
(courses.progress ?? 0) < 100);

                return{
                    completedCourses, courseInProgress
                }


} catch (error) {
    console.log("GET_DASHBOARD_COURSES", error);
    return{
        completedCourses: [],
        courseInProgress: [],
    }
}
}