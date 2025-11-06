
'use client';

import type { Article } from "@/lib/types";
import Link from 'next/link';

interface ArticleHeaderProps {
    article: Article;
    readingTime: number;
}

export function ArticleHeader({ article, readingTime }: ArticleHeaderProps) {
    return (
        <header className="py-12 md:py-20 text-center">
            <Link href={`/category/${article.category.slug}`} className="font-headline text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground">
                {article.category.name}
            </Link>
            <h1 className="mt-4 font-headline text-4xl md:text-6xl font-bold !leading-tight">
                {article.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
                {article.excerpt}
            </p>
            <div className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
                <span>By {article.author.name}</span>
                <span className="mx-2">&middot;</span>
                <span>{article.publishedAt}</span>
                <span className="mx-2">&middot;</span>
                <span>{readingTime} min read</span>
            </div>
        </header>
    );
}
