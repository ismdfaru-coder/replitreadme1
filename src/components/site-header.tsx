
'use client';

import Link from 'next/link';
import { Button } from './ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="text-xs font-medium tracking-wider" asChild>
            <Link href="/">MENU</Link>
          </Button>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="flex items-center">
            <span className="font-headline text-2xl font-bold tracking-tight">mysite</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-xs font-medium tracking-wider" asChild>
            <Link href="/newsletter">NEWSLETTER</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs font-medium tracking-wider" asChild>
            <Link href="/admin/login">SIGN IN</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
