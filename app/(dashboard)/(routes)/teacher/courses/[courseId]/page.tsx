import {auth} from "@clerk/nextjs";
import { IconBadge } from "@/components/icon-badge";
import {db} from "@/lib/db";
import { CircleDollarSign, LayoutDashboard, ListChecks, File } from "lucide-react";
import {redirect} from "next/navigation";
import { Actions } from "./_components/actions";
import { Banner } from "@/components/banner";
import { TitleForm } from "./_components/title-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { ChaptersForm } from "./_components/chapters-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId
        },
         include: {
            chapters:{
                orderBy:{
                    position:"asc",
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    if (!course) {
        return redirect("/");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished),
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

        const isComplete = requiredFields.every(Boolean);

        return(
<>
   {!course.isPublished && (
      <Banner
          label="This course is invisible to students because it is not published"
      />
   )}
   <div className="p-6">
       <div className="flex items-center justify-between mb-4">
           <div className="flex-col gap-y-2">
               <h1 className="text-2xl font-medium">
                   Course setup
               </h1>
               <span className="text-sm text-slate">
                   Complete all fields {completionText}
               </span>
           </div>
           <Actions
               disabled={!isComplete}
               courseId={params.courseId}
               isPublished={course.isPublished}
           />
       </div>
       <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
           <div>
               <div className="flex items-center mb-4">
                   <IconBadge size="sm" variant="warning" icon={LayoutDashboard}/>
                   <h2 className="text-xl">
                       Customize your course
                   </h2>
               </div>
               <TitleForm
                   initialData={course}
                   courseId={course.id}
               />
               <ImageForm
                   initialData={course}
                   courseId={course.id}
               />
               <CategoryForm
                   initialData={course}
                   courseId={course.id}
                   options={categories.map((category) => ({
                       label: category.name,
                       value: category.id,
                   }))}
               />
           </div>
           <div className="space-y-6">
               <div>
                   <div className="flex items-center mb-4">
                       <IconBadge icon={ListChecks}/>
                       <h2 className="text-xl">
                           Course chapters
                       </h2>
                   </div>
                   <ChaptersForm
                       initialData={course}
                       courseId={course.id}
                   />
               </div>
               <div>
                   <div className="flex items-center mb-4">
                       <IconBadge icon={CircleDollarSign}/>
                       <h2 className="text-sm">
                           Sell your course
                       </h2>
                   </div>
                   <PriceForm
                       initialData={course}
                       courseId={course.id}
                   />
               </div>
               <div>
                   <div className="flex items-center mb-4">
                       <IconBadge icon={File}/>
                       <h2 className="text-xl">
                           Resources & Attachments
                       </h2>
                   </div>
                   <AttachmentForm
                       initialData={course}
                       courseId={course.id}
                   />
               </div>
           </div>
       </div>
   </div>
</>
)};
