'use client'
import {Menu} from "lucide-react";
import SideBar from "./Sidebar"
import { Sheet, SheetContent, SheetTrigger} from"@/components/ui/sheet"

export const MobileSidebar = () =>{
    return(
        <Sheet>
<SheetTrigger className="pr-4 transition md:hidden hover:opacity-75">
        <Menu/>
</SheetTrigger>
<SheetContent side="left" className="p-0 bg-white">
<SideBar/>
</SheetContent>
         </Sheet>
    )
};