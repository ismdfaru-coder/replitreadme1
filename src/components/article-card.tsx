
import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Film } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const isVideo = !!article.videoUrl;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg border-0 shadow-none rounded-none">
      <Link href={`/article/${article.slug}`} className="block group">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
            {isVideo && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                    <Film className="h-12 w-12 text-white/80" />
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
      <CardContent className="flex flex-1 flex-col p-4 bg-secondary">
        <div className="flex-1">
          <Badge asChild variant="outline" className="mb-2 border-primary/50 text-primary">
            <Link href={`/category/${article.category.slug}`}>{article.category.name}</Link>
          </Badge>
          <h3 className="font-headline text-2xl font-bold leading-snug">
            <Link href={`/article/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 text-base text-muted-foreground line-clamp-3">{article.excerpt}</p>
        </div>
        <div className="mt-4 pt-4 text-xs text-muted-foreground">
            <span>{article.publishedAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}
