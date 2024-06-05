'use client'
import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
    initialData: Course;
    courseId: string;
    updateImageUrl: (imageUrl: string) => void; // Function to update image URL in parent
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
});

export const ImageForm = ({
    initialData,
    courseId,
    updateImageUrl
}: ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, values);
            const updatedImageUrl = response.data.imageUrl; // Assuming the response contains the updated image URL
            toast.success("Course updated successfully");
            toggleEdit();
            router.refresh();
            updateImageUrl(updatedImageUrl); // Call updateImageUrl with updated image URL
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="p-4 mt-6 border bg-slate-100 md-rounded">
            <div className="flex items-center justify-between font-medium">
                Course image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? <>Cancel</> : (
                        !initialData.imageUrl ? (
                            <>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add an image
                            </>
                        ) : (
                            <>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit image
                            </>
                        )
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
                        <ImageIcon className="w-10 h-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative mt-2 aspect-video">
                        <Image
                            alt="upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
                            }
                        }}
                    />
                    <div className="mt-4 text-xs text-muted-foreground">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    );
};
