import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { isTutor } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = () => {
    const { userId } = auth();
    const isAuthorized = isTutor(userId);

    if (!userId || !isAuthorized) {
        throw new Error("Unauthorized");
    }
    return { userId };
};

export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {
            console.log("Course image upload complete");
        }),
    
    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {
            console.log("Course attachment upload complete");
        }),
    
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {
            console.log("Chapter video upload complete");
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
