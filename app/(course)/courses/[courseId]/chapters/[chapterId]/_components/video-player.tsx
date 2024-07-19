"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Banner } from "@/components/banner";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  isPurchased: boolean; 
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  isPurchased,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });
      }
    } catch {
      toast.error("Something went wrong");
    }

    if (!nextChapterId) {
      confetti.onOpen();
    }

    toast.success("Progress updated");
    router.refresh();

    if (nextChapterId) {
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <>
          <Banner
            variant="warning"
            label="You need to purchase this course to watch this chapter."
          />
          <Loader2 className="absolute inset-0 w-8 h-8 animate-spin text-secondary" />
        </>
      )}
      {isLocked && !isPurchased && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-gray-800 bg-opacity-75 text-secondary">
          <Lock className="w-8 h-8" />
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
        />
      )}
    </div>
  );
};
