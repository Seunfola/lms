"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ActionsProps{
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}
export const Actions = ({disabled, courseId, isPublished}: ActionsProps) =>{
const router = useRouter()
const [isLoading, setIsLoading] = useState(false);
const onClick = async () => {
  try {
    setIsLoading(true);
    
    if (isPublished) {
      await axios.delete(`/api/course/${courseId}/unpublish`);
      toast.success("Course unpublished");
    } else {
      await axios.patch(`/api/courses/${courseId}/publish`);
      toast.success("Course published");
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
    
    await axios.delete(`/api/course/${courseId}`);
    toast.success("Course deleted successfully");
    router.refresh();
    router.push(`/teacher/course/`);
    router.refresh();
    
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

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
                    <Trash className="w-4 h-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
};