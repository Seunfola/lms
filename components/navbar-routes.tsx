'use client';
import { UserButton } from "@clerk/nextjs";
import { usePathname,useRouter  } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { LogOut } from "lucide-react";
import { SearchInput } from "./search-input";



export const NavbarRoutes =()=>{
  const pathname =usePathname();

const isTeacherPage = pathname?.startsWith("/teacher");
const isCoursePage = pathname?.includes("/courses");
const isSearchPage = pathname === "/search";

    return(
    <>
    {isSearchPage && (
      <div className="hidden md:block">
          <SearchInput/>
       </div> 
    )}
      <div className="flex ml-auto gap-x-2">
        {isTeacherPage || isCoursePage?(
          <Link href="/">
          <Button size="sm" variant="ghost">
<LogOut className="w-4 h-4 mr-2"/>
Exit
          </Button>
          </Link>
        ):(
         <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
         Teacher Mode
         </Button>
         </Link> 
        )}
<UserButton afterSignOutUrl="/" />
      </div>  
      </>
    )
}