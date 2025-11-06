import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Film, FileText } from 'lucide-react';

interface MagazineArticleCardProps {
  article: Article;
  variant?: 'grid' | 'list';
}

export function MagazineArticleCard({ article, variant = 'grid' }: MagazineArticleCardProps) {
  const isVideo = !!article.videoUrl;
  
  if (variant === 'list') {
    return (
      <article className="flex flex-col sm:flex-row gap-6 border-b pb-8 mb-8 group">
        <Link href={`/article/${article.slug}`} className="flex-shrink-0 sm:w-1/3">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {isVideo && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                <Film className="h-10 w-10 text-white/80" />
              </div>
            )}
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={article.imageHint}
            />
          </div>
        </Link>
        
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-muted-foreground">
              {isVideo ? (
                <>
                  <Film className="h-3.5 w-3.5" />
                  VIDEO
                </>
              ) : (
                <>
                  <FileText className="h-3.5 w-3.5" />
                  ESSAY
                </>
              )}
            </span>
            <span className="text-muted-foreground">•</span>
            <Badge asChild variant="outline" className="border-primary/50 text-primary text-xs">
              <Link href={`/category/${article.category.slug}`}>{article.category.name}</Link>
            </Badge>
          </div>
          
          <h3 className="font-headline text-2xl sm:text-3xl font-bold leading-tight mb-3">
            <Link href={`/article/${article.slug}`} className="hover:text-primary transition-colors">
              {article.title}
            </Link>
          </h3>
          
          <p className="text-base text-muted-foreground leading-relaxed line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          
          <div className="text-xs text-muted-foreground mt-auto">
            {article.publishedAt}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={`/article/${article.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden mb-4">
          {isVideo && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
              <Film className="h-10 w-10 text-white/80" />
            </div>
          )}
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={article.imageHint}
          />
        </div>
      </Link>
      
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-muted-foreground">
          {isVideo ? (
            <>
              <Film className="h-3.5 w-3.5" />
              VIDEO
            </>
          ) : (
            <>
              <FileText className="h-3.5 w-3.5" />
              ESSAY
            </>
          )}
        </span>
        <span className="text-muted-foreground">•</span>
        <Badge asChild variant="outline" className="border-primary/50 text-primary text-xs">
          <Link href={`/category/${article.category.slug}`}>{article.category.name}</Link>
        </Badge>
      </div>
      
      <h3 className="font-headline text-xl sm:text-2xl font-bold leading-tight mb-2">
        <Link href={`/article/${article.slug}`} className="hover:text-primary transition-colors">
          {article.title}
        </Link>
      </h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
        {article.excerpt}
      </p>
      
      <div className="text-xs text-muted-foreground">
        {article.publishedAt}
      </div>
    </article>
  );
}
