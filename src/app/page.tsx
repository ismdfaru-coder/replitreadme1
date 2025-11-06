
'use client';

import { useDataStore } from '@/hooks/use-data-store.tsx';
import PublicLayout from './(public)/layout';
import { HeroSection } from '@/components/hero-section';
import { MagazineArticleCard } from '@/components/magazine-article-card';

export default function Home() {
  const { articles, isInitialized } = useDataStore();

  if (!isInitialized) {
    return <PublicLayout><div className="p-8 text-center">Loading articles...</div></PublicLayout>;
  }

  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <PublicLayout>
      {articles.length > 0 ? (
        <>
          {featuredArticle && <HeroSection article={featuredArticle} />}
          
          <div className="container px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {remainingArticles.map(article => (
                <MagazineArticleCard key={article.id} article={article} variant="grid" />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="container px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold font-headline">No articles found.</h2>
          <p className="text-muted-foreground mt-2">Please go to the admin panel to create your first article.</p>
        </div>
      )}
    </PublicLayout>
  );
}
