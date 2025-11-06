
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';

export function SiteFooter() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} mysite. All rights reserved.</p>
      </div>
    </footer>
  );
}
