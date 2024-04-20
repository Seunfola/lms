"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface ChapterActionsProps{
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}
export const ChapterActions = ({disabled, courseId, chapterId, isPublished}: ChapterActionsProps) =>{
const router = useRouter()
const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () =>{
try {
    setIsLoading(true);

    await axios.delete(`api/course/${courseId}/chapters/${chapterId}`);
    toast.success("chapter deleted successfully");
    router.refresh();
    router.push(`/teacher/course/${courseId}`)
} catch (error) {
    toast.error("something went wrong");
} finally{
    setIsLoading(false);
}
    }
    return(
        <div className="flex items-center gap-x-2">
            <Button onClick={()=>{}}
            disabled={disabled || isLoading }
            variant="outline"
            size="sm"
            >
                {isPublished ? "Not Published" : "Published"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}