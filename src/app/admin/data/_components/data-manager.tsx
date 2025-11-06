
'use client';

import { useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getDbJsonString, uploadDbJsonToGithub } from '@/lib/actions';
import { Download, Loader2, Upload } from 'lucide-react';
import { useEffect } from 'react';

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Upload className="mr-2 h-4 w-4" />
      )}
      Upload and Overwrite
    </Button>
  );
}

export function DataManager() {
  const { toast } = useToast();
  const [isDownloading, startDownloadTransition] = useTransition();

  const [state, formAction] = useActionState(uploadDbJsonToGithub, { success: false, message: '' });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success',
          description: state.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  const handleDownload = () => {
    startDownloadTransition(async () => {
      try {
        const jsonString = await getDbJsonString();
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'readme-hub-backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
          title: 'Success',
          description: 'Your data backup has been downloaded.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to download data.',
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Download Site Data</CardTitle>
          <CardDescription>
            Download a full backup of your articles and categories as a JSON file.
            Keep this file safe.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Backup
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Upload Site Data to GitHub</CardTitle>
            <CardDescription>
              To restore your site from a backup, upload the JSON file here.
              Warning: This will overwrite the `db.json` file in your GitHub repository.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="jsonFile">JSON Backup File</Label>
              <Input id="jsonFile" name="jsonFile" type="file" accept=".json" required />
            </div>
          </CardContent>
          <CardFooter>
            <UploadButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
