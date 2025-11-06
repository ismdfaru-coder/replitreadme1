'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { callOptimizeContent } from '@/lib/actions';
import { Loader2, Wand2 } from 'lucide-react';
import type { OptimizeContentBlocksOutput } from '@/ai/flows/optimize-content-blocks';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  contentBlock: z.string().min(10, 'Content block is too short.'),
  websiteType: z.string().min(1, 'Website type is required.'),
  targetAudience: z.string().min(1, 'Target audience is required.'),
  exampleSites: z.string().min(1, 'Please provide at least one example site.'),
});

type FormValues = z.infer<typeof formSchema>;

export function OptimizeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeContentBlocksOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentBlock: '',
      websiteType: 'Blog',
      targetAudience: 'General audience',
      exampleSites: 'lifehacker.com, medium.com',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await callOptimizeContent(data);
    if (response.success) {
      setResult(response.data!);
    } else {
      setError(response.error!);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>
                Provide the content and context for optimization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contentBlock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content to Optimize</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your content block here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Blog, News Site" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Tech enthusiasts, Young professionals"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exampleSites"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example Sites (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., site1.com, site2.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Optimize
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
      <Card>
        <CardHeader>
          <CardTitle>AI-Optimized Result</CardTitle>
          <CardDescription>
            The optimized content and explanation will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {error && (
                <div className="text-destructive-foreground bg-destructive p-4 rounded-md">{error}</div>
            )}
            {result && (
                <div>
                    <div>
                        <h3 className="font-headline text-lg font-semibold mb-2">Optimized Content</h3>
                        <div className="prose dark:prose-invert rounded-md border p-4 bg-muted/50" dangerouslySetInnerHTML={{ __html: result.optimizedContentBlock }} />
                    </div>
                    <Separator className="my-6" />
                    <div>
                        <h3 className="font-headline text-lg font-semibold mb-2">Explanation</h3>
                        <p className="text-sm text-muted-foreground">{result.explanation}</p>
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
