'use client';
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname,useRouter  } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { LogOut } from "lucide-react";
import { SearchInput } from "./search-input";
import { isTutor } from "@/lib/teacher";



export const NavbarRoutes =()=>{

  const { userId } = useAuth();
  const pathname =usePathname();

const isTutorPage = pathname?.startsWith("/teacher");
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
        {isTutorPage || isCoursePage?(
          <Link href="/">
          <Button size="sm" variant="ghost">
<LogOut className="w-4 h-4 mr-2"/>
Exit
          </Button>
          </Link>
        ): isTutor (userId) ? (
         <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
         Tutor Mode
         </Button>
         </Link> 
        ) : null }
<UserButton afterSignOutUrl="/" />
      </div>  
      </>
    )
}