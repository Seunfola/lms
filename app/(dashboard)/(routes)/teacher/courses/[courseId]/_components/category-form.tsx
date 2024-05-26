'use client'
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Pencil } from "lucide-react";
import {Course} from "@prisma/client";
import {
    Form, FormControl, FormField, FormItem, FormMessage
} from "@/components/ui/form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string; value: string; }[];
}

const formSchema = z.object({
    categoryId: z.string().min(1),
});

export const CategoryForm = ({
    initialData,
    courseId,
    options,
}: CategoryFormProps) => {
    
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || "",
        },
    });
console.log({options});

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated successfully");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const selectedOption = options.find(
        (option) => option.value === initialData.categoryId
    );

    return (
        <div className="p-4 mt-6 border rounded bg-slate-100-md">
            <div className="flex items-center justify-between font-medium">
                Course category
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>
                    {selectedOption?.label || "No category"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y">
        <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Combobox options={options} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex items-center gap-x-2">
            <Button disabled={!isValid || isSubmitting} type="submit">
                Save
            </Button>
        </div>
    </form>
</Form>

            )}
        </div>
    );
};
