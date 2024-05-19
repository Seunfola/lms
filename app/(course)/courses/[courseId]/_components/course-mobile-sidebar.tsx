import { Menu } from "lucide-react";
import { Chapter, Course, userProgress} from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import  CourseSidebar  from "./course-sidebar";

interface CourseNavbarProps{
    course: Course & {
        chapters:(Chapter &{
            userProgress: userProgress [] | null;
        })[];
    };
    progressCount: number;
}

export const CourseMobileSidebar = ({course, progressCount,}: CourseNavbarProps) =>{
    return(
        <Sheet>
            <SheetTrigger className="pr-4 transition md:hidden hover-opacity-75">
                <Menu/>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white w-72">
                <CourseSidebar course={course} progressCount={progressCount}/>
            </SheetContent>
                
        </Sheet>
    )
}
