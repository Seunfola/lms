import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
      category: true,
    },
  });

  if (!course) {
    return redirect("/");
  }

  if (course.chapters.length > 0) {
    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
  }

  const coursePrice = course.price !== null ? course.price : 0;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full h-64">
          <Image
            src={course.imageUrl || "/default-course-image.jpg"}
            alt={course.title}
            layout="fill"
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-700 mb-4">{course.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {course.category?.name || "Uncategorized"}
            </span>
            <span className="text-gray-600">{course.chapters.length} Chapters</span>
          </div>
          <div className="text-lg font-semibold text-gray-800 mb-4">
            Price: {formatPrice(coursePrice)}
          </div>
          <Link href="/" legacyBehavior>
            <a className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition">
              Back to Courses
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;