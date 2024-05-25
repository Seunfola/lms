"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react/.";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";


interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
};

export const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completeOnEnd,
    title,
}: VideoPlayerProps) =>{
    const [isReady, setIsReady] =useState(false);

    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnd = async () =>{
        try{
          if(completeOnEnd){
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: true,
            });
          }  
}catch{
    toast.error("Something went wrong")
    
}

    if(!nextChapterId){
        confetti.onOpen();
    }
    
    toast.success("progress updated");
    router.refresh();

    if (nextChapterId){
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
    }
    }

    return(
        <div className="relative aspect-video">

           {!isReady && !isLocked &&(
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <Loader2 className="w-8 h-8 animate-spin text-secondary"/>
            </div>

           )}
           {
            isLocked &&(
                <div className="absolute flex flex-col items-center justify-center insect-0 bg-slate-800 gap-y-2 text-secondary">
                    <Lock className="w-8 h-8"/>
                    <p className="text-sm"> This Chapter is Locked</p>
                </div>
            )}
            {
                !isLocked &&(
                    <MuxPlayer
                    title={title}
                    playbackId={playbackId}
                    className={cn( !isReady && "hidden")}
                    onCanPlay={()=> setIsReady(true)}
                    onEnded={onEnd}
                    autoPlay
                    />
                )
            }
        </div>
    )
}