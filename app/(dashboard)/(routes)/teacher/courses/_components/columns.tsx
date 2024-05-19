"use client";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table";
import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) =>{
        return(
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Title
                 <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
        )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) =>{
     return(
         <Button variant="ghost" onClick={() => 
column.toggleSorting(column.getIsSorted() === "asc")}>
             Price
              <ArrowUpDown className="w-4 h-4 ml-2" />
         </Button>
     )
 },
 cell: ({row}) =>{
    const price = parseFloat(row.getValue("price") || "0");
    const formatted = new Intl.NumberFormat("en-NG",{
        style: "currency",
        currency: "NGN"
    }).format(price);

    return <div>{formatted}</div>
 }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) =>{
     return(
         <Button variant="ghost" onClick={() => 
column.toggleSorting(column.getIsSorted() === "asc")}>
             Published
              <ArrowUpDown className="w-4 h-4 ml-2" />
         </Button>
     )
 },
 cell:({row}) =>{
   const isPublished = row.getValue("isPublished") || false;
   return(
    <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
        {isPublished ? "Published" : "Draft"}
    </Badge>
   )
}
  },
  {
    id: "actions",
    cell: ({ row})=>{
        const { id } = row.original;
        
        return(
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost" className="w-8 h-4 p-0">
                        <span className="sr-only">
                            Open menu
                        </span>
                        <MoreHorizontal className="w-4 h-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={`/teacher/courses/${id}`}>
                        <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2"/>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  }
]
