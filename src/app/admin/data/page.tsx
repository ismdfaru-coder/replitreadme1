import { DataManager } from './_components/data-manager';

export default function DataPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-headline text-3xl font-bold">Data Management</h1>
        <p className="text-muted-foreground mt-1">
          Download a backup of your site's content or upload a file to restore it.
        </p>
        <div className="mt-8">
          <DataManager />
        </div>
      </div>
    </main>
  );
}
