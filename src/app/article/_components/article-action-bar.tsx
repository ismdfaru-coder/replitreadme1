
'use client';

import { useState, useEffect } from 'react';
import type { Article } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Mail, Link as LinkIcon, Bookmark, Facebook, Twitter } from "lucide-react";

interface ArticleActionBarProps {
    article: Article;
}

export function ArticleActionBar({ article }: ArticleActionBarProps) {
    const { toast } = useToast();
    const [isSaved, setIsSaved] = useState(false);
    const [savedArticles, setSavedArticles] = useState<string[]>([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('saved-articles') || '[]');
        setSavedArticles(saved);
        setIsSaved(saved.includes(article.id));
    }, [article.id]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied", description: "The article URL has been copied to your clipboard." });
    };

    const handleToggleSave = () => {
        const newSavedArticles = isSaved 
            ? savedArticles.filter(id => id !== article.id)
            : [...savedArticles, article.id];
        
        localStorage.setItem('saved-articles', JSON.stringify(newSavedArticles));
        setSavedArticles(newSavedArticles);
        setIsSaved(!isSaved);
        toast({
            title: isSaved ? "Article Unsaved" : "Article Saved",
            description: isSaved ? "Removed from your saved articles." : "You can find it later in your saved list."
        });
    };

    const getShareUrl = (platform: 'twitter' | 'facebook') => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(article.title);
        if (platform === 'twitter') {
            return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        }
        if (platform === 'facebook') {
            return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        }
        return '';
    }

    return (
        <div className="sticky top-16 bg-background/95 backdrop-blur z-20">
            <div className="flex items-center justify-center space-x-2 md:space-x-4 py-3">
                <Button variant="ghost" size="sm" onClick={handleToggleSave} className="flex items-center space-x-2">
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    <span className="hidden md:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </Button>

                <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                    </Button>
                </a>
                
                <a href={getShareUrl('twitter')} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Share on Twitter/X</span>
                    </Button>
                </a>

                <a href={getShareUrl('facebook')} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Share on Facebook</span>
                    </Button>
                </a>

                <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                    <LinkIcon className="h-4 w-4" />
                    <span className="sr-only">Copy Link</span>
                </Button>
            </div>
            <Separator />
        </div>
    );
}
