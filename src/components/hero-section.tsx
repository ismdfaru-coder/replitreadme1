import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  article: Article;
}

export function HeroSection({ article }: HeroSectionProps) {
  return (
    <Link href={`/article/${article.slug}`} className="block group">
      <div className="relative w-full aspect-[16/6] overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          data-ai-hint={article.imageHint}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center text-white max-w-4xl">
            <Badge variant="outline" className="mb-4 border-white/70 text-white bg-black/30 backdrop-blur-sm">
              {article.category.name}
            </Badge>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
