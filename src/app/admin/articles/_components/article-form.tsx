
'use client';

import { useRef, useState, useTransition } from 'react';
import { createArticle as formActionFunction } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Article } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useDataStore } from '@/hooks/use-data-store.tsx';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';

function SubmitButton({ isUpdate, isPending }: { isUpdate: boolean, isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? 'Saving...' : isUpdate ? 'Update Article' : 'Create Article'}
    </Button>
  );
}

export function ArticleForm({ article: existingArticle }: { article?: Article }) {
    const { categories, createArticle, updateArticle } = useDataStore();
    const router = useRouter();
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedCategory, setSelectedCategory] = useState(existingArticle?.category.id || (categories.length > 0 ? categories[0].id : ''));
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const data = {
            id: existingArticle?.id,
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            category: selectedCategory,
            featured: formData.get('featured') === 'on',
            videoUrl: formData.get('videoUrl') as string,
        };

        startTransition(async () => {
            const result = await formActionFunction(data);

            if (result.message && !result.errors && result.data) {
                toast({
                    title: 'Success',
                    description: result.message,
                });

                if (existingArticle) {
                    updateArticle(result.data);
                } else {
                    createArticle(result.data);
                }
                router.push('/admin/articles');

            } else if (result.message && result.errors) {
                const errorMsg = Object.values(result.errors).flat().join(' ');
                toast({
                    variant: 'destructive',
                    title: `Error ${existingArticle ? 'updating' : 'creating'} article`,
                    description: errorMsg || result.message,
                });
            }
        });
    };


    return (
        <form ref={formRef} onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
            <CardTitle>{existingArticle ? 'Edit Article' : 'New Article'}</CardTitle>
            <CardDescription>
                {existingArticle ? 'Update the details for your article.' : 'Fill in the details for your new article.'}
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                id="title"
                name="title"
                placeholder="Your article title"
                defaultValue={existingArticle?.title}
                required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="videoUrl">YouTube Video URL (Optional)</Label>
                <Input
                id="videoUrl"
                name="videoUrl"
                placeholder="e.g., https://www.youtube.com/watch?v=..."
                defaultValue={existingArticle?.videoUrl}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Content (HTML supported)</Label>
                <Textarea
                id="content"
                name="content"
                placeholder="Write your article here..."
                className="min-h-[300px]"
                defaultValue={existingArticle?.content}
                required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                   <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory} required>
                      <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                      {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                          </SelectItem>
                      ))}
                      </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="featured">Featured Article</Label>
                    <div className="flex items-center space-x-2 h-10">
                        <Switch 
                            id="featured" 
                            name="featured" 
                            defaultChecked={existingArticle?.featured}
                        />
                        <Label htmlFor="featured" className="text-sm font-normal text-muted-foreground">
                            Set this as a main featured article.
                        </Label>
                    </div>
                </div>
            </div>
            </CardContent>
            <CardFooter className="justify-end">
            <SubmitButton isUpdate={!!existingArticle} isPending={isPending} />
            </CardFooter>
        </Card>
        </form>
    )
}
