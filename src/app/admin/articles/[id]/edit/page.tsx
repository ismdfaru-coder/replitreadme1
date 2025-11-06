
'use client';

import { useParams, notFound } from 'next/navigation';
import { useDataStore } from '@/hooks/use-data-store.tsx';
import { ArticleForm } from '../../_components/article-form';
import { useEffect, useState } from 'react';
import type { Article } from '@/lib/types';

export default function EditArticlePage() {
  const params = useParams();
  const { getArticleById, isInitialized } = useDataStore();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (isInitialized) {
      if (id) {
        const foundArticle = getArticleById(id);
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          notFound();
        }
      }
      setIsLoading(false);
    }
  }, [id, getArticleById, isInitialized, notFound]);

  if (isLoading || !isInitialized) {
    return (
        <main className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div>Loading article...</div>
            </div>
        </main>
    );
  }

  if (!article) {
     return (
        <main className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div>Article not found.</div>
            </div>
        </main>
    );
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-headline text-3xl font-bold">Edit Article</h1>
        <p className="text-muted-foreground">
          Update the details for your article.
        </p>
        <div className="mt-8">
          {/* Using a key is crucial here to force a re-mount of the form when the article changes, preventing state issues. */}
          <ArticleForm key={article.id} article={article} />
        </div>
      </div>
    </main>
  );
}
