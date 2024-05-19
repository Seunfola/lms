"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ChapterActionsProps{
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}
export const ChapterActions = ({disabled, courseId, chapterId, isPublished}: ChapterActionsProps) =>{
const router = useRouter();
const confetti = useConfettiStore();
const [isLoading, setIsLoading] = useState(false);

const onClick = async () => {
  try {
    setIsLoading(true);
    
    if (isPublished) {
      await axios.delete(`/api/course/${courseId}/chapters/${chapterId}/unpublish`);
      toast.success("Course unpublished");
    } else {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
      toast.success("Course published");
      confetti.onOpen();
    }
    router.refresh();
    
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

const onDelete = async () => {
  try {
    setIsLoading(true);
    
    await axios.delete(`/api/course/${courseId}/chapters/${chapterId}`);
    toast.success("Course deleted successfully");
    router.refresh();
    router.push(`/teacher/course/${courseId}`);
    router.refresh();
    
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

    return(
        <div className="flex onClickcenter gap-x-2">
            <Button onClick={onClick}
            disabled={disabled || isLoading }
            variant="outline"
            size="sm"
            >
                {isPublished ? "Not Published" : "Published"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="w-4 h-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
};