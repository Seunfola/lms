"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ActionsProps{
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}
export const Actions = ({disabled, courseId, isPublished}: ActionsProps) =>{
const router = useRouter();
const confetti = useConfettiStore();
const [isLoading, setIsLoading] = useState(false);

const onClick = async () => {
  try {
    setIsLoading(true);
    
    if (isPublished) {
      await axios.delete(`/api/courses/${courseId}/unpublish`);
      toast.success("Course unpublished");
      
    } else {
      await axios.patch(`/api/courses/${courseId}/publish`);
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
    
    await axios.delete(`/api/courses/${courseId}`);
    toast.success("Course deleted successfully");
    router.push(`/teacher/course/`);
    
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