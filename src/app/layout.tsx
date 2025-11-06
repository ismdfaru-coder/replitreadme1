
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { DataStoreProvider } from '@/hooks/use-data-store.tsx';

export const metadata: Metadata = {
  title: 'mysite',
  description: 'A curated collection of thought-provoking essays and stories.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/jka5dji.css" />
      </head>
      <body className="font-body antialiased bg-background">
        <DataStoreProvider>
          {children}
        </DataStoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
