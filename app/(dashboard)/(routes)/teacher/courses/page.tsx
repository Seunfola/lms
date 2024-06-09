import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db"
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { redirect } from "next/navigation";


async function getData(): Promise<any[]> {

  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    
  ]
}

const CoursePage = async () => {
    
   const { userId } = auth();
    
   if(!userId){
    return redirect("/");
   }

   const courses = await db.course.findMany({
    where:{
        userId,
    },
    orderBy:{
        createdAt:"desc",
    },
   })
    return (
    
    <div className="p-6">
        <DataTable columns={columns} data={courses}/>
    </div>  
    );
}
 
export default CoursePage;