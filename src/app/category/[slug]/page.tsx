
'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArticleCard } from '@/components/article-card';
import { useDataStore } from '@/hooks/use-data-store.tsx';
import type { Category } from '@/lib/types';
import PublicLayout from '@/app/(public)/layout';

export default function CategoryPage() {
  const params = useParams();
  const { articles, categories, isInitialized } = useDataStore();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  
  const slug = typeof params.slug === 'string' ? params.slug : '';

  useEffect(() => {
    if(isInitialized) {
      const foundCategory = categories.find((c) => c.slug === slug);
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        notFound();
      }
    }
  }, [slug, categories, isInitialized]);

  if (!isInitialized || !category) {
    return <PublicLayout><div className="p-8">Loading category...</div></PublicLayout>;
  }

  const categoryArticles = articles.filter(
    (a) => a.category.slug === slug
  );

  return (
    <PublicLayout>
        <main className="p-4 sm:p-6 md:p-8">
          <header className="mb-8">
            <h1 className="font-headline text-4xl font-bold">
              {category.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {`Browsing ${categoryArticles.length} article(s).`}
            </p>
          </header>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {categoryArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </main>
    </PublicLayout>
  );
}
