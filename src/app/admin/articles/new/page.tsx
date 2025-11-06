import { ArticleForm } from "../_components/article-form";

export default function NewArticlePage() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-headline text-3xl font-bold">Create New Article</h1>
        <p className="text-muted-foreground">
          Fill out the form below to publish a new article.
        </p>
        <div className="mt-8">
            <ArticleForm />
        </div>
      </div>
    </main>
  );
}
