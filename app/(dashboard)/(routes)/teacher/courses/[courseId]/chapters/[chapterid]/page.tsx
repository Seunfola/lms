
import { redirect } from 'next/dist/server/api-utils'; // Import redirect from next/utils
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { ChapterTitleForm } from './_components/chapter-title-form';
import { ChapterDescriptionForm } from './_components/chapter-description-form';
import { ChapterAccessForm } from './_components/chapter-access-form';
import { ChapterVideoForm } from './_components/chapter-video-form';
import { Banner } from '@/components/banner';
import { ChapterActions } from './_components/chapters-actions';

const ChapterIdPage = async ({ params }: { params: { courseId: string; chapterId: string } }) => {

    const { userId } = auth(); 

    if (!userId) {
       return redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        },
        include: {
            muxData: true,
        },
    });

    if (!chapter) {
        return redirect('/');
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completedText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="This chapter is visible because it will not be published"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center mb-6 text-sm transition hover:opacity-75"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2"/>
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Chapter Creation
                                </h1>
                                <span className="text-sm text-slate-700">
                                    Completed all fields {completedText}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={isComplete}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <LayoutDashboard /> {/* Use LayoutDashboard component */}
                                <h2>
                                    Customize your chapter
                                </h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Eye /> {/* Use Eye component */}
                            <h2 className="text-xl">
                                Access Settings
                            </h2>
                        </div>
                        <ChapterAccessForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <Video /> {/* Use Video component */}
                            <h2 className="text-xl"> Add a video </h2>
                        </div>
                        <ChapterVideoForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChapterIdPage;