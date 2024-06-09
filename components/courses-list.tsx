import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string}[];
    progress: number | null;
};

interface CoursesListProps{
    items: CourseWithProgressWithCategory[]
}


export const CoursesList = ({
items
}: CoursesListProps) =>{
    return(
        <div>
            <div className="grid gap-4 sm:-col-2 md:grid-col-2 lg:grid-col-3 xl:grid-col-4 2xl:grid-cols-4">
                {items.map((item) => (
                    <CourseCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    imageUrl={item.imageUrl || ""}
                    chaptersLength={item.chapters.length}
                    price={item.price || 0}
                    progress={item.progress}
                    category={item.category?.name || "uncategorized"}
                    />
                ))}
            </div>
            {items.length ===0 &&(
                <div className="mt-10 text-sm text-center text-muted-foreground">
                    No course found
                </div>
            )}
        </div>
    )
}