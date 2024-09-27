'use client';
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { LogOut } from "lucide-react";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  // Determine if the user is on specific pages
  const isTutorPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {/* Conditionally render SearchInput for search page */}
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex ml-auto gap-x-2">
        {/* Show exit button for tutor or course pages */}
        {(isTutorPage || isCoursePage) && (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </Link>
        )}

        {/* Show UserButton for authentication actions */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
