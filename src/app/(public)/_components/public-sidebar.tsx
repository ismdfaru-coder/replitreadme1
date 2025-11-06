
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDataStore } from '@/hooks/use-data-store.tsx';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/icons';
import { Home } from 'lucide-react';
import { usePublicLayout } from '../public-layout-context';

export function PublicSidebar() {
  const { categories, isInitialized } = useDataStore();
  const pathname = usePathname();
  const { setSidebarOpen } = usePublicLayout();

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="h-full flex flex-col bg-card text-card-foreground border-r">
        <div className="p-4 border-b">
             <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-7 w-7 text-primary" />
                <span className="font-headline text-2xl font-bold tracking-tighter">mysite</span>
            </Link>
        </div>
      <ScrollArea className="flex-1">
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
                <Button
                    variant={pathname === '/' ? 'secondary' : 'ghost'}
                    className="w-full justify-start font-headline text-base"
                    asChild
                >
                    <Link href="/" onClick={handleLinkClick}>
                        <Home className="mr-2 h-4 w-4" />
                        Home
                    </Link>
                </Button>
            </li>
            {isInitialized && categories.length > 0 && (
                <li className='pt-4'>
                    <h4 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</h4>
                    <ul className='space-y-1'>
                        {categories.map((category) => (
                        <li key={category.id}>
                            <Button
                            variant={pathname === `/category/${category.slug}` ? 'secondary' : 'ghost'}
                            className="w-full justify-start font-headline text-base"
                            asChild
                            >
                            <Link href={`/category/${category.slug}`} onClick={handleLinkClick}>
                                {category.name}
                            </Link>
                            </Button>
                        </li>
                        ))}
                    </ul>
                </li>
            )}
          </ul>
        </nav>
      </ScrollArea>
    </div>
  );
}
