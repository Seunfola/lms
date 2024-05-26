'use client';
import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import {Chapter, MuxData} from "@prisma/client";
import {Button }from "@/components/ui/button";
import { Pencil, PlusCircle, ImageIcon, Video} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {FileUpload} from "@/components/file-upload";



interface ChapterVideoFormProps{
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}
const formSchema = z.object({
    videoUrl: z.string().min(1),
});

export const ChapterVideoForm =({
    initialData,
    courseId,
    chapterId,
}:ChapterVideoFormProps) =>{


const [isEditing, setIsEditing] = useState(false);

const toggleEdit = () => setIsEditing((current) => !current);

const router = useRouter();

const onSubmit = async (values: z.infer<typeof formSchema>) =>{
    
        console.log({values});
    try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
        toast.success("Chapter updated successfully");
        toggleEdit();
        router.refresh(); 
        }catch {
       toast.error("something went wrong");
    }
   }

    return( 
    
    <div className="p-4 mt-6 border bg-slate-100 md-rounded">
<div className="flex items-center justify-between font-medium">
    Course Video
 <Button onClick={toggleEdit} variant="ghost">
    {isEditing && (
        <>Cancel</>
    )}
    {!isEditing && !initialData.videoUrl && (
        <>
            <PlusCircle className="w-4 h-4 mr-2"/> 
            Add a video
        </>
    )}
    {!isEditing && initialData.videoUrl && (
        <>
        <Pencil className="w-4 h-4 mr-2" />
            Edit video
        </>
    )}
</Button>

</div>
{!isEditing && (
  !initialData.videoUrl?(
    <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
        <Video
        className="w-10 h-10 text-slate-500"
        />
    </div>
  ):(
  <div className="relative mt-2 aspect-video">
    <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""}/>
    </div>  
  )
)}    
{isEditing&& (
<div>
    <FileUpload 
    endpoint="chapterVideo"
    onChange={(url)=>{
        if(url){
            onSubmit({videoUrl: url});
        }
    }}
    />
<div className="mt-4 text-xs text-muted-foreground">
Upload this chapter&apos;s video
    </div>
    </div>
)}
   {
    initialData.videoUrl && !isEditing && (
        <div className="mt-2 text-xs text-muted-foreground">
            Videos can take a few minutes. Kindly refresh if it does not show.
        </div>
    )
   } 
</div>
    )};