"use client";
import { useState, useEffect } from "react";
import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter, usePathname} from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () =>{

    const [value, setValue] = useState("");
    const debounceValue = useDebounce (value);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const currentCategoryId = searchParams.get("categoryId");

useEffect(() => {
    const url = qs.stringifyUrl({
        url: pathname,
        query: {
            categoryId: currentCategoryId,
            title: debounceValue,
        }
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);

}, [pathname, currentCategoryId, debounceValue, router]);

    return(
        <div className="relative">
            <Search 
            className="absolute w-4 h-4 top-3 left-3 text-slate-600"
            />  

            <Input 
            value={value}
            onChange={(e)=>setValue(e.target.value)}
            className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible: ring-slate-200" 
            placeholder="Ssearch for a course"
            /> 
        </div>
    )
}