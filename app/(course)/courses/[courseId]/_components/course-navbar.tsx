import { NavbarRoutes } from "@/components/navbar-routes";
import { Chapter, Course, userProgress } from "@prisma/client"
import { CourseMobileSidebar } from "./course-mobile-sidebar";


interface CourseNavbarProps{
    course: Course & {
        chapters:(Chapter &{
            userProgress: userProgress [] | null;
        })[];
    };
    progressCount: number;
}


export const CourseNavbar = ({course, progressCount,}: CourseNavbarProps) =>{
    return(
        <div className="flex items-center h-full p-4 bg-white border-b shadow-sm">
            <CourseMobileSidebar
            course={course}
            progressCount={progressCount}
            />
            <NavbarRoutes/>
        </div>
    )
}