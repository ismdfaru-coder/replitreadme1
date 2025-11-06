
'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDataStore } from '@/hooks/use-data-store.tsx';
import type { Article } from '@/lib/types';
import PublicLayout from '@/app/(public)/layout';
import { ArticleHeader } from '../_components/article-header';
import { ArticleActionBar } from '../_components/article-action-bar';
import { ArticleComments } from '../_components/article-comments';
import { YouTubeEmbed } from '../_components/youtube-embed';

export default function ArticlePage() {
  const params = useParams();
  const { articles, isInitialized, updateArticle } = useDataStore();
  const [article, setArticle] = useState<Article | undefined>(undefined);

  const slug = typeof params.slug === 'string' ? params.slug : '';

  useEffect(() => {
    if (isInitialized) {
      const foundArticle = articles.find((a) => a.slug === slug);
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        notFound();
      }
    }
  }, [slug, articles, isInitialized, notFound]);

  if (!isInitialized || !article) {
    return <PublicLayout><div>Loading article...</div></PublicLayout>;
  }
  
  const readingTime = Math.ceil(article.content.split(' ').length / 200);

  return (
    <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article>
                <ArticleHeader article={article} readingTime={readingTime} />

                <ArticleActionBar article={article} />
                
                {article.videoUrl && (
                  <div className='my-8'>
                    <YouTubeEmbed videoUrl={article.videoUrl} />
                  </div>
                )}

                <div
                    className="prose prose-lg dark:prose-invert mx-auto py-12"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>

            <ArticleComments article={article} onCommentAdded={updateArticle} />
        </div>
    </PublicLayout>
  );
}
