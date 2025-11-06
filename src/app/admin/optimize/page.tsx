import { OptimizeForm } from './_components/optimize-form';

export default function OptimizePage() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-headline text-3xl font-bold">Optimize Content Block</h1>
        <p className="text-muted-foreground mt-1">
          Use our AI-powered tool to analyze and rewrite your content for maximum engagement.
        </p>
        <div className="mt-8">
          <OptimizeForm />
        </div>
      </div>
    </main>
  );
}
