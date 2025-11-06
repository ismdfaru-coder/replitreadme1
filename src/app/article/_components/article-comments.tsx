
'use client';

import { useState, useTransition } from 'react';
import type { Article, Comment } from "@/lib/types";
import { addComment } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCommentsProps {
    article: Article;
    onCommentAdded: (updatedArticle: Article) => void;
}

function CommentForm({ articleId, onCommentAdded, onCancel }: { articleId: string, onCommentAdded: (data: any) => void, onCancel: () => void }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            articleId,
            author: formData.get('author') as string,
            content: formData.get('content') as string,
        };

        startTransition(async () => {
            const result = await addComment(data);
            if (result.success && result.data) {
                toast({ title: "Comment posted!" });
                onCommentAdded(result.data);
                (event.target as HTMLFormElement).reset();
                onCancel(); // Hide form on success
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error posting comment',
                    description: result.message,
                })
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-secondary/50">
            <h3 className="font-headline text-xl font-semibold">Leave a comment</h3>
             <div>
                <label htmlFor="author" className="block text-sm font-medium mb-1">Name</label>
                <Input id="author" name="author" required placeholder="Your name" />
            </div>
             <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">Comment</label>
                <Textarea id="content" name="content" required placeholder="Share your thoughts..." />
            </div>
            <div className="flex justify-end space-x-2">
                 <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                 <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Comment
                 </Button>
            </div>
        </form>
    )
}

function CommentItem({ comment }: { comment: Comment }) {
    return (
        <div className="py-6">
            <p className="font-semibold font-headline">{comment.author}</p>
            <p className="text-sm text-muted-foreground mb-2">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </p>
            <p className="text-foreground/90">{comment.content}</p>
        </div>
    )
}

export function ArticleComments({ article, onCommentAdded }: ArticleCommentsProps) {
    const [showForm, setShowForm] = useState(false);
    const comments = article.comments || [];

    return (
        <div className="py-12">
            <Separator />
            <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-headline text-3xl font-bold">
                        Comments ({comments.length})
                    </h2>
                    {!showForm && (
                        <Button onClick={() => setShowForm(true)}>Add Comment</Button>
                    )}
                </div>

                {showForm && (
                    <div className="mb-8">
                        <CommentForm articleId={article.id} onCommentAdded={onCommentAdded} onCancel={() => setShowForm(false)}/>
                    </div>
                )}
                
                <div className="space-y-4">
                    {comments.length > 0 ? (
                       [...comments].reverse().map((comment, index) => (
                           <div key={comment.id}>
                                <CommentItem comment={comment} />
                                {index < comments.length - 1 && <Separator />}
                           </div>
                       ))
                    ) : (
                        !showForm && <p className="text-muted-foreground">Be the first to leave a comment.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
