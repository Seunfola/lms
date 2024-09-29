'use client';
import { useAuth, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { SearchInput } from './search-input';

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isOnCoursePage = pathname?.includes('/courses');
  const isOnTutorPage = pathname?.startsWith('/teacher');
  const isOnSearchPage = pathname === '/search';

  return (
    <div>
      {isOnSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex ml-auto gap-x-2">
        {(isOnCoursePage || isOnTutorPage) && (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </Link>
        )}

        {userId && (
          <Link href={`/profile/${userId}`}>
            <Button size="sm" variant="default">Profile</Button>
          </Link>
        )}

        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
