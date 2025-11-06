
'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { manageCategory, deleteCategory } from '@/lib/actions';
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
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDataStore } from '@/hooks/use-data-store.tsx';
import { useRouter } from 'next/navigation';
import type { Category } from '@/lib/types';


const initialState = {
  message: '',
  errors: {},
  data: null
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Saving...' : 'Add Category'}
        </Button>
    );
}

export function CategoryManager() {
    const { categories, addCategory, removeCategory } = useDataStore();
    const [state, formAction] = useActionState(manageCategory, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleting, startDeleteTransition] = useTransition();

    const handleDelete = () => {
      if (!categoryToDelete) return;
      
      startDeleteTransition(async () => {
        const result = await deleteCategory(categoryToDelete.id);
        if (result.success) {
          removeCategory(categoryToDelete.id);
          toast({
            title: "Success",
            description: result.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message,
          });
        }
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
      });
    }

    const openDeleteDialog = (category: Category) => {
      setCategoryToDelete(category);
      setIsDeleteDialogOpen(true);
    }

    useEffect(() => {
        if(state?.message && !state.errors && state.data) {
            toast({ title: "Success", description: state.message });
            addCategory(state.data); // Add to the local store
            formRef.current?.reset();
            router.push('/admin/categories'); 
        } else if (state?.message && state.errors) {
            const errorMsg = Object.values(state.errors).flat().join(' ');
            toast({
                variant: 'destructive',
                title: 'Error adding category',
                description: errorMsg || state.message,
            });
        }
    }, [state, toast, router, addCategory]);

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <form ref={formRef} action={formAction}>
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>
                  Create a new category for your articles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Technology" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Category Slug</Label>
                  <Input id="slug" name="slug" placeholder="e.g., technology" required />
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Existing Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" disabled>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(cat)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              category "{categoryToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
