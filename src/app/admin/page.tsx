'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Newspaper, PlusCircle, Wand2 } from "lucide-react";
import Link from "next/link";
import { useDataStore } from "@/hooks/use-data-store.tsx";

export default function AdminDashboard() {
  const { articles, categories } = useDataStore();
  const totalArticles = articles.length;
  const totalCategories = categories.length;

  return (
    <main className="p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back! Here's an overview of your content.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              articles published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              content categories
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="font-headline text-2xl font-bold">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <CardTitle className="text-lg">Create New Article</CardTitle>
            <CardDescription className="mt-2 mb-4">
              Start writing a new piece of content.
            </CardDescription>
            <Button asChild>
              <Link href="/admin/articles/new">
                <PlusCircle className="mr-2 h-4 w-4" /> New Article
              </Link>
            </Button>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <CardTitle className="text-lg">Optimize Content</CardTitle>
            <CardDescription className="mt-2 mb-4">
              Use AI to improve your article's engagement.
            </CardDescription>
            <Button asChild variant="secondary">
              <Link href="/admin/optimize">
                <Wand2 className="mr-2 h-4 w-4" /> Optimize
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
