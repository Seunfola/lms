import { auth } from "@clerk/nextjs";
import { getChapter } from "@/actions/get-chapters";
import { Banner } from "@/components/banner";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";
import Link from "next/link";

const ChapterIdPage = async ({ params }: { params: { courseId: string; chapterId: string; } }) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter, course, muxData, attachments, nextChapter, userProgress, purchase,
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId,
    });

    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;
    const isPurchased = !!purchase;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner variant="success" label="You already completed this chapter." />
            )}
            {isLocked && (
                <Banner variant="success" label="You need to purchase this course to watch this chapter." />
            )}
            <div className="flex flex-col max-w-4xl pb-20 mx-auto">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={params.chapterId}
                        title={chapter.title}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                        isPurchased={isPurchased}
                    />
                </div>
                <div>
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <h2 className="mb-2 text-2xl font-semibold">
                            {chapter.title}
                        </h2>
                        {purchase ? (
                            <CourseProgressButton
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                                nextChapterId={nextChapter?.id}
                                isCompleted={!!userProgress?.isCompleted}
                            />
                        ) : (
                            <CourseEnrollButton
                                courseId={params.courseId}
                                price={course.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description!} />
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment) => (
                                    <Link
                                        href={attachment.url}
                                        target="_blank"
                                        key={attachment.id}
                                        className="flex items-center w-full p-3 border rounded-md bg-sky-200 text-sky-700 hover:underline"
                                    >
                                        <File className="mr-2" />
                                        <p className="line-clamp-1">{attachment.name}</p>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChapterIdPage;
