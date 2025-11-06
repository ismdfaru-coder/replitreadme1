import { CategoryManager } from './_components/category-manager';

export default function AdminCategoriesPage() {
  return (
    <main className="p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold">Categories</h1>
      <p className="text-muted-foreground">
        Add, edit, or delete article categories.
      </p>

      <div className="mt-8 max-w-4xl mx-auto">
        <CategoryManager />
      </div>
    </main>
  );
}
