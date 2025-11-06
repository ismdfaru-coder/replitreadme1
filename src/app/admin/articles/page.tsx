'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ArticleTable } from './_components/article-table';
import { useDataStore } from '@/hooks/use-data-store.tsx';

export default function AdminArticlesPage() {
  const { articles } = useDataStore();
  
  return (
    <main className="p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Articles</h1>
            <p className="text-muted-foreground">
                Manage all your published articles here.
            </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <ArticleTable articles={articles} />
      </div>
    </main>
  );
}
